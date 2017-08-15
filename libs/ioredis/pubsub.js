"use strict";

let Redis = require('ioredis');
let hiredis = require('hiredis');
let redis = new Redis();
let pub = new Redis();
let start;

redis.subscribe('news', 'music', function (err, count) {
    // Now we are subscribed to both the 'news' and 'music' channels.
    // `count` represents the number of channels we are currently subscribed to.
    console.log('=-===', count);
    start = process.hrtime();
    pub.publish('news', {msg: "hello world"});
    pub.publish('music', {msg: 'Hello again!'});
});

redis.on('message', function (channel, message) {
    console.log("time use", process.hrtime(start));
    // Receive message Hello world! from channel news
    // Receive message Hello again! from channel music
    console.log('Receive message %s from channel %s', message, channel);
});

// There's also an event called 'messageBuffer', which is the same as 'message' except
// it returns buffers instead of strings.
redis.on('messageBuffer', function (channel, message) {
    // Both `channel` and `message` are buffers.
    console.log('messageBuffer' + channel + message);
});
