import { max_f64, min_f64, reflect_to } from "../../utils/array";
import { m4 } from "../../WebGLFundamentals/m4";
import * as d3 from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import { remove_default_value } from "./plugins";
import { new_ } from "../../utils/utils";
export function radToDeg(r) {
    return r * 180 / Math.PI;
}

export function degToRad(d) {
    return d * Math.PI / 180;
}
export function set_Matrix2(perspective, translation, rotation, scale) {//Deprecated
    const { fieldOfViewRadians, aspect, zNear, zFar } = perspective;
    let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
    return matrix
}

export function get_Matrix(gl, export_matrix, shape) {//return a matrix of matrices calculation.
    let { translation, rotation, scale, camPos, Ortho_Radians,ortho} = export_matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const near = 1;
    const far = 2000;

    const perspectiveProjectionMatrix = ortho ?//if the orthoUnit is zero, it will will use 3D perspective projection, or it will use 3D orthographic projection.
        m4.orthographic(
            -Ortho_Radians * aspect,  // left
            Ortho_Radians * aspect,  // right
            -Ortho_Radians,           // bottom
            Ortho_Radians,           // top
            near,
            far) :
        m4.perspective(degToRad(Ortho_Radians), aspect, near, far);

    const cameraPosition = [
        camPos[0],
        camPos[1],
        camPos[2],
    ];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    let worldMatrix = m4.yRotation(degToRad(rotation[1]));

    worldMatrix = m4.xRotate(worldMatrix, degToRad(rotation[0]));
    worldMatrix = m4.zRotate(worldMatrix, degToRad(rotation[2]));
    worldMatrix = m4.scale(worldMatrix, scale[0], scale[1], scale[2]);
    worldMatrix = m4.translate(worldMatrix, -shape[2] / 2, -shape[1] / 2, 0);
    worldMatrix = m4.translate(worldMatrix, translation[0], translation[1], translation[2]);

    const viewMatrix = m4.inverse(cameraMatrix);
    let mat = m4.multiply(perspectiveProjectionMatrix, viewMatrix);
    mat = m4.multiply(mat, worldMatrix);
    return mat

}

export function drawArr(gl, primitiveType = gl.TRIANGLES, offset = 0, count) {
    gl.drawArrays(primitiveType, offset, count);
}


export function set_Buffers(gl, program, locationIndex, bufferData, numComponents, attr) {
    //set the Buffers according to the webgl location.
    gl.useProgram(program);
    let Location = locationIndex
    let Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        bufferData,
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(Location);
    const { BufferType, Normalize, Stride, Offset } = attr
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer);
    var size = numComponents;
    var type = BufferType ? BufferType : gl.FLOAT;
    var normalize = Normalize ? Normalize : false;
    var stride = Stride ? Stride : 0;
    var offset = Offset ? Offset : 0;
    gl.vertexAttribPointer(
        Location, size, type, normalize, stride, offset);
}

export function return_vec() {//Return a new empty array, which is for test.
    let random_h = Array(360 * 180).fill([])
    return random_h
}

export function mod_value(vec_reshaped, pre_cast) {
    //value -> x, y, z. 
    //The value of z will be modified by the pre_cast. pre_cast is an array of functions(plugins) in order to modify the value of Z. (For example, it can be used to convert the missing/default value to another value.)
    let result = JSON.parse(JSON.stringify(vec_reshaped))
    for (let row in vec_reshaped) {
        for (let col in vec_reshaped[row]) {
            let temp = result[row][col]
            if (pre_cast) {
                for (let cast of pre_cast) {
                    temp = cast(temp)
                }
            }
            result[row][col] = [Number(col), Number(row), temp]

        }
    }
    return result
}



export function return_tri(vec) {// x, y, z -> two triangle to render in webgl.
    let result = []
    for (let row in vec) {
        if (vec[Number(row) + 1]) {
            for (let i = 0; i < vec[Number(row)].length; i++) {
                if (vec[Number(row) + 1][i + 1]) {
                    let upper_tri = [...vec[Number(row)][i], ...vec[Number(row)][i + 1], ...vec[Number(row) + 1][i + 1]]
                    let bottom_tri = [...vec[Number(row)][i], ...vec[Number(row) + 1][i], ...vec[Number(row) + 1][i + 1]]
                    result.push(...upper_tri)
                    result.push(...bottom_tri)
                }
            }


        }

    }
    return result
}

function color_interpolate(color_array, value_array) {
    //use d3 to interpret the color: [], [] -> (func(value)->colorString)
    return (scaleLinear()
        .domain(value_array)
        .range(color_array)
        .interpolate(d3.interpolateRgb.gamma(2.2)))
}

function convert_colorString_to_obj(color) {
    let reg = /rgb\((.*), (.*),(.*)\)/g
    let color_result = reg.exec(color)
    return { r: Number(color_result[1].trim()), g: Number(color_result[2].trim()), b: Number(color_result[3].trim()) }

}



export function get_DEM_Buffer_from_Arrays(gl, Data, attr) {
    //a 2-dimensions array -> position and color Buffer
    let { color_array, value_array, default_value_to_value, color_value_percent } = attr

    //add and apply plugins
    let time1=Date.now()
    let pre_casts = []
    if (typeof (default_value_to_value) == "number") {
        let max_Data = max_f64(Data.flat())
        let min_Data = min_f64(Data.flat())
        pre_casts.push(remove_default_value(max_Data, min_Data, default_value_to_value))
    }
    let result = return_tri(mod_value(Data, pre_casts))
    console.log("get pos, start flat",(Date.now()-time1))

    
    // let _renderData_ = result.flat()
    console.log("end flat",(Date.now()-time1))
    let position = new Float32Array(result);
    console.log("get pos typearry",(Date.now()-time1))
    let _texcoord_ = [];
    console.log(result.length)
    let Z = result.filter((x,i) => {return (i+1)%3==0})//we only need its Z value.
    // let Z = result//second way to interpret the color
    console.log(Z.length)
    if (color_value_percent) {
        let max_Z = max_f64(Z)
        let min_Z = min_f64(Z)
        let color = color_interpolate(color_array, value_array)
        console.log("start color interpret",(Date.now()-time1))
        // for (let i in Z) {//second way to interpret the color ,may be faster in WASM?
        //     if((i+1)%3==0){
        //     let    x=Z[i]
        //     let v = ((x - min_Z) / (max_Z - min_Z))
        //     let c = convert_colorString_to_obj(color(v))
        //     Z[i-2]=c["r"]
        //     Z[i-1]=c["g"]
        //     Z[i]=c["b"]
        // }
        // }
        for (let i of Z) {
            let v = ((i - min_Z) / (max_Z - min_Z))
            let c = convert_colorString_to_obj(color(v))
            _texcoord_.push(...[c["r"], c["g"], c["b"],255])
        }
        console.log("end color interpret",(Date.now()-time1))
    } else {
        let min = Math.min(...value_array)
        let max = Math.max(...value_array)
        let temp_value_array = reflect_to(new_(value_array), 0, 1);
        let color = color_interpolate(color_array, temp_value_array)
        for (let i of Z) {
            if (i >= min && i <= max) {
                let v = ((i - min) / (max - min))
                let c = convert_colorString_to_obj(color(v))
                _texcoord_.push(...[c["r"], c["g"], c["b"],255])
            }
            else {
                _texcoord_.push(...[0, 0, 0,0])
            }
        }


    }
    console.log("get color",(Date.now()-time1))
    let texcoord = new Uint8Array(_texcoord_)
    return { position, texcoord }
}

export function get_grid_Buffer_from_Array_Object(gl, grid, color = [0, 0, 0, 176]) {
    //an object {x,y,z} -> position and color Buffer.
    let position_result = [];
    const { x, y, z } = grid
    let x_N = x.length - 1;
    let y_N = y.length - 1;
    for (let _Z of z) {
        for (let _X of x) {
            position_result.push([_X, y[0], _Z])
            position_result.push([_X, y[y_N], _Z])
        }
        for (let _Y of y) {
            position_result.push([x[0], _Y, _Z])
            position_result.push([x[x_N], _Y, _Z])
        }
    }
    let color_result = new Array(position_result.length).fill(color)
    let position = new Float32Array(position_result.flat());
    let texcoord = new Uint8Array(color_result.flat())
    return { position, texcoord }
}

export function get_surface_Buffer_from_Array_Object(gl, shape,surface, color = [0, 0, 0, 176]) {
    //an object {x,y,z} -> position and color Buffer.
    let position_result = [];
    const {z,color_final} = surface
    if(color_final){color=color_final}
    let x_N = shape[shape.length-1]
    let y_N = shape[shape.length-2]
    for (let _Z of z) {
        position_result.push([0,0,_Z],[0,y_N,_Z],[x_N,y_N,_Z],[0,0,_Z],[x_N,0,_Z],[x_N,y_N,_Z])
    }
    let color_result = new Array(position_result.length).fill(color)
    let position = new Float32Array(position_result.flat());
    let texcoord = new Uint8Array(color_result.flat())
    console.log(texcoord)
    return { position, texcoord }
}