"use strict";

let Redis = require('ioredis');
let hiredis = require('hiredis');
let redis = new Redis();
let pub = new Redis();

redis.subscribe('music', function (err, count) {});

redis.on('message', function (channel, message) {
    let diff = Date.now() - parseInt(message.split('#')[2]);
    console.log(`frome ${channel}, msg: ${message}, time: ${diff}ms`);
});
