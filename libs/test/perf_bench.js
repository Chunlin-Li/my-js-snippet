'use strict';

var obj = {},start, x,
    assert = require('assert'),
    N = 100 * 1;
start = process.hrtime();

/*####################################*/
/*####################################*/

for(let i = 0 ; i < N; i++) {  }
start = process.hrtime(); for(let i = 0 ; i < N; i++) {}
console.log('container cost ' + timeUse(start)); for(let i = 0 ; i < N; i++) {obj[i] = 'data' + i;}



start = process.hrtime();
/****   section 1 ******************/
/***********************************/
for(let i = 0 ; i < N; i++ ) {
}
/***********************************/
console.log('section 1 : ' + timeUse(start));start = process.hrtime();for(let i = 0 ; i < N; i++) {} console.log('container cost ' + timeUse(start));



start = process.hrtime();
/****   section 2 ******************/
/***********************************/
for(let i = 0 ; i < N; i++) {
}
/***********************************/
console.log('section 2 : ' + timeUse(start));


function timeUse(start) {var t = process.hrtime(start);return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';}









