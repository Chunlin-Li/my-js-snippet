'use strict';


console.log(JSON.stringify(process.memoryUsage()));
const ip = require('ipip')('/home/chunlin/Downloads/17monip/17monipdb/17monipdb.dat');

let x;
let start = process.hrtime();
for (var i = 0; i < 100000; i ++) {
    x = ip('122.224.244.26', 'array');
}
console.log(JSON.stringify(process.memoryUsage()));
console.log('time :', process.hrtime(start)[1]/1e6);
