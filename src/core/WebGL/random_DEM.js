import {isNumber} from "../../utils/utils.js"

let matrix = [[2,4],[1,9]]

export function random_DEM(size,random_range,base=10){
    let rd= Math.random
    let matrix = [[rd()*base,rd()*base],[rd()*base,rd()*base]]
    for(let i = 0; i<size-2;i++){
        random_expansion(matrix,random_range,base)
    }
    return matrix
}


// console.log(random_DEM(20,[-10,30],20))

function random_expansion(matrix,random_range,base){
  let rows = matrix.length
  let cols = matrix[0].length
  let half_rows= Math.floor(rows/2)
  let half_cols = Math.floor(cols/2)
  for(let r=0;r<rows;r++){
    matrix[r].splice(half_cols,0,NaN)
  }
  matrix.splice(half_rows,0,new Array(cols).fill(NaN))

  rows = matrix.length
  cols = matrix[0].length
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
        if(isNaN(matrix[r][c])){
            matrix[r][c]=((Math.round((getValidValue(c,r,matrix))*100)/100)*17+(Math.round((Math.random()*(random_range[1]-random_range[0])+random_range[0])*100)/100)*3)/20
        }
    }
  }
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
        if(r==c ){
            matrix[r][c]=((Math.round((getValidValue(c,r,matrix))*100)/100)*17+(Math.round((Math.random()*(random_range[1]-random_range[0])+random_range[0])*100)/100)*3)/20
        }
    }
  }
  return matrix
}

function getValidValue(col,row,matrix){
    let rows = matrix.length
    let cols = matrix[0].length
    let sum = 0;
    let div = 9;
    let col_range=[col-1,col-0,col+1];
    let row_range=[row-1,row-0,row+1];
    for(let c of col_range){
        for(let r of row_range){
            if(r>=0 && r<rows && c>=0 && c<cols){
                let temp = validOr(matrix[r][c])
                sum+=temp;
            if(temp==0){div-=1}}else{div-=1}}
    }
        return sum/div
}
function validOr(value){
    if(isNumber(value) && !isNaN(value)){
        return value
    } else{
        return 0
    }
}


