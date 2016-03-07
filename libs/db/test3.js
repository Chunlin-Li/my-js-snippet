'use strict';

var os = require('os');
var v8 = require('v8');
var fs = require('fs');
var util = require('util');

var ws = fs.createWriteStream('./output.log');

var opt = {showHidden: true, depth: 8 };

function foo(){
    var myobj = {
        prop1: util.inspect(os.cpus(), opt),
        prop2: util.inspect(Object.assign({}, process), opt),
        prop3: new Date(),
        prop4: v8.getHeapStatistics(),
        prop5: os.networkInterfaces()
    };
    var str = JSON.stringify(myobj);
    var buf = new Buffer(str);
    var rand = (Math.random() * 5000) >> 0;
    setTimeout(function() {
        ws.write(buf);
    }, rand);
}


setInterval(()=>{
    console.log('######### MEMORY ', process.memoryUsage());
}, 1000);

setInterval(foo, 10);