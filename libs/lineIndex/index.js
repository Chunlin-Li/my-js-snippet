'use strict';
var fs = require('fs');

var options = {
    //separator: '\n',  // \n or \r\n
    chunkSize: 1024 * 1024 * 16,
    ignoreEmpty: true,
    encode: 'buffer'    // buffer, utf8, ascii, ....
};

function foo(filePath, cb, end_cb) {  //  cb(err, buf, last)

    if (!fs.existsSync(filePath)) {
        cb(Error('file not exist: ' + filePath));
        return;
    }

    // create file read stream
    let stream = fs.createReadStream(filePath, {flags: 'r', mode: 438, autoClose: true, highWaterMark: options.chunkSize});

    let tail = new Buffer(0);

    // read and split into lines
    stream.on('data', chunk => {

        let offset = 0;
        let LFindex = -1;

        LFindex = chunk.indexOf(0x0a, offset);
        if (LFindex === -1) {
            // chunk 不会为 空
            tail = Buffer.concat([tail, chunk]);
            offset = chunk.length; // to end event .
        } else {
            cb(undefined, Buffer.concat([tail, chunk.slice(0, LFindex - 1)]));
            offset = LFindex + 1;
        }

        while (offset < chunk.length) {

            LFindex = chunk.indexOf(0x0a, offset);
            if (LFindex !== -1) {
                cb(undefined, chunk.slice(offset, LFindex - 1));
                offset += ( LFindex + 1 );
            } else {
                tail = chunk.slice(offset);
            }

        }

    });

    stream.on('end', () => {
        end_cb();
    });

    stream.on('error', err => line_cb(err));
}

module.exports = foo;