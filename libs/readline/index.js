'use strict';
var fs = require('fs');

var defaultOption = {
    separator: '\n',
    chunkSize: 1024 * 1024 * 16
};

/*
 * readline(filepath, [option], callback)
 * callback(err, line, end){}
 * err : null or Error object
 * line : string, one line file text
 * end : boolean, true if ended, otherwise false.
 */
function readline(filePath) {
    let option = typeof arguments[1] !== 'object' ? defaultOption : Object.assign(defaultOption, arguments[1]);
    if (typeof arguments[arguments.length -1] !== 'function')
        throw new Error('No Callback! last argument must be callback');
    else
        var cb = arguments[arguments.length -1];
    if (!fs.existsSync(filePath)) {
        throw new Error('file not exist: ' + filePath);
    }

    let stream = fs.createReadStream(filePath, {flags: 'r', mode: 438, autoClose: true, highWaterMark: option.chunkSize});
    let lines = [''];

    stream.on('data', chunk => {
        let readOut = chunk.toString().split(option.separator);
        lines[0] += readOut[0];
        lines = lines.concat(readOut.splice(1));
        while (lines.length > 1) {
            cb(null, lines.splice(0, 1)[0], false);
        }
    });

    stream.on('end', () => {
        cb(null, lines[0], false);
        cb(null, null, true);
    });

    stream.on('error', err => cb(err));
}

module.exports = readline;