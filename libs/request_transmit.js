'use strict';

var http = require('http');
var util = require('util');

var server = http.createServer((req, res) => {
    console.log(`enter request : method ${req.method}  url ${req.url} \n
     headers ${JSON.stringify(req.headers)} \n
     ip ${req.connection.remoteAddress || req.socket.remoteAddress}`);

    //if (/\/proxy/.test(req.url)) {
    //    let suburl = req.url.replace(/\/proxy/, '');
    //    console.log('req enter proxy ' + suburl);
    //    req.data = [];
    //    req.on('data', chunk => req.data.push(chunk));
    //    req.on('end', () => {
    //        req.data = req.data.toString();
    //        console.log('incoming data' + req.data);
    //
    //        http.request({
    //            host: '127.0.0.1',
    //            port: 12345,
    //            path: suburl,
    //            method: 'POST',
    //            headers: {
    //                'user-agent': req.headers['user-agent'],
    //                'accept': req.headers['accept'],
    //                'content-type': req.headers['content-type'],
    //                'content-length': req.data.length
    //            }
    //        }, ress => {
    //            ress.on('data', chunk => {
    //                console.log(chunk.toString());
    //                res.write(chunk);
    //            });
    //            ress.on('end', () => res.end());
    //        }).end(req.data);
    //
    //    });
    //
    //}
    //else {
        req.data = [];
        req.on('data', chunk => req.data.push(chunk));
        req.on('end', () => {
            req.data = req.data.toString();
            console.log('return data : ' + req.data);
            res.end(req.data.split('').reverse().join(''));
        });
    //}
}).listen(12345);




var proxy = http.createServer((req, res) => {
    console.log(`proxy request enter : methed ${req.method}  url ${req.url}  \n
    headers ${JSON.stringify(req.headers)} \n
    ip ${req.connection.remoteAddress || req.socket.remoteAddress}`);

    res.writeHead(302, {'Location': 'http://127.0.0.1:12345' + req.url});
    res.end('');

}).on('connect', (req, cltSocket, head) => {
    console.log('proxy connect emit');

}).listen(1337);
