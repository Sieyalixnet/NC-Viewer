import {Time} from "./Time.js";

export function Calc_Distribution(actual_range, length) {
    let difference = (actual_range[1] - actual_range[0]) / (length - 1)
    let temp_t = [];
    for (let t = 0; t < length; t++) {
        temp_t.push(actual_range[0] + t * difference)
    }
    return temp_t
}

export function parse_str_to_time(s) {//Delta Time is not consistent with actual range of time
    s = s.toLowerCase()
    let Date_reg = /([0-9]{4})-([0-9]*)-([0-9]*)/g
    let Time_reg = /([0-9]*):([0-9]*):(.?)/g

    let Date_exec = Date_reg.exec(s)
    let Time_exec = Time_reg.exec(s)

    return new Time(Date_exec[1], Date_exec[2], Date_exec[3], Time_exec[1], Time_exec[2], Time_exec[3])
}

export function parse_str_to_time_since(s) {//it will returns time base and delta Time
    //Because most NOAA's NC files 'Unit' attr contains 'xxxx since XXXX-XX-XX xx:xx:xx', and its actual range of time is according to this, we need to parse the 'unit' of Time to guess the time distribution.
    s = s.toLowerCase()
    let Date_reg = /(.*?)since ([0-9]{4})-([0-9]*)-([0-9]*)/g
    let Time_reg = /([0-9]*):([0-9]*):(.?)/g

    let Date_exec = Date_reg.exec(s)//1->string Months/Days..,2~4->year,month,day
    let Time_exec = Time_reg.exec(s)
    let delta_t;//CATIONS: this delta_T is get from XXXX since XXXX-XXX...(datetime). IT IS NOT THE Delta_T in variable 
    console.log(s)
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


export function fillzero(s, count) {
    s = String(s)
    while (s.length < count) {
        s = '0' + s
    }
    return s
}
