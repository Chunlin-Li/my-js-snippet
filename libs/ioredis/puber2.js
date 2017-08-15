"use strict";

let Redis = require('ioredis');
let hiredis = require('hiredis');
let redis = new Redis({dropBufferSupport: true});

// redis.set('test', 'Hello');
let start = process.hrtime();
redis.get('test', function(err, val) {
    let end = process.hrtime(start);
    console.log(err, val, end);
    // process.exit(3);
});

function listenEvent(name) {
    redis.on(name, function () {
        // console.log(`redis event [${name}]:`, arguments);
        // process.exit(2);
        setTimeout(function() {
            let start = process.hrtime();
            redis.get('test', function(err, val) {
                let end = process.hrtime(start);
                console.log(err, val, end);
                process.exit(3);
            });
        }, 200);
    })
}
// listenEvent('ready');
listenEvent('connect');
// listenEvent('select');


// setTimeout(function() {
//     (async function () {
//         console.log(await redis.lpop('test'));
//         console.log(await redis.lpop('test'));
//         console.log(await redis.lpop('test'));
//         console.log(await redis.rpush('test', 'Hello'));
//     })().catch(err => console.error(err));
// }, 1000);
