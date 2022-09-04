
use std::collections::HashMap;

#[derive(serde::Serialize,Clone)]
pub struct FileVariables{
    pub name:String,
    pub index:usize,
    pub dimensions_name:Vec<String>,
    pub dimensions_len:Vec<usize>,
    pub attributes:HashMap<String, String>
}
