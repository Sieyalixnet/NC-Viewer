use crate::class::{
    file_manage::{FileManager, ReturnArray},
    variables::FileVariables,
};
use crate::Error;
use std::borrow::BorrowMut;
use std::collections::HashMap;

//PARTS: tauri State Control
//#[derive(Serialize)]
pub struct State {
    pub files: Vec<FileManager>,
}

impl State {
    pub fn new_file(&mut self, path: &str) -> usize {
        let file = FileManager::new(path);
        match file {
            Some(f) => {
                self.files.push(f);
                return self.files.len() - 1;
            }
            _ => return 9999,
        }
    }
    pub fn get_his(&self, index: usize) -> String {
        let file = self.files.get(index);
        match file {
            Some(f) => f.history.to_string(),
            _ => "None".to_string(),
        }
    }
    pub fn add_his(&mut self, index: usize, text: &str) {
        if (index + 1) <= self.files.len() {
            let file = &mut self.files[index];
            file.add_history(text);
        }
    }
    pub fn remove_file(&mut self, index: usize) {
        self.files.remove(index);
    }
    pub fn get_attr(&self, index: usize) -> Option<HashMap<String, String>> {
        let file = self.files.get(index);
        match file {
            Some(f) => Some(f.attributes.clone()),
            _ => None,
        }
    }
    pub fn get_var(&self, index: usize) -> Option<Vec<FileVariables>> {
        let file = self.files.get(index);
        match file {
            Some(f) => Some(f.variables.clone()),
            _ => None,
        }
    }
    pub fn get_value(
        &self,
        index: usize,
        name: &str,
        slice: Vec<Vec<usize>>,
    ) -> Option<ReturnArray> {
        let file = self.files.get(index);
        match file {
            Some(f) => Some(f.get_variable_slice(name, slice)),
            _ => None,
        }
    }
    pub fn save_value(
        &self,
        index: usize,
        name: &str,
        slice: Vec<Vec<usize>>,
    ) -> Result<ReturnArray, Error> {
        let file = self.files.get(index);
        // match file {
        //     Some(f) => Some(f.get_variable_slice(name, slice)),
        //     _ => None
        // }
        match file {
            Some(f) => Ok(f.get_variable_slice(name, slice)),
            _ => panic!("!!"),
        }
    }
}
