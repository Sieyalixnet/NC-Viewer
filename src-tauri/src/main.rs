#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod class; //Should first use mod and then use the crate
mod utils;
mod state;
use crate::utils::types::CmdResult;
use crate::state::state::State;
use class::{variables::FileVariables, file_manage::ReturnArray};
use netcdf::{error::Error};
use std::{collections::HashMap, sync::Mutex};
use tauri::Manager;

pub struct RustState(pub Mutex<State>);

fn main() {
    tauri::Builder::default()
        .manage(RustState(Mutex::new(State { files: vec![] })))
        .invoke_handler(tauri::generate_handler![greet, readfile, get_history,get_attributes,get_variables,get_values,save_values])
        //
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

//PARTS: tauri Command

#[tauri::command]
fn readfile(path: &str, state: tauri::State<RustState>) -> usize {
    let mut state_guard = state.0.lock().unwrap();
    let index = state_guard.new_file(path);
    return index;
}

#[tauri::command]
fn get_history(index: usize, state: tauri::State<RustState>) -> String {
    let state_guard = state.0.lock().unwrap();
    state_guard.get_his(index)
}
#[tauri::command]
fn get_attributes(index: usize, state: tauri::State<RustState>) -> HashMap<String,String>{
    let state_guard = state.0.lock().unwrap();
    let file = state_guard.get_attr(index);
    match  file{
        Some(attr)=>attr,
        None=>HashMap::new()
    }
}
#[tauri::command]
fn get_variables(index: usize, state: tauri::State<RustState>) -> Vec<FileVariables>{
    let state_guard = state.0.lock().unwrap();
    let file = state_guard.get_var(index);
    match  file{
        Some(variable)=>variable,
        None=>Vec::new()
    }
}

#[tauri::command]
 fn  get_values(index: usize,name:&str,slice:Vec<Vec<usize>>,state: tauri::State<'_,RustState>)->ReturnArray{
    let state_guard = state.0.lock().unwrap();
    let file = state_guard.get_value(index,name,slice);
    match  file{
        Some(values)=>values,
        None=>ReturnArray { data: vec!(0.0), shape: vec!(0) }
    }
    
}

#[tauri::command]
async fn save_values(index: usize,name:&str,slice:Vec<Vec<usize>>,state: tauri::State<'_, RustState>)->CmdResult{
    let state_guard = state.0.lock().unwrap();
    let file = state_guard.save_value(index,name,slice);
    // let result = match  file{
    //     Some(values)=>values,
    //     None=>ReturnArray { data: vec!(0.0), shape: vec!(0) }
    // };
    let result = match  file{
        Ok(values)=>values,
        Err(_)=>ReturnArray { data: vec!(0.0), shape: vec!(0) }
    };
    wrap_err!(std::fs::write("./temp", serde_json::to_string_pretty(&result).unwrap()))    
}

#[tauri::command]
fn greet() -> HashMap<String, String> {
    let mut a = HashMap::new();
    a.insert("aa".to_string(), "bb".to_string());
    a
}

