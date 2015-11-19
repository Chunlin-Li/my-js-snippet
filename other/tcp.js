'use strict';
var net = require('net');

var all = [];

net.createServer(sock => {
  sock.on('data', data => {
    console.log('Sock on data : ', data);
  });
  sock.on('end', () => {
    console.log('Sock on end ');
  });
  sock.write('Entered \n');
  all.push(sock);
  all.forEach(item => {
    if (sock !== item) {
      sock.pipe(item);
    }
  });
}).listen(1337, '127.0.0.1');

