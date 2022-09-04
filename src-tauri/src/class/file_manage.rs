use crate::class::utils::match_attr;
use crate::class::variables::FileVariables;
use ndarray::{Dim, IxDynImpl, SliceInfo, SliceInfoElem};
use netcdf::{self, Variable};
use std::collections::HashMap;
pub struct FileManager {
    pub file: netcdf::File,                  //instance of a file.
    pub history: String,                     //a std flow to debug
    pub attributes: HashMap<String, String>, //file's attributes
    pub variables: Vec<FileVariables>, //file's variables' attributes, they are not instance. If we need to use the instance of variable,we should choose it from file by given index and variable's name like "get_variable_slice".
}

#[derive(serde::Serialize, Clone, Debug)]
pub struct ReturnArray {
    pub data: Vec<f32>,
    pub shape: Vec<usize>,
}

impl FileManager {
    pub fn new(path: &str) -> Option<FileManager> {
        let file = netcdf::open(path);
        let mut his = "SUCCESS: new File read from ".to_string() + &path.to_string();
        his += "\n";
        match file {
            Ok(f) => {
                let mut result = FileManager {
                    file: f,
                    history: his,
                    attributes: HashMap::new(),
                    variables: vec![],
                };
                result.init_attributes();
                result.init_variables();
                Some(result)
            }
            Err(_) => None,
        }
    }
    pub fn add_history(&mut self, text: &str) {
        self.history += &text.to_string();
        self.history += "\n";
    }
    pub fn init_attributes(&mut self) {
        let attr_keys: Vec<String> = self
            .file
            .attributes()
            .map(|x| x.name().to_string())
            .collect();
        let attr_values: Vec<_> = self.file.attributes().map(|x| x.value().unwrap()).collect();

        let (his_out_add, attributes) = match_attr(attr_keys, attr_values);
        self.attributes = attributes;
        self.add_history(&his_out_add);
    }
    pub fn init_variables(&mut self) {
        let mut result: Vec<FileVariables> = vec![];
        let mut vars: Vec<Variable> = self.file.variables().collect();

        //names' initialize
        let vars_name: Vec<String> = vars.clone().into_iter().map(|x| x.name()).collect();

        //dimensions' initialize
        let mut variables_dimension_name: Vec<Vec<String>> = vec![];
        let mut variables_dimension_len: Vec<Vec<usize>> = vec![];
        for item in &mut vars {
            //get var's dimension
            let dimensions = item.dimensions();

            let mut dimension_name: Vec<String> = vec![];
            let mut dimension_len: Vec<usize> = vec![];
            for index in 0..dimensions.len() {
                dimension_name.push(dimensions[index].name());
                dimension_len.push(dimensions[index].len());
            }
            variables_dimension_name.push(dimension_name);
            variables_dimension_len.push(dimension_len);
        }

        //attributes initialize
        let mut var_attribute: Vec<HashMap<String, String>> = vec![];
        let mut his_out: String = String::new(); //to add the history
        for item in &mut vars {
            //get var's attributes
            his_out += &format!(
                "Try to add Attributes of Variable {name}:\n",
                name = item.name()
            );
            let attr_keys: Vec<String> = item.attributes().map(|x| x.name().to_string()).collect();
            let attr_values: Vec<_> = item.attributes().map(|x| x.value().unwrap()).collect();
            let (his_out_add, attributes) = match_attr(attr_keys, attr_values);
            var_attribute.push(attributes);
            his_out += &his_out_add;
        }

        //create the Variables and add then in result.
        if vars.len() == vars_name.len()
            && vars.len() == variables_dimension_name.len()
            && vars.len() == variables_dimension_len.len()
            && vars.len() == var_attribute.len()
        {
            self.variables = vec![];
            for i in 0..vars.len() {
                let f = FileVariables {
                    name: vars_name[i].clone(),
                    index: i,
                    dimensions_name: variables_dimension_name[i].clone(),
                    dimensions_len: variables_dimension_len[i].clone(),
                    //TODO Dimension'v
                    attributes: var_attribute[i].clone(),
                };
                result.push(f);
                self.add_history(&format!(
                    "SUCCESS: Add Variables {name}.",
                    name = vars_name[i].clone()
                ));
            }
            self.variables = result;
        } else {
            self.add_history("FAILED: Variables' length is not equal to each other. ");
        }

        self.add_history(&his_out);
    }
    pub fn get_variable_slice(&self, name: &str, slice: Vec<Vec<usize>>) -> ReturnArray {
        let var = &self.file.variable(name).unwrap(); //TODO use match instead of unwrap

        let mut sc: Vec<SliceInfoElem> = vec![];
        for v in slice {
            match v.len() {
                0 => {
                    sc.push(SliceInfoElem::from(..));
                }
                1 => {
                    sc.push(SliceInfoElem::Slice {
                        start: v[0] as isize,
                        end: None,
                        step: 1,
                    });
                }
                2 => {
                    sc.push(SliceInfoElem::Slice {
                        start: v[0] as isize,
                        end: Some(v[1] as isize),
                        step: 1,
                    });
                }
                3 => {
                    sc.push(SliceInfoElem::Slice {
                        start: v[0] as isize,
                        end: Some(v[1] as isize),
                        step: v[2] as isize,
                    });
                }
                _ => {}
            }
        }
        let sc_info;
        unsafe {
            sc_info =
                SliceInfo::<Vec<SliceInfoElem>, Dim<IxDynImpl>, Dim<IxDynImpl>>::new(sc).unwrap();
        }

        let value = var.clone().values::<f32>(None, None).unwrap();
        let result = value.slice(sc_info).into_owned();
        //return result;
        let shape: Vec<usize> = result.shape().into();
        let mut shape_count = 1 as usize;
        for i in shape.clone() {
            shape_count *= i
        }
        let raw_data: Vec<f32> = result.into_shape(vec![shape_count]).unwrap().into_raw_vec();
        let result = ReturnArray {
            shape: shape,
            data: raw_data,
        };
        result
    }
}
