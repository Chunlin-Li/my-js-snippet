'use strict';
var util = require('util');

var obj = {};

Object.defineProperty(obj, 'id', {
   set(val) {
       console.log(util.inspect(this));
   },
   get() {
       console.log(util.inspect(this));
       return null;
   }
});

if (!obj.id){
    obj.id = 4;
}