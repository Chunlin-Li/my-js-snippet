"use strict";

let Redis = require('ioredis');
let hiredis = require('hiredis');
let redis = new Redis({dropBufferSupport: true});


(function fn() {
    let x = parseInt(Math.random() * 1000);
    redis.rpush('music', 'Hello again!#' + x + '#' + Date.now());
    setTimeout(fn, 10000 + Math.random() * 1000)
})();
