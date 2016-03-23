'use strict';

var http = require('http');
var heapdump = require('heapdump');
var fs = require('fs');
var os = require('os');
var zlib = require('zlib');
var querystring = require('querystring');

var dumpFileName = '/run/user/1000/remoteheapdump';

http.createServer(function (req, res) {
    let qs = querystring.parse(req.url.split('?')[1]); // validate hostname and pid
    if (qs.host === os.hostname() && parseInt(qs.pid) === process.pid
        && /^\/.*\.heapsnapshot\.gz/.test(req.url) ) {

        heapdump.writeSnapshot(dumpFileName, function (err) {
            if (err) {
                console.error(err, err.stack);
                res.writeHead(500, 'dump failed');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'application/octet-stream'});
                var rs = fs.createReadStream(dumpFileName, {flags: 'r'});
                var gzip = zlib.createGzip({level: 9, memlevel: 9});
                rs.pipe(gzip).pipe(res);
                // 写完后删除文件.
                fs.unlink(dumpFileName);
            }
        });
    } else {
        console.log();
        res.writeHead(404, 'Not found');
        res.end();
    }
}).listen(1234);



