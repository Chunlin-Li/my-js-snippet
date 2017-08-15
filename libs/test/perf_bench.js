'use strict';

let obj = {},start, x, k = 0,
    assert = require('assert'),
    N = 1e8;
start = process.hrtime();

/*####################################*/
function getOne() {
    return parseInt(Math.random() * 5);
}

/*####################################*/

for(var i = 0 ; i < N; i++) {}
start = process.hrtime(); for(var i = 0 ; i < N; i++) {}
console.log('container cost ' + timeUse(start));
for(var i = 0 ; i < 100; i++) {obj[i] = 'data' + i;}

start = process.hrtime();
/****   section 1 ******************/
/***********************************/
for(var i = 0 ; i < N; i++ ) {
    x = "val" + parseInt(Math.random() * 5);
    if (x === "val0") {
        x = x + "0"
    } else if (x === "val1") {
        x = x + "1"
    } else if (x === "val2") {
        x = x + "2"
    } else if (x === "val3") {
        x = x + "3"
    } else if (x === "val4") {
        x = x + "4"
    } else if (x === "val5") {
        x = x + "5"
    }
}
/***********************************/
console.log('section 1 : ' + timeUse(start));start = process.hrtime();
for(let i = 0 ; i < N; i++) { }
console.log('container cost ' + timeUse(start));

start = process.hrtime();
/****   section 2 ******************/
/***********************************/
for(var i = 0 ; i < N; i++) {
    x = "val" + parseInt(Math.random() * 5);
    switch (x) {
        case "val0": x = x + "0"; break;
        case "val1": x = x + "1"; break;
        case "val2": x = x + "2"; break;
        case "val3": x = x + "3"; break;
        case "val4": x = x + "4"; break;
        case "val5": x = x + "5"; break;
    }
}
/***********************************/
console.log('section 2 : ' + timeUse(start));


function timeUse(start) {var t = process.hrtime(start);return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';}









