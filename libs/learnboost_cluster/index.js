// 'use strict';
//
// const cluster = require('../../node_modules/cluster');
// const http = require('http');
//
//
//
// let server = http.createServer(function (req, res) {
//     res.end('' + process.pid);
// });
// // console.log(cluster);
// cluster(server).listen(4433);

var cluster = require('../../node_modules/cluster')
    , http = require('http');

var body = 'Hello World'
    , len = body.length;
var server = http.createServer(function(req, res){
    res.writeHead(200, { 'Content-Length': len });
    res.end(body);
});

cluster(server)
    .set('workers', 4)
    .set('working directory', '/')
    .listen(3000);
