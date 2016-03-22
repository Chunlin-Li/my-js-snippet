'use strict';

var prevSecond = Date.now()/10000 >> 0; // 10s average qps
var bucket = {};
var qps = {};

function setQps(type) {
    bucket[type] = bucket[type] + 1 || 1;
    if (Date.now()/10000 >> 0 !== prevSecond) {
        prevSecond = Date.now()/10000 >> 0;
        qps[type] = bucket[type]/10;
        bucket[type] = 0;
    }
}

function getQps(type) {
    return qps[type];
}

//module.exports = foo;


setInterval(()=>{
    setQps('req');
}, Math.random() * 30);

setInterval(() => {
    console.log(getQps('req'));
}, 10000);