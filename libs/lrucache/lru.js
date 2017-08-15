"use strict";

const LRU = require("lru-cache");
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const cache = LRU({
    "max": 5000,
    "maxAge": 500
});


function run() {
    console.log("set : ", cache.set("597c328b91be711ca8dca93a", ["val", 1]));
    cache.set("597c328b91be711ca8dca93a", ["val", 2]);
    setTimeout(function() {
        console.log(cache.get("597c328b91be711ca8dca93a"));
        console.log(typeof cache.get("597c328b91be711ca8dca93a"));
    }, 100);
}

run();
setInterval(run, 3000);



// cache.set("key", "value")
// cache.get("key") // "value"
//
// // non-string keys ARE fully supported
// var someObject = {}
// cache.set(someObject, 'a value')
// cache.set('[object Object]', 'a different value')
// assert.equal(cache.get(someObject), 'a value')
//
// cache.reset()    // empty the cache
