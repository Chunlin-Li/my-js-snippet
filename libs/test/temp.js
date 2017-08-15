'use strict';
// http://10.11.3.45/_adx_health
// http://bid.pro.cn/monitor/master/status

var http = require('http');
var url = require('url');


// var ips = '10.11.3.57 10.11.3.58 10.11.3.59 10.11.3.60 10.11.3.61 10.11.3.62 10.11.3.63 10.11.3.64 10.11.3.65 10.11.3.66 10.11.3.67 10.11.3.68 10.11.3.69 10.11.3.70 10.11.3.71 10.11.3.73 10.11.3.74 10.11.3.75 10.11.3.76 10.11.3.77 10.11.3.78 10.11.3.79 10.11.3.80 10.11.3.81 10.11.3.82 10.11.3.83 10.11.3.87 10.11.3.88 10.11.3.89 10.11.3.90 10.11.3.91 10.11.3.92 10.11.3.93 10.11.3.94 10.11.3.95 10.11.3.96 10.11.3.97 10.11.3.98 10.11.3.99 10.12.1.88 10.12.1.89 10.12.1.134 10.12.1.123 10.12.1.113';
var ips = '10.11.3.60 10.11.3.64 10.11.3.76 10.11.3.88 10.11.3.96';

function send(ip) {
    let time;
    let request = http.request(Object.assign(url.parse('http://bid.pro.cn/monitor/master/status'),
        {method:'POST',agent:false}), resp => {
        time = Date.now() - startTime;
        console.log('###### ', resp.statusCode, '  time : ', time);
        resp.resume();
    });
    request.on('error', err => console.error(err));
    request.end();
    let startTime = Date.now();
}


function run(array, cb) {
    if (array.length < 1)
        return;
    let ip = array.pop();
    console.log('run test :' , ip);
    let id = setInterval(send.bind(null, ip), 100);
    setTimeout(() => {
        clearInterval(id);
        cb(array, run);
    }, 20000);
}

run(ips.split(' '), run);