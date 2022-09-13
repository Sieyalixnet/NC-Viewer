//utils is refactored functions that that most used in src.

export function map_object_to_array(obj) {//for Svelte {#each} 
    if (isObject(obj)) {
        let keys = Object.getOwnPropertyNames(obj);
        let map = keys.map((k) => { return { "k": k, "v": obj[k] } })
        return map;
    }
}

export function isObject(obj) {
    return (obj && typeof (obj) == "object" && !Array.isArray(obj))
}

export function isNumber(num){
    return typeof(num)=="number"?true:false;

}

export function get_attr_pass_geovector(slice, information_pass_geovector) {
    let result = []
    for (let index in slice) {
        let s = slice[index]
        let dimension_len = information_pass_geovector.dimensions_len[index]
        let dimension_name = information_pass_geovector.dimensions_name[index]
        let slice_helper = information_pass_geovector.slice_helpers[dimension_name]
        if (slice_helper) {
            let value = slice_helper[0]["v"]
            if (value) {
                if (s.length == 0) {
                    let obj = { "name": dimension_name, "value": value }
                    result.push(obj)
                } else if (s.length == 1) {
                    let v = value.filter((x, i) => { return i >= s[0] })
                    let obj = { "name": dimension_name, "value": v }
                    result.push(obj)
                } else if (s.length == 2) {
                    let v = value.filter((x, i) => { return i >= s[0] && i < s[1] })
                    let obj = { "name": dimension_name, "value": v }
                    result.push(obj)
                } else if (s.length == 3) {
                    let v = []
                    for (let i = s[0]; i < s[1]; i += s[2]) {
                        v.push(value[i])
                    }
                    let obj = { "name": dimension_name, "value": v }
                    result.push(obj)
                }
            }
        } else { result.push({}) }
    }
    return result

}

export function new_(obj_arr) {
    return JSON.parse(JSON.stringify(obj_arr))
}

export function slice_check(slice) {
    for (let item of slice) {
        if (item.length >= 2) {
            if (item[1] - item[0] <= 0) {
                return false
            }
        }

    }
    for (let item of slice.flat()) {
        if (item < 0) {
            return false
        }
    }
    return true
}

//#[test]
// let a = {
//     "aa":11,
//     "BB":22
// }

// console.log(map_object_to_array(a))