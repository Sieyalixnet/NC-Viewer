import { reshape } from "../utils/array";
import { downloadJSON } from "../utils/text";
import { createCanvas } from "../utils/canvas";

export function createVector(data,shape,attr) {//rows->height, cols->width
    const vector = new Geovector(data,shape,attr);
    return new Proxy(vector, VectorHandler(vector));
}

function VectorHandler(target) {
    return {
        get(target, key) {
            let res = Reflect.get(target, key);
            return res
        },
        set(target, key, value) {
            let res = Reflect.set(target, key, value);
            return res
        }
    }
}

export class Geovector {
    constructor(data, shape,attr=null) {
        this.data = data
        this.shape = shape
        this.OptionalAttributes = {}
        this.reshape()
    }
    reshape(shape=this.shape){
        this.data=reshape(this.data,shape)
    }
    //in this part, functions mostly get/set things from WASM
    render2D(canvasID, reflect = true) {
        let canvas = document.getElementById(canvasID)
        if (!canvas) { return; }
        let ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = this.cols
        canvas.height = this.rows

        let date = Date.now()
        let data = __render__(this, reflect)

        let imageData = new ImageData(Uint8ClampedArray.from(data), this.cols, this.rows, { colorSpace: "srgb" })
        // let imageData = new ImageData(Uint8ClampedArray.from(this.Data.render(reflect)), this.cols, this.rows, { colorSpace: "srgb" })
        console.log(`Render to Main: ${Date.now() - date}ms`);
        ctx.putImageData(imageData, 0, 0)
    }

    render_to_downlaod() {
        let data = __render__(this, false)
        let canvas = createCanvas(Uint8ClampedArray.from(data), this.cols, this.rows)
        downloadImage(canvas)
    }
    json_to_download(filename) {//download this layer only
        let Imagefile = {
            files: [{
                filename: filename,
                layers: [
                    this.createLayerJSON()
                ]
            }]

        }
        let json = JSON.stringify(Imagefile);
        // console.log(json)
        // console.log(JSON.parse(json))
        downloadJSON(json)
    }

    createLayerJSON() { //create an object that can be used to download
        this.update()
        return {
            "name": this.OptionalAttributes.name,
            "cols": this.cols,
            "rows": this.rows,
            "data": this.array()
        }
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

function __render_thumbnails__(Vector, ratio, reflect) {
    let temp = reshape(Vector.memoryArray(), [Vector.get_rows(), -1]);
    let temp_rows = [];
    for (let i = 0; i < temp.length; i++) {
        if (i % ratio == 0) {
            let new_row = [];
            for (let j = 0; j < temp[i].length; j++) {
                if (j % ratio == 0) {
                    new_row.push(temp[i][j]);
                }
            }
            temp_rows.push(new_row);
        }
    }
    temp_rows = temp_rows.flat();
    if (reflect) {
        temp_rows = reflect_to(temp_rows, 0.0, 255.0);
    }
    let result = (temp_rows.map((value) => { return [value, value, value, 255] })).flat()
    return result
}