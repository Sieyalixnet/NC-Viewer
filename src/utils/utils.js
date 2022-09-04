export function map_object_to_array(obj){//
    if(Array.isArray(obj)){return;}
    let keys = Object.getOwnPropertyNames(obj);
    let map = keys.map((k)=>{return {"k":k,"v":obj[k]}})
    // for(let item of map){
    //     item.v= obj[item.k]
    // }
    return map;
}

//#[test]
// let a = {
//     "aa":11,
//     "BB":22
// }

// console.log(map_object_to_array(a))