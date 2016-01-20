'use strict';

var ref;

var obj = {};
var start;
var N = 100;
start = process.hrtime();



start = process.hrtime();
for(let i = 0 ; i < N; i++) {
}
console.log('container cost ' + timeUse(start));


for(let i = 0 ; i < N; i++) {
    obj[i] = 'data' + i;
}

var fs = require('fs');
var ws = fs.createWriteStream('./log.log', {flags: 'a+'});
var user = {};

start = process.hrtime();
/***********************************/
for(let i = 0 ; i < N; i++ ) {
    user.id = i;
    foo(user);
}
function foo (value) {
    setTimeout(() => {
        ws.write('' + value.id);
    }, 500)
}
/***********************************/
console.log('section 1 : ' + timeUse(start));

for(let i = 0 ; i < N; i++) {
    obj[i] = 'data' + i;
}

start = process.hrtime();
/***********************************/
for(let j = 0 ; j < N; j++) {

}
/***********************************/
console.log('section 2 : ' + timeUse(start));



function timeUse(start) {
    var t = process.hrtime(start);
    return '' + (t[0] * 1000000000 + t[1]) + 'ns';
}