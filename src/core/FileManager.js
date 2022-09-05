import { invoke } from "@tauri-apps/api/tauri";
import { message } from '@tauri-apps/api/dialog';
import { map_object_to_array } from "../utils/utils.js";
export function createFileManager(path) {//rows->height, cols->width
    const data = new FileManager(path);
    return new Proxy(data, FileManagerHandler(data));
}

function FileManagerHandler(target) {
    return {
        get(target, key) {
            let res = Reflect.get(target, key);
            // console.log(target.OptionalAttributes)
            // console.log('get')
            return res
        },
        set(target, key, value) {
            let res = Reflect.set(target, key, value);
            // console.log('set')
            return res
        }
    }
}

export class FileManager {
    constructor(path) {
        this.path = path
        this.index = 10000
        this.attributes = {}
        this.history = ""
        this.variables = {}
    }
    async init() {
        await this.readfile();
        await this.get_history();
        await this.get_variables();
        await this.get_attr();
        this.parse_variables_attrs()
        try { this.parse_value_distribution("lat") } catch (e) { console.log(e) }
        try { this.parse_value_distribution("lon") } catch (e) { console.log(e) }
        try { this.parse_time() } catch (e) {
            alert("This file is not a format NC file. Failed to parse time.")
            console.log(e)
        }//TODO add Try catch    and default
    }
    async readfile() {
        this.index = await invoke("readfile", { path: this.path })
    }
    async add_history(s) { }
    async get_history() {
        this.history = await invoke("get_history", { index: Number(this.index) });
    }
    async get_attr() {
        this.attributes = await invoke("get_attributes", { index: Number(this.index) });
    }
    async get_variables() {
        this.variables = await invoke("get_variables", { index: Number(this.index) });
    }
    async get_values(name, slice) {
        return await invoke("get_values", { index: this.index, name: name, slice: slice });
    }
    async save_values(name, slice) {
        return await invoke("save_values", { index: this.index, name: name, slice: slice });
    }
    parse_variables_attrs() {
        for (let variable of this.variables) {
            for (let attr_Key in variable.attributes) {
                if (!isNaN(Number(variable.attributes[attr_Key]))) { variable.attributes[attr_Key] = Number(variable.attributes[attr_Key]) }//parse value to number
                if (typeof (variable.attributes[attr_Key]) == "string") {
                    if (variable.attributes[attr_Key].startsWith("[") && variable.attributes[attr_Key].endsWith("]")) {
                        let result = []
                        console.log(variable.attributes[attr_Key].length)
                        let v = variable.attributes[attr_Key].slice(1, variable.attributes[attr_Key].length - 1)
                        v = v.split(",")
                        for (let i of v) {
                            if (i.length >= 1 && !isNaN(Number(i))) {
                                result.push(Number(i))
                            }
                        }
                        variable.attributes[attr_Key] = result
                    }
                }
            }
        }
    }
    parse_value_distribution(s) {//s=lat/lon
        let variable = this.variables.find(x => x.name.toLowerCase().includes(s))
        let length = variable["dimensions_len"][0]
        let actual_range = variable["attributes"]["actual_range"]
        let value_distribution = Calc_Distribution(actual_range, length)
        variable.slice_helper = map_object_to_array({
            "Value": value_distribution
        })
    }

    parse_time() {
        let locked_time_variable;//Because we do not use variable's name to determine whether a variable is "Time" or not. We should locked the "Time" variable when we succeed to match the variable use the key and value.
        let delta_t;
        let time_base;
        let actual_range;
        let dimension_len;

        locked_time_variable = this.variables.find(x => x.name.toLowerCase().includes("time"))
        if (locked_time_variable) {
            console.log(1)
            time_base = locked_time_variable.attributes["units"]
            dimension_len = locked_time_variable["dimensions_len"][0]
            actual_range = locked_time_variable.attributes["actual_range"]
            delta_t == locked_time_variable.attributes["delta_t"]
            if (!delta_t) {
                delta_t == locked_time_variable.attributes["avg_period"]
            }
        }

        //if the name does not contain "time", programme will directly search the time key and value of all variables.
        if (!time_base || !dimension_len || !actual_range || !delta_t) {
            Tag_delta_t:
            for (let variable of this.variables) {
                for (let attr_Key in variable.attributes) {
                    if (String(variable.attributes[attr_Key]).toLowerCase().includes("since")) {
                        time_base = variable.attributes[attr_Key];//get the value of "days/months since datetime"
                        dimension_len = variable["dimensions_len"][0]
                        actual_range = variable.attributes["actual_range"]
                        locked_time_variable = variable
                        break Tag_delta_t
                    }
                }
            }
            Tag_time_base:
            for (let variable of this.variables) {
                for (let attr_Key in variable.attributes) {
                    if (attr_Key.toLowerCase() == "delta_t" || attr_Key.toLowerCase() == "avg_period") {
                        delta_t = variable.attributes[attr_Key];
                        break Tag_time_base
                    }

                }
            }
        }

        let actual_range_time = parse_str_to_time_since(time_base)
        let actual_range_time_range = actual_range_time[0].AddDateIntoSeries_AcutalRange(actual_range_time[1], actual_range, dimension_len)
        //actual_range_time_range is use the actual_range and length of the variable and then guess their difference and then calculate the array of distribution of time.
        //it may be wrong because the month and year is not of same days.

        let temp_time = new Time
        let time_start = temp_time.fromDate(actual_range_time_range[0])
        let time_delta = parse_str_to_time(delta_t)
        let start_delta_time_range = time_start.AddDateIntoSeries_DeltaT(time_delta, dimension_len)
        //time_base_range is use the first value (start) of actual_range_time_range and avg_period or delta_t to determine the array of distribution of time. 

        let time_index = Array(dimension_len).fill(0).map((x, i) => { return i })

        locked_time_variable.slice_helper = map_object_to_array({
            "Time": start_delta_time_range["result_Str"],
            "Time (Date)": start_delta_time_range["result_Date"].map(x => x.toUTCString()),
            "Time (Predict)": actual_range_time_range.map(x => x.toUTCString()),
            time_index
        })
    }

}


function Calc_Distribution(actual_range, length) {
    let difference = (actual_range[1] - actual_range[0]) / (length - 1)
    let temp_t = [];
    for (let t = 0; t < length; t++) {
        temp_t.push(actual_range[0] + t * difference)
    }
    return temp_t
}

function parse_str_to_time(s) {//Delta Time is not consistent with actual range of time
    s = s.toLowerCase()
    let Date_reg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g
    let Time_reg = /([0-9]{2}):([0-9]{2}):(.?)/g

    let Date_exec = Date_reg.exec(s)
    let Time_exec = Time_reg.exec(s)

    return new Time(Date_exec[1], Date_exec[2], Date_exec[3], Time_exec[1], Time_exec[2], Time_exec[3])
}

function parse_str_to_time_since(s) {//it will returns time base and delta Time
    //Because most NOAA's NC files 'Unit' attr contains 'xxxx since XXXX-XX-XX xx:xx:xx', and its actual range of time is according to this, we need to parse the 'unit' of Time to guess the time distribution.
    s = s.toLowerCase()
    let Date_reg = /(.*?)since ([0-9]{4})-([0-9]{2})-([0-9]{2})/g
    let Time_reg = /([0-9]{2}):([0-9]{2}):(.?)/g

    let Date_exec = Date_reg.exec(s)//1->string Months/Days..,2~4->year,month,day
    let Time_exec = Time_reg.exec(s)
    let delta_t;//CATIONS: this delta_T is get from XXXX since XXXX-XXX...(datetime). IT IS NOT THE Delta_T in variable 
    let String_t = Date_exec[1];
    if (String_t.includes("year")) {
        delta_t = new Time(1)
    } else if (String_t.includes("month")) {
        delta_t = new Time(undefined, 1)
    } else if (String_t.includes("day")) {
        delta_t = new Time(undefined, undefined, 1)
    } else if (String_t.includes("hour")) {
        delta_t = new Time(undefined, undefined, undefined, 1)
    } else if (String_t.includes("min")) {
        delta_t = new Time(undefined, undefined, undefined, undefined, 1)
    } else if (String_t.includes("second")) {
        delta_t = new Time(undefined, undefined, undefined, undefined, undefined, 1)
    }
    return [new Time(Date_exec[2], Date_exec[3], Date_exec[4], Time_exec[1], Time_exec[2], Time_exec[3]), delta_t]
}

export class Time {
    constructor(Y, M, D, h, m, s) {
        this.year = Number(Y)
        this.month = Number(M)
        this.month_index = Number(M) - 1//this is the month index
        this.day = Number(D)
        this.hour = Number(h)
        this.minute = Number(m)
        this.second = Number(s)
    }
    fromDate(date) {
        this.year = date.getFullYear()
        this.month = date.getMonth() + 1
        this.month_index = date.getMonth()
        this.day = date.getDate()
        this.hour = date.getHours()
        this.minute = date.getMinutes()
        this.second = date.getSeconds()
        return this
    }
    getDate() {
        return new Date(Date.UTC(this.year, this.month_index, this.day == 0 ? 1 : this.day, this.hour, this.minute, this.second))
    }

    AddDateIntoSeries_DeltaT(Delta_T, amount) {//for delta_T or avg_period in variable
        let result_Date = []
        let result_Str = []
        for (let i = 0; i < amount; i++) {
            let t = this.getDate()
            if (Delta_T.year) { t.setFullYear(t.getFullYear() + Delta_T.year * i) }
            if (Delta_T.month) { t.setMonth(t.getMonth() + (Delta_T.month) * i) }
            if (Delta_T.day) { t.setDate(t.getDate() + Delta_T.day * i) }
            if (Delta_T.hour) { t.setHours(t.getHours() + Delta_T.hour * i) }
            if (Delta_T.minute) { t.setMinutes(t.getMinutes() + Delta_T.minute * i) }
            if (Delta_T.second) { t.setSeconds(t.getSeconds() + Delta_T.second * i) }
            result_Date.push(t)
            result_Str.push(`${t.getFullYear()}-${fillzero(t.getMonth() + 1, 2)}-${fillzero(t.getDate(), 2)} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)
        }
        return { result_Date, result_Str }

    }

    AddDateIntoSeries_AcutalRange(Delta_T, actual_range, length) {//CATIONS: this delta_T is get from XXXX since XXXX-XXX...(datetime). IT IS NOT THE Delta_T in variable 
        let difference = (actual_range[1] - actual_range[0]) / (length - 1)
        let temp_t = Calc_Distribution(actual_range, length)
        let result_Date = []

        for (let i of temp_t) {
            let t = this.getDate()
            if (Delta_T.year) { t.setFullYear(t.getFullYear() + Delta_T.year * i) }
            if (Delta_T.month) { t.setMonth(t.getMonth() + Delta_T.month * i) }
            if (Delta_T.day) { t.setDate(t.getDate() + Delta_T.day * i) }
            if (Delta_T.hour) { t.setHours(t.getHours() + Delta_T.hour * i) }
            if (Delta_T.minute) { t.setMinutes(t.getMinutes() + Delta_T.minute * i) }
            if (Delta_T.second) { t.setSeconds(t.getSeconds() + Delta_T.second * i) }
            result_Date.push(t)
        }
        return result_Date

    }
}

function fillzero(s, count) {
    s = String(s)
    while (s.length < count) {
        s = '0' + s
    }
    return s
}



// let a = new Time(1871, 7, 3, 8, 12, 10);
// console.log(a.getDate());

// let b = new Date("1800-01-02T00:00:00")
// console.log(b);