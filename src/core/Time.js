import {Calc_Distribution,parse_str_to_time,parse_str_to_time_since,fillzero} from "./parser_slice"

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
