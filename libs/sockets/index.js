'use strict';

var net = require('net');

var server = net.createServer((socket) => {
    console.log('CONNECTED  ' + socket.remoteAddress + ' : ' + socket.remotePort );
    //socket.on('data',);
});

server.listen(1337, '127.0.0.1', () => {
    var address = server.address();
    console.log('open server on %j', address);
});


var client = new net.Socket();

client.connect()