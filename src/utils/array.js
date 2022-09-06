export function reshape(tensor, shape) {
    function _reshape(tensor, shapeValue) {
        let result = []
        const piecesNum = shapeValue
        let pieces = tensor.length / piecesNum
        for (let i = 0; i < pieces; i++) {
            result.push(tensor.slice(i * piecesNum, i * piecesNum + piecesNum))
        }
        return result
    }
    if (shape.filter((s) => { return s === -1 }).length > 1) { throw (`There are too many default value (-1) in shape.`); return; }
    if (shape.indexOf(-1) != -1) {
        let index = shape.indexOf(-1)
        let otherNumMulti = shape.filter((s) => { return s !== -1 }).reduce((s1, s2) => { return s1 * s2 })
        if (tensor.length % otherNumMulti === 0) {
            shape[index] = tensor.length / otherNumMulti
        } else { throw (`Default value (-1) of ${index} in the shape is autofilled by ${tensor.length / otherNumMulti}, it should be an integer.`) }
    }
    if (tensor.length === shape.reduce((s1, s2) => { return s1 * s2 })) {
        for (let i = shape.length - 1; i >= 0; i--) {
            let arrayValue = shape[i]
            tensor = _reshape(tensor, arrayValue)

        }
    } else { throw (`${tensor.length} can not be divided by ${shape.join(" * ")}.`) }
    return (tensor[0])
}

export function reflect_to(data, min_reflect, max_reflect) {
    const max = data.reduce((a, b) => Math.max(a, b), -Infinity)
    const min = data.reduce((a, b) => Math.min(a, b), Infinity)

    let result = data.map(x => ((x - min) / (max - min))).map(x => { return (x * (max_reflect + min_reflect) - min_reflect) })
    return result;
}

export function max_f64(data){
    return data.reduce((a, b) => Math.max(a, b), -Infinity)
}

export function min_f64(data){
    return data.reduce((a, b) => Math.min(a, b), Infinity)

}