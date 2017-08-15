"use strict";

let Redis = require('ioredis');
let hiredis = require('hiredis');
let redis = new Redis();

(function foo(){
    redis.blpop('music', 5, function(err, data){
        console.log(err, data);
        // if (data) {
        //     let diff = Date.now() - parseInt(data[1].split('#')[2]);
        //     console.log(`msg: ${data[1]}, time: ${diff}ms`);
        // }
        foo();
    });
})();

setTimeout(function() {
    redis.rpush('music', 'Hello again!#' + Date.now(), function() {
        console.log('mesasge pushed');
    });
}, 1000);
