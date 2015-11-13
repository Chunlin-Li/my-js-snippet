'use strict';

var timeout = 250;
var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
    'msg' : 'Hello World!'
});

var options = {
    hostname: '127.0.0.1',
    port: 1337,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
        console.log('No more data in response.')
    })
});

req.on('error', function(e) {
    console.log('problem with request: ' + e);
});

// write data to request body
req.write(postData);
req.end();

var timeoutID = setTimeout(() => {
    req.res ? req.res._dump() : req.once('response', res => res._dump());
    if ((req.aborted = true) && req.socket) {
        req.socket.destroy(new Error(`TIME_OUT! exceed ${timeout}ms`, 9));
    }
}, timeout);