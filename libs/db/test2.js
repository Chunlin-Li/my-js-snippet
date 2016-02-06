'use strict';

var ref;

var obj = {};
var start;
var N = 8 * 1024 * 1024 -1;
var x;
start = process.hrtime();

/*####################################*/
var buf1 = new Buffer(64 * 1024 * 1024);
var buf2 = new Buffer(64 * 1024 * 1024);

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
    buf2.writeDoubleBE(NaN, i);
    buf2.readDoubleBE(i);
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
    buf1.writeDoubleBE(NaN, 1 + i);
    buf1.readDoubleBE(1+i);
}
/***********************************/
console.log('section 2 : ' + timeUse(start));



function timeUse(start) {
    var t = process.hrtime(start);
    return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';
}