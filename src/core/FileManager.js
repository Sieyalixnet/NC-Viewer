import { invoke } from "@tauri-apps/api/tauri";
import { message } from '@tauri-apps/api/dialog';
import { Time } from "./Time.js";
import { Calc_Distribution, parse_str_to_time, parse_str_to_time_since, fillzero } from "./Time_Parser"
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
    async add_history(s) { 
        await invoke("add_history", { index: Number(this.index),text:s }) 
        await this.get_history()
    }
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




// let a = new Time(1871, 7, 3, 8, 12, 10);
// console.log(a.getDate());

// let b = new Date("1800-01-02T00:00:00")
// console.log(b);