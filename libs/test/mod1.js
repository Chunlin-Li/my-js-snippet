'use strict';

var http = require('http');
var url = require('url');
var keepAliveAgent = new http.Agent({keepAlive:true});

var request = http.get(
    Object.assign(url.parse('http://localhost:5151/get/1'), {agent:false}),
    resp => {
        resp.resume();
    }
);
//
// setTimeout(() => {
//     request.abort();
// }, 500);

setInterval(()=> {}, 1000);