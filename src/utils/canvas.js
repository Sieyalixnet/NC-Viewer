export function downloadImage(canvas, remove = true) {
    let dataURL = canvas.toDataURL("image/PNG", 1.0);
    let a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute(
        "download",
        "GeoVectorImage_" + String(Date.now())
    );
    a.click();
    if (remove) {
        if (canvas) {
            // console.log("download canvas removed")
            canvas.remove();
        }
        if (a) {
            // console.log("a removed")
            canvas.remove();

        }
    }

}

export function createCanvas(Array, width, height) {//Uint8ClampedArray, cols, rows
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    let imageData = new ImageData(Array, width, height, { colorSpace: "srgb" })
    ctx.putImageData(imageData, 0, 0)
    return canvas
}