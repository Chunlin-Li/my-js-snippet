'use strict';

var _ = require('lodash');

var array = [
        [0, 4, 0,       9, 0, 0,        0, 1, 0],
        [2, 0, 0,       0, 0, 0,        4, 0, 9],
        [0, 7, 1,       0, 4, 0,        0, 6, 8],

        [8, 0, 0,       0, 0, 9,        1, 3, 0],
        [0, 0, 0,       0, 2, 0,        0, 0, 0],
        [0, 5, 0,       0, 0, 6,        0, 0, 0],

        [3, 0, 0,       0, 0, 0,        0, 0, 4],
        [5, 0, 0,       4, 0, 0,        0, 0, 0],
        [0, 6, 8,       3, 7, 1,        0, 0, 0],
];

var ele = [1,2,3,4,5,6,7,8,9];
var blank = 0;

for (var x = 0; x < 9; x ++) {
    for (var y = 0; y < 9; y ++) {
        if (array[x][y] === 0) blank ++;
    }
}

function checkRow(i){
    return array[i].filter(t => t);
}

function checkCol(j){
    let C2R = [];
    array.forEach(t => C2R.push(t[j]));
    return C2R.filter(t => t);
}

function checkRec(i, j){
    if (checkRec.buffer && checkRec.buffer[''+i+','+j]) {
        return checkRec.buffer[''+i+','+j];
    }
    let rec = [];
    let ri = Math.floor(i / 3);
    let rc = Math.floor(j / 3);
    for (var x = ri * 3; x < ri * 3 + 3; x ++) {
        for (var y = rc * 3; y < rc * 3 + 3; y ++) {
            try{
                rec.push(array[x][y]);
            } catch (e) {
                console.log('zzz', x, y)
                throw e
            }
        }
    }
    rec = _.uniq(rec.filter(t => t));
    checkRec.buffer[''+i+','+j] = rec;
    return rec;
}
checkRec.buffer = {};

function check(i, j){
    let total = checkRow(i).concat(checkCol(j), checkRec(i, j));
    total = _.uniq(total);
    // console.log('!!!!!!', JSON.stringify(total))
    return _.difference(ele,total);
}


function run () {
    while (blank > 0) {
        let px, py;
        for (var i = 0; i < 9; i ++){
            py = array[i].indexOf(0);
            if(py !== -1) {
                px = i;
                let res = check(px, py);
                console.log('=========', JSON.stringify(res));
                if (res.length === 1) {
                    console.log('aaaaaaa',px,py,res[0])
                    array[px][py] = res[0];
                    checkRec.buffer = {};
                    blank --;
                    for (var z = 0; z < 9; z ++) {
                        console.log(`${JSON.stringify(array[z])}`);
                    }

                }
            }
        }
    }
}

run();