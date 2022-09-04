#[macro_export]
macro_rules! wrap_err {
  ($stat: expr) => {
    match $stat {
      Ok(a) => Ok(a),
      Err(err) => {
        Err(format!("{}", err.to_string()))
      }
    }
  };
}