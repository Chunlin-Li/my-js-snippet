'use strict';
var util = require('util');


setInterval(() => {
    console.log('count :', require('./mod1.js').val());
}, 1000);

