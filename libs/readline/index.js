'use strict';
var fs = require('fs');

var defaultOption = {
    separator: '\n',
    chunkSize: 1024 * 1024 * 16
};

/*
 * readline(filepath, [option], line_cb, [end_cb])
 *
 * line_cb(err, line){}
 * err : null or Error object
 * line : string, one line file text
 *
 * end_cb() {}
 */
function readline(filePath) {
    // arguments initiate
    let option = typeof arguments[1] !== 'object' ? defaultOption : Object.assign(defaultOption, arguments[1]);
    let line_cb, end_cb;
    for(let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
            line_cb = arguments[i];
            end_cb = arguments[i+1];
            break;
        }
    }
    if (typeof line_cb !== 'function')
        line_cb(Error('Callback arguments not correct! useage: readline(filepath, [option], line_cb, [end_cb])'));
    if (!fs.existsSync(filePath))
        line_cb(Error('file not exist: ' + filePath));
    // create file read stream
    let stream = fs.createReadStream(filePath, {flags: 'r', mode: 438, autoClose: true, highWaterMark: option.chunkSize});
    let lines = [''];
    // read and split into lines
    stream.on('data', chunk => {
        let readOut = chunk.toString().split(option.separator);
        lines[0] += readOut[0];
        lines = lines.concat(readOut.splice(1));
        while (lines.length > 1) {
            line_cb(null, lines.splice(0, 1)[0]);
        }
    });

    stream.on('end', () => {
        line_cb(null, lines[0]);
        end_cb && end_cb();
    });

    stream.on('error', err => line_cb(err));
}

module.exports = readline;