import { isObject, new_ } from "../utils/utils";
import { downloadJSON } from "../utils/text";
import { createCanvas } from "../utils/canvas";
import { max_f64, min_f64, reflect_to, reshape } from "../utils/array";
import { radToDeg, degToRad, get_Matrix, set_Buffers, get_DEM_Buffer_from_Arrays, drawArr,drawElements, get_grid_Buffer_from_Array_Object, get_surface_Buffer_from_Array_Object,get_DEM_position_Buffer_from_Arrays,set_Element_Array_Buffers,get_LINES_DEM_position_Buffer_from_Arrays,get_LINES_DEM_Buffer_from_Arrays } from "./WebGL/render_3d_utils"

import { vertex_shader, fragment_shader, grid_vertex_shader, grid_fragment_shader, value_surface_fragment_shader, value_surface_vertex_shader } from "./WebGL/shaders/shader_3d_main_canvas";
import { webglUtils } from "../WebGLFundamentals/webgl-utils";
import { m4 } from "../WebGLFundamentals/m4"
export function createVector(data, shape, attr) {//rows->height, cols->width
    const vector = new Geovector(data, shape, attr);
    return new Proxy(vector, VectorHandler(vector));
}

function VectorHandler(target) {
    return {
        get(target, key) {
            let res = Reflect.get(target, key);
            if (target.OptionalAttributes[key]) { return target.OptionalAttributes[key] }
            return res
        },
        set(target, key, value) {
            let res = Reflect.set(target, key, value);
            return res
        }
    }
}

export class Geovector {
    constructor(data, shape, attr) {
        this.data = data//this data is different from Geovector in another Project. it should be flat in 1D-array to save.
        this.shape = shape
        if (isObject(attr)) {
            this.OptionalAttributes = attr
        } else {
            this.OptionalAttributes = {}
        }
        try {
            this.reshape()
            this.initRender()
        } catch (e) { console.log(e) }
    }
    reshape(shape = this.shape) {
        this.data = reshape(this.data, shape)
    }
    set_attr(key, value) {
        this.OptionalAttributes[key] = value
    }
    reshape_to(dimension) {
        let result = null;
        try {
            result = reshape(this.data, dimension, "object")
        } catch (e) {
            return { e }
        }
        if (result) {//pay attention that these code will make a closure if we do not use a deep copy for the object "result".
            this.data = new_(result["tensor"])
            let shape = result["shape"]
            this.shape = new_(shape)
            return { shape: this.shape }

        }
    }
    max_value(index) { return max_f64(this.data[index].flat()) }
    min_value(index) { return min_f64(this.data[index].flat()) }
    initRender() {
        let scale_param;
        let max_length = Math.max(this.shape[1], this.shape[2]);
        if (max_length <= 500) { scale_param = 1 } else {
            scale_param = Math.round((1 / Math.ceil(max_length / 500)) * 100) / 100
        }

        this.OptionalAttributes.default_cam = {
            translation: [0, 0, 0],
            rotation: [290, 0, 180],
            scale: [1, 1, 1].map(x => x * scale_param),
            camPos: [0, 0, 200],
            Ortho_Radians: 50,//Ortho unit or field of Radians
            ortho: true
        }

        this.bufferIndex = 0;

        // this.OptionalAttributes.grid = {
        //     //x,y,z should be accorded with index of Data.
        //     //IT IS NOT real coordinate of the points.
        //     x: [0, 60, 120, 180, 240, 300, 360].map(x => x / 2.5),//width, lon, from 0
        //     y: [0, 60, 120, 180].map(x => x / 2.5),//all of them should be sorted//height, lat, from 0

        //     z: [0]

        // }
        // this.OptionalAttributes.surface = {
        //     z: [10,20,30]

        // }
    }
    useBuffer(num) {
        let result = []
        let Index = this.bufferIndex
        for (let i = Index; i < Index + num; i++) {
            result.push(i)
        }
        this.bufferIndex += num
        return result

    }
    clearBufferIndex() { this.bufferIndex = 0 }
    saveCam(cam) {
        this.OptionalAttributes.saved_cam = new_(cam)
    }
    clearWebGL(){
        this.renderWebGL={}
    }
    render() {
        if (Array.isArray(this.renderWebGL.drawScene)) {
            for (let fn of this.renderWebGL.drawScene) { fn() };
        }
    }
    renderSurface() {
        let canvas = document.querySelector("#MainCanvas");
        let gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }
        let bufferIndeces = this.useBuffer(2)
        let program = webglUtils.createProgramFromScripts(gl, [value_surface_fragment_shader, value_surface_vertex_shader], ["a_position", "a_color"], bufferIndeces);
        gl.useProgram(program);
        let grid_matrixLocation = gl.getUniformLocation(program, "u_matrix");
        let buffers = get_surface_Buffer_from_Array_Object(gl, this.shape, this.OptionalAttributes.surface)
        set_Buffers(gl, program, bufferIndeces[0], {bufferDataValue:buffers.position}, 3, { BufferType: gl.FLOAT })
        set_Buffers(gl, program, bufferIndeces[1], {bufferDataValue:buffers.texcoord}, 4, { BufferType: gl.UNSIGNED_BYTE, Normalize: true })
        let shape = this.shape
        let export_matrix = this.renderWebGL.matrix
        this.renderWebGL.drawScene.push(drawScene)
        drawScene();
        function drawScene() {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
            // gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.DST_ALPHA)
            // gl.enable(gl.DEPTH_TEST);
            let mat = get_Matrix(gl, export_matrix, shape)
            gl.useProgram(program);
            gl.uniformMatrix4fv(grid_matrixLocation, false, mat);
            drawArr(gl, undefined, undefined, buffers.position.length / 2)
        }
    }
    renderGrid() {
        let canvas = document.querySelector("#MainCanvas");
        let gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }
        let bufferIndeces = this.useBuffer(2)
        let grid_program = webglUtils.createProgramFromScripts(gl, [grid_vertex_shader, grid_fragment_shader], ["a_position", "a_color"], bufferIndeces);
        gl.useProgram(grid_program);
        let grid_matrixLocation = gl.getUniformLocation(grid_program, "u_matrix");
        let grid_buffers = get_grid_Buffer_from_Array_Object(gl, this.OptionalAttributes.grid)
        set_Buffers(gl, grid_program, bufferIndeces[0], {bufferDataValue:grid_buffers.position}, 3, { BufferType: gl.FLOAT })
        set_Buffers(gl, grid_program, bufferIndeces[1], {bufferDataValue:grid_buffers.texcoord}, 4, { BufferType: gl.UNSIGNED_BYTE, Normalize: true })
        let shape = this.shape
        let export_matrix = this.renderWebGL.matrix
        this.renderWebGL.drawScene.push(drawScene)
        drawScene();
        function drawScene() {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.disable(gl.DEPTH_TEST);
            // gl.enable(gl.DEPTH_TEST);
            let mat = get_Matrix(gl, export_matrix, shape)
            gl.useProgram(grid_program);
            gl.uniformMatrix4fv(grid_matrixLocation, false, mat);
            drawArr(gl, gl.LINES, undefined, grid_buffers.position.length / 2)
        }
    }
    render3D(index, attr,RenderType,graph){
        this.clearWebGL()
        this.clearBufferIndex()
        if(RenderType=="buffers"){
        this.render3D_buffers(index,attr,1,{graph:graph})}
        else if(RenderType=="indices"){
            this.render3D_indices(index,attr,1,{graph:graph})
        }
        // this.render3D_indices(index,attr,1,{graph:"LINES"})

        // this.timeOut;
        // let recent = 1
        // this.timeOut = setInterval(() => {
        //     this.clearWebGL()
        //     this.clearBufferIndex()
        //     if(recent==1){this.render3D_indices(index,attr,1);recent=0} else{
        //         this.render3D_lines_indices(index,attr,1);recent=1
        //     }
        // }, 2000);
        // this.render3D_lines_indices(index,attr,1)
        // let slice = {slice_index:[0,1],slice_length:20}
        // let slices=[0,1,2,3]
        // for(let i of slices){
        // this.render3D_x(index,attr,{slice_index:i,slice_length:20})}
        // this.render()
    }
    render3D_buffers(index, attr,jump=1,type) {
        const {graph} = type
        let canvas = document.querySelector("#MainCanvas");
        let gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }
        // setup GLSL program
        let time1 = Date.now()
        let bufferIndeces = this.useBuffer(2)
        console.log(bufferIndeces)
        let main_program = webglUtils.createProgramFromScripts(gl, [vertex_shader, fragment_shader], ["a_position", "a_color"], bufferIndeces)

        let data =  new_(this.data[index])//.slice(slice_index*slice_length,(slice_index+1)*slice_length)
        if(jump!=1 && !isNaN(Number(jump))){
            for(let row in data){
                data[row]=data[row].filter((_,i)=>{return i%Number(jump)==0})
            }
            data=data.filter((_,i)=>{return i%Number(jump)==0})
        }
        let main_buffers;
        if(graph=="TRIANGLES"){
            main_buffers= get_DEM_Buffer_from_Arrays(gl,data, attr)}
        else if (graph=="LINES"){
            main_buffers = get_LINES_DEM_Buffer_from_Arrays(gl,data, attr)
        }
         
        console.log("get array", (Date.now() - time1))

        gl.useProgram(main_program);
        set_Buffers(gl, main_program, bufferIndeces[0], {bufferDataValue:main_buffers.position}, 3, { BufferType: gl.FLOAT })
        set_Buffers(gl, main_program, bufferIndeces[1],{bufferDataValue: main_buffers.texcoord}, 4, { BufferType: gl.UNSIGNED_BYTE, Normalize: true })
        console.log("set buffer", (Date.now() - time1))
        gl.useProgram(main_program);
        let main_matrixLocation = gl.getUniformLocation(main_program, "u_matrix");


        let export_matrix;
        let shape = [data.length,data[0].length]
        if(this.renderWebGL && Object.hasOwn(this.renderWebGL,"drawScene") && Array.isArray(this.renderWebGL.drawScene)){
            export_matrix = this.renderWebGL.matrix
            this.renderWebGL.drawScene.push(drawScene)
            console.log(this.renderWebGL.drawScene)
        } else {
            this.clearWebGL()
            this.clearBufferIndex()
            export_matrix= this.saved_cam ? new_(this.saved_cam) : new_(this.default_cam)
            this.renderWebGL = { matrix: export_matrix, drawScene: []};//[drawScene]
            this.renderWebGL.drawScene.push(drawScene)
        }
        drawScene();

        function drawScene() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.enable(gl.DEPTH_TEST);
            let mat = get_Matrix(gl, export_matrix, shape)

            gl.useProgram(main_program);
            gl.uniformMatrix4fv(main_matrixLocation, false, mat);
            gl.useProgram(main_program);
            let length;
            let primitiveType;
            if(graph=="TRIANGLES"){
                length= main_buffers.position.length / 3
                primitiveType=gl.TRIANGLES}
            else if (graph=="LINES"){
                length=main_buffers.position.length / 2
                primitiveType=gl.LINES
            }
            drawArr(gl, primitiveType, undefined,length)
            // gl.disable(gl.DEPTH_TEST);
            // gl.useProgram(grid_program);            
            // gl.uniformMatrix4fv(grid_matrixLocation, false, mat);
            // drawArr(gl, gl.LINES, undefined, grid_buffers.position.length / 2)
        }
    }
    render3D_indices(index, attr,jump=1,type) {
        const {graph} = type
        let canvas = document.querySelector("#MainCanvas");
        let gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }
        // setup GLSL program
        let time1 = Date.now()
        let bufferIndeces = this.useBuffer(2)
        console.log(bufferIndeces)
        let main_program = webglUtils.createProgramFromScripts(gl, [vertex_shader, fragment_shader], ["a_position", "a_color"], bufferIndeces)

        let data =  new_(this.data[index])//.slice(slice_index*slice_length,(slice_index+1)*slice_length)
        if(jump!=1 && !isNaN(Number(jump))){
            for(let row in data){
                data[row]=data[row].filter((_,i)=>{return i%Number(jump)==0})
            }
            data=data.filter((_,i)=>{return i%Number(jump)==0})
        }
        let main_buffers;
        if(graph=="TRIANGLES"){
            main_buffers= get_DEM_position_Buffer_from_Arrays(gl, data, attr)}
        else if (graph=="LINES"){
            main_buffers = get_LINES_DEM_position_Buffer_from_Arrays(gl,data, attr)
        }
        console.log("get array", (Date.now() - time1))

        gl.useProgram(main_program);
        set_Buffers(gl, main_program, bufferIndeces[0], {bufferDataValue:main_buffers.position}, 3, { BufferType: gl.FLOAT })
        set_Buffers(gl, main_program, bufferIndeces[1], {bufferDataValue:main_buffers.texcoord}, 4, { BufferType: gl.UNSIGNED_BYTE, Normalize: true })
        set_Element_Array_Buffers(gl,main_program,main_buffers.indices)

        console.log("set buffer", (Date.now() - time1))
        gl.useProgram(main_program);
        let main_matrixLocation = gl.getUniformLocation(main_program, "u_matrix");


        let export_matrix;
        let shape = [data.length,data[0].length]
        if(this.renderWebGL && Object.hasOwn(this.renderWebGL,"drawScene") && Array.isArray(this.renderWebGL.drawScene)){
            export_matrix = this.renderWebGL.matrix
            this.renderWebGL.drawScene.push(drawScene)
            console.log(this.renderWebGL.drawScene)
        } else {
            this.clearWebGL()
            this.clearBufferIndex()
            export_matrix= this.saved_cam ? new_(this.saved_cam) : new_(this.default_cam)
            this.renderWebGL = { matrix: export_matrix, drawScene: []};//[drawScene]
            this.renderWebGL.drawScene.push(drawScene)
        }
        drawScene();

        function drawScene() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.enable(gl.DEPTH_TEST);
            let mat = get_Matrix(gl, export_matrix, shape)

            gl.useProgram(main_program);
            gl.uniformMatrix4fv(main_matrixLocation, false, mat);
            gl.useProgram(main_program);
            let primitiveType;
            if(graph=="TRIANGLES"){
                primitiveType=gl.TRIANGLES}
            else if (graph=="LINES"){
                primitiveType=gl.LINES
            }
            drawElements(gl,primitiveType,main_buffers.indices.length,gl.UNSIGNED_SHORT,0)
        }}

    render_to_downlaod() {
        let data = __render__(this, false)
        let canvas = createCanvas(Uint8ClampedArray.from(data), this.cols, this.rows)
        downloadImage(canvas)
    }
    createLayerJSON() {
        if (this.shape.length != 3) { return; }
        let layers = []
        let cols = this.shape[2]
        let rows = this.shape[1]
        for (let index = 0; index < this.shape[0]; index++) {
            let data = (this.data[index]).flat()
            let name = this.OptionalAttributes.slice[0]["value"][index]
            let layer = { name, data, cols, rows }
            layers.push(layer)
        }
        return layers
    }
    async json_to_download(filename) {//download this layer only
        if (!filename) {
            filename = "Geovector_" + (Date.now().toString()) + ".JSON"
        }
        if (!filename.endsWith(".JSON")) {
            filename += ".JSON"
        }
        let Imagefile = {
            files: [{
                filename: filename,
                layers:
                    this.createLayerJSON()
                ,
                OptionalAttributes: this.OptionalAttributes

            }]

        }
        let json = JSON.stringify(Imagefile);
        // console.log(json)
        // console.log(JSON.parse(json))
        await downloadJSON(json, filename)
        return filename
    }
}
function __render__(Vector, reflect) {
    let data_reflected
    let data = Vector.memoryArray()
    if (reflect) {
        data_reflected = reflect_to(data, 0.0, 255.0);
    } else {
        data_reflected = data
    }

    let result = []
    for (let i = 0; i < data_reflected.length; i++) {
        result.push(data_reflected[i], data_reflected[i], data_reflected[i], 255)
    }
    return result

}


export function createGeovectorFromJSON(file) {
    let shape = [0, 0, 0];
    let data = []
    let names = []
    for (let index in file["layers"]) {
        console.log(index)
        let layer = file["layers"][index]
        if (index == 0) { shape[1] = layer["rows"]; shape[2] = layer["cols"] };
        if (layer["rows"] == shape[1] && shape[2] == layer["cols"]) {//avoid that the layers have different cols/rows
            shape[0] += 1
            data.push(layer["data"])
            names.push(layer["name"])
        }
    }
    let slice = [{ "value": names }]
    let attr = {}
    attr["filename"] = file["filename"]
    attr["slice"] = slice
    let vector = createVector(data.flat(), shape, attr)
    return vector
}