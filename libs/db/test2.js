'use strict';

var ref;

var obj = {};
var start;
var N = 100000;
var x;
start = process.hrtime();

/*####################################*/
var BigMap = require('../bigHashMap');
var bigMap = new BigMap(24, 8, 10000, {keyType: 'string',valueType: 'number', extFragment: 0});
var objMap = {};

/*####################################*/

for(let i = 0 ; i < N; i++) {
}
start = process.hrtime();
for(let i = 0 ; i < N; i++) {
}
console.log('container cost ' + timeUse(start));
for(let i = 0 ; i < N; i++) {
    obj[i] = 'data' + i;
}



start = process.hrtime();
/***********************************/
for(let i = 0 ; i < N; i++ ) {
    objMap['key' + i] = i;
    x = objMap['key' + i];
}
/***********************************/
console.log('section 1 : ' + timeUse(start));

start = process.hrtime();
for(let i = 0 ; i < N; i++) {
}
console.log('container cost ' + timeUse(start));


start = process.hrtime();
/***********************************/
for(let i = 0 ; i < N; i++) {
    bigMap.set('this\'s long! No.' + i, i);
    x = bigMap.get('this\'s long! No.' + i);
}
/***********************************/
console.log('section 2 : ' + timeUse(start));



function timeUse(start) {
    var t = process.hrtime(start);
    return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';
}