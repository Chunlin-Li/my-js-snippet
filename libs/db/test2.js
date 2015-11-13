'use strict';

var ref;

var map = new Map();
var obj = {};
var N = 1000000;

var code = 'var x = 32 * 32';

console.log('start');

console.time('container cost');
for(let i = 0 ; i < N; i++) {
}
console.timeEnd('container cost');


for(let i = 0 ; i < N; i++) {
    obj[i] = 'data' + i;
}


console.time('section 1');
for(let i = 0 ; i < N; i++) {
    eval(code);
}
console.timeEnd('section 1');


console.time('section 2');
for(let i = 0 ; i < N; i++) {
    new Function()
}
console.timeEnd('section 2');



//console.time('section 3');
//for(let i = 0 ; i < 1000; i++) {
//    for(let j = 0; j < 1000; j ++) {
//        obj[j] = i;
//        let x = obj[(j-1)%1000];
//    }
//}
//console.timeEnd('section 3');