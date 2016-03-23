'use strict';

var http = require('http');
var heapdump = require('heapdump');
var fs = require('fs');
var zlib = require('zlib');

var dumpFileName = '/run/user/1000/remoteheapdump';
var testFile = '/home/chunlin/Music/Rachmaninov _P2_sample.mp3';

http.createServer(function (req, res) {
    http.cc = [];
    if (/^\/.*\.heapsnapshot\.gz/.test(req.url)) {
        heapdump.writeSnapshot(dumpFileName, function (err) {
            if (err) {
                console.error(err, err.stack);
                res.writeHead(500, 'dump failed');
                res.end();
            } else {
                // 写完后删除 tmpfs 中的文件.
                res.writeHead(200, {'Content-Type': 'application/octet-stream'});
                var rs = fs.createReadStream(dumpFileName, {flags: 'r'});
                var gzip = zlib.createGzip({level: 9, memlevel: 9});
                rs.pipe(gzip).pipe(res);
                fs.unlink(dumpFileName);
            }
        });
    } else {
        let x = [];
        for (var i = 0; i < 17000; i++) {
            x.push('test');
        }
        http.cc.push(x.join('#'));
        res.writeHead(404, 'Not found');
        res.end();
    }
}).listen(1234);



