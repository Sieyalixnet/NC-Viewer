
use netcdf::{self, AttrValue};
use std::collections::HashMap;

pub fn match_attr(
    attr_keys: Vec<String>,
    attr_values: Vec<AttrValue>,
) -> (String, HashMap<String, String>) {
    //in: values from attributes() and then get their Vectors of Keys and Values.
    //out: String for Histroy, HashMap for key-value pair. All they will convert to String and then convert again in JavaScript.
    let mut attributes: HashMap<String, String> = HashMap::new();
    let mut his_out = String::new();
    if attr_keys.len() <= attr_values.len() {
        for index in 0..attr_keys.len() {
            let k = attr_keys[index].clone();
            let mut v_save: String = String::new();
            match attr_values[index].clone() {
                AttrValue::Uchar(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Uchars(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Schar(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Schars(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Ushort(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Ushorts(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Short(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Shorts(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Uint(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Uints(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Int(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Ints(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Ulonglong(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Ulonglongs(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Longlong(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Longlongs(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Float(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Floats(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Double(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Doubles(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Str(v) => {
                    v_save = parse_str::to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
                AttrValue::Strs(v) => {
                    v_save = parse_str::vec_to_str(v);
                    attributes.insert(k.clone(), v_save.clone());
                }
            }
            let his = format!(
                "SUCCESS: Add Attribute key {k}, value {s}.\n",
                k = &k,
                s = &v_save
            );
            his_out += &his;
        }
    };

    (his_out, attributes)
}

mod parse_str {
    //i
    pub fn to_str<T: ToString>(v: T) -> String {
        v.to_string()
    }
    pub fn vec_to_str<T: ToString>(v: Vec<T>) -> String {
        let mut s = String::new();
        s += &"[";
        for item in v {
            s += &item.to_string();
            s += &",";
        }
        s += &"]";
        s
    }
}
