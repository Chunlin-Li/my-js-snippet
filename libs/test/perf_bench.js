'use strict';

var obj = {},start, x, k = 0,
    assert = require('assert'),
    N = 1e6;
start = process.hrtime();

/*####################################*/
let data = JSON.stringify({
    "shards": {
    "2" : [ {
        "state" : "STARTED",
        "primary" : true,
        "node" : "5Oq5UogbRkWmCgRCI22Upw",
        "relocating_node" : null,
        "shard" : 2,
        "index" : "adx-log-2016.10.10",
        "version" : 13,
        "allocation_id" : {
            "id" : "TDgO4VirSp2adaBHCsTkTA"
        }
    }, {
        "state" : "STARTED",
        "primary" : false,
        "node" : "S0CmLO0qREK-VxzFnH1MLg",
        "relocating_node" : null,
        "shard" : 2,
        "index" : "adx-log-2016.10.10",
        "version" : 13,
        "allocation_id" : {
            "id" : "BdDx9Dg9QaW4wRSZby5Cpw"
        }
    } ],
        "1" : [ {
        "state" : "STARTED",
        "primary" : true,
        "node" : "5Oq5UogbRkWmCgRCI22Upw",
        "relocating_node" : null,
        "shard" : 1,
        "index" : "adx-log-2016.10.10",
        "version" : 29,
        "allocation_id" : {
            "id" : "aMhSAr6FScy_vh8cA1-smQ"
        }
    }, {
        "state" : "STARTED",
        "primary" : false,
        "node" : "HT6Za9ESR6iB0dO1PMeOcQ",
        "relocating_node" : null,
        "shard" : 1,
        "index" : "adx-log-2016.10.10",
        "version" : 29,
        "allocation_id" : {
            "id" : "vPrsimPwQiGjMZ_nzhdgfA"
        }
    } ],
        "0" : [ {
        "state" : "STARTED",
        "primary" : true,
        "node" : "S0CmLO0qREK-VxzFnH1MLg",
        "relocating_node" : null,
        "shard" : 0,
        "index" : "adx-log-2016.10.10",
        "version" : 31,
        "allocation_id" : {
            "id" : "XCMh8CnqSPKfCygDxvdysA"
        }
    }, {
        "state" : "STARTED",
        "primary" : false,
        "node" : "HT6Za9ESR6iB0dO1PMeOcQ",
        "relocating_node" : null,
        "shard" : 0,
        "index" : "adx-log-2016.10.10",
        "version" : 31,
        "allocation_id" : {
            "id" : "Phey_-1mReO1cnyuesfRPA"
        }
    } ]
}});


/*####################################*/

for(var i = 0 ; i < N; i++) {}
start = process.hrtime(); for(var i = 0 ; i < N; i++) {}
console.log('container cost ' + timeUse(start));
for(var i = 0 ; i < 100; i++) {obj[i] = 'data' + i;}

start = process.hrtime();
/****   section 1 ******************/
/***********************************/
for(var i = 0 ; i < N; i++ ) {
    let z = JSON.parse(data);
    delete z['shards']['1'][0]['allocation_id']['id'];
}
/***********************************/
console.log('section 1 : ' + timeUse(start));start = process.hrtime();
for(let i = 0 ; i < N; i++) { }
console.log('container cost ' + timeUse(start));

start = process.hrtime();
/****   section 2 ******************/
/***********************************/
for(var i = 0 ; i < N; i++) {
    let z = JSON.parse(data);
    z['shards']['1'][0]['allocation_id']['id'] = undefined;
}
/***********************************/
console.log('section 2 : ' + timeUse(start));


function timeUse(start) {var t = process.hrtime(start);return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';}









