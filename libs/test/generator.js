'use strict';

var fs = require('fs');
var suspend = require('suspend');
//var mod1 = require('mod1');



suspend(function*() {
    console.log('start');
    var buf = yield fs.readFile('./limiter.js', {}, suspend.resume());
    console.log(buf.toString());
    console.log('end');
})();

