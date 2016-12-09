'use strict';

const http = require('http');
const fs = require('fs');
const suspend = require('suspend');


http.createServer(onRequest).listen(3939);

function* handle (req, res) {
    return fun1(res);
}

function fun1 (res) {
    res.end('KLJLJLKJKLJKLJKL');
}


function onRequest(req, res) {
    console.log('req header: ', req.rawHeaders);
    req.body = [];
    req.on('data', chunk => {
        req.body.push(chunk);
    });
    req.on('end', () => {
        req.body = Buffer.concat(req.body);
        suspend(handle)(req, res)
    })
}

