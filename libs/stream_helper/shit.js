var fs = require('fs');


var buf = fs.readFileSync('./adx-lostid.log');
var splited = buf.toString().split('\n');
var id;
var idMap = {};
for (var line of splited) {
    id = line.split('\t')[0];
    idMap[id] = 1;
}
let obj;

readByLine('./reqInfo-12.log', (err, buf, next) => {
    obj = JSON.parse(buf);
    if (idMap[obj.content.sspRequest.id]) {
        console.error(buf.toString());
    }
    next();
}, () => {
    console.log('@@@@END');
});










function readByLine(filePath, cb, end_cb) {
    'use strict';

    let fs = require('fs');

    var options = {
        chunkSize: 1024 * 1024 * 16,
        separator: 0x0a
    };

    let stream = fs.createReadStream(filePath, {highWaterMark: options.chunkSize});

    let tail = new Buffer(0); // Buffer.concat() not support null, so use Empty Buffer.

    stream.on('data', chunk => {

        let offset = 0;
        let LF_index = chunk.indexOf(options.separator, offset);

        // the head and tail of chunk may be incomplete line, use special process.
        if (LF_index === -1) {
            tail = Buffer.concat([tail, chunk]);
            return;
        } else {
            if (cb(undefined, Buffer.concat([tail, chunk.slice(0, LF_index)])) === false) {
                stream.destroy();
                return;
            }
            tail = new Buffer(0);
            offset = LF_index + 1;
        }

        while (offset < chunk.length) {

            LF_index = chunk.indexOf(options.separator, offset);
            if (LF_index !== -1) {
                if (cb(undefined, chunk.slice(offset, LF_index)) === false) {
                    stream.destroy();
                    return;
                }
                offset = LF_index + 1;
            } else { // tail of chunk is incomplete.
                tail = chunk.slice(offset);
                return;
            }

        }

    });

    stream.on('end', () => {
        if(tail.length > 0) { // output last line if has.
            cb(undefined, tail);
        }
        end_cb();
    });

    stream.on('error', err => cb(err));
}