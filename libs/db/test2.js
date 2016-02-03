'use strict';

var ref;

var obj = {};
var start;
var N = 10000000;
start = process.hrtime();


for(let i = 0 ; i < N; i++) {
}

start = process.hrtime();
for(let i = 0 ; i < N; i++) {
}
console.log('container cost ' + timeUse(start));

for(let i = 0 ; i < N; i++) {
    obj[i] = 'data' + i;
}

let x;


start = process.hrtime();
/***********************************/
for(let i = 0 ; i < N; i++ ) {
    x = i % 137;
}
/***********************************/
console.log('section 1 : ' + timeUse(start));

start = process.hrtime();
for(let i = 0 ; i < N; i++) {
}
console.log('container cost ' + timeUse(start));


start = process.hrtime();
/***********************************/
for(let j = 0 ; j < N; j++) {
    x = j % 128
}
/***********************************/
console.log('section 2 : ' + timeUse(start));



function timeUse(start) {
    var t = process.hrtime(start);
    return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';
}