export function map_object_to_array(obj){//for Svelte {#each} 
    if(Array.isArray(obj)){return;}
    let keys = Object.getOwnPropertyNames(obj);
    let map = keys.map((k)=>{return {"k":k,"v":obj[k]}})
    return map;
}

export function slice_check(slice) {
    for (let item of slice) {
        if (item.length >= 2) {
            if (item[1] - item[0]<= 0){
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