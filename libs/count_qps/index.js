'use strict';


var qps = (function() {
    var timeInterval = 5000; // 5s average qps
    var bucket = {}, qps = {};
    var prevSecond = Date.now()/timeInterval >> 0;
    return {
        setQps: function(type) {
            bucket[type] = bucket[type] + 1 || 1;
            if (Date.now()/timeInterval >> 0 !== prevSecond) {
                prevSecond = Date.now()/timeInterval >> 0;
                qps[type] = bucket[type]/10;
                bucket[type] = 0;
            }
        },
        getQps: function(type) {
            return qps[type];
        }
    }
})();

// var qps=(function(){var timeInterval=5000;var bucket={},qps={};var prevSecond=Date.now()/timeInterval>>0;return{setQps:function(type){bucket[type]=bucket[type]+1||1;if(Date.now()/timeInterval>>0!==prevSecond){prevSecond=Date.now()/timeInterval>>0;qps[type]=bucket[type]/10;bucket[type]=0}},getQps:function(type){return qps[type]}}})();

//setInterval(()=>{
//    qps.setQps('req');
//}, Math.random() * 30);
//
//setInterval(() => {
//    console.log(qps.getQps('req'));
//}, 1000);