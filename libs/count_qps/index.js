'use strict';


var qps = (function() {
    var timeInterval = 2000; // 5s average qps
    var bucket = {}, qps = {}, tmp;
    var prevTime = Date.now();
    return {
        setQps: function(type) {
            bucket[type] = bucket[type] + 1 || 1;
            if ((tmp = Date.now()) > prevTime + timeInterval) {
                qps = {};
                for (var type in bucket) {
                    qps[type] = (bucket[type] / (tmp - prevTime) * 1000).toFixed(2);
                    bucket[type] = 0;
                }
                prevTime = tmp;
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
//},  700);
//
//setInterval(() => {
//    console.log(qps.getQps('req'));
//}, 1000);