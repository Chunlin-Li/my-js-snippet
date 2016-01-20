'use strict';
var net = require('net');

var all = {};

for (let i = 0; i < 10; i++) {
    let v = i + 1000;
    all['key_' + i] = [i];
    all['key_' + i].timeout = setTimeout(() => {
        console.log('' +  i + '  - ' + all['key_'+i]);
    }, 1000);
}

