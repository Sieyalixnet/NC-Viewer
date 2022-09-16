let main_frg_t = `precision mediump float;
varying vec4 v_color;
void main() {
   gl_FragColor = v_color;
}`
let main_vrx_t = `attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`

let grid_frg_t = `precision mediump float;
varying vec4 v_color;
void main() {
   gl_FragColor = v_color;
}`
let grid_vrx_t = `attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`

let value_surface_frg_t = `precision mediump float;
varying vec4 v_color;
void main() {
   gl_FragColor = v_color;
}`
let value_surface_vrx_t = `attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`
export let grid_vertex_shader = { shaderText: grid_vrx_t, shaderType: "x-shader/x-vertex" }
export let grid_fragment_shader = { shaderText: grid_frg_t, shaderType: "x-shader/x-fragment" }
export let vertex_shader = { shaderText: main_vrx_t, shaderType: "x-shader/x-vertex" }
export let fragment_shader = { shaderText: main_frg_t, shaderType: "x-shader/x-fragment" }
export let value_surface_vertex_shader = { shaderText: value_surface_vrx_t, shaderType: "x-shader/x-vertex" }
export let value_surface_fragment_shader = { shaderText: value_surface_frg_t, shaderType: "x-shader/x-fragment" }