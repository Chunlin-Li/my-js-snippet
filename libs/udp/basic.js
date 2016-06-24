'use strict';

const udp = require('dgram');

let server = udp.createSocket('udp4');
let client = udp.createSocket('udp4');
let start, end;

server.on('error', err => {
    console.log(err);
});

server.on('message', (msg, rinfo) => {
    end = process.hrtime(start);
    console.log('msg:', msg.toString(), 'info:', JSON.stringify(rinfo));
    console.log('time:' , end[1]/1e6);
});

server.bind(1999);

setTimeout(() => {
    client.send('hello udp', 0, 9, 1999, '127.0.0.1', err => {
    });
    client.send('good bye udp', 0, 9, 1999, '127.0.0.1', err => {
    });
    setTimeout(() => client.close(), 4000);
    start = process.hrtime();

}, 3000);

