'use strict';

const Readable = require('stream').Readable;
const fs = require('fs');
const util = require('util');





function ReadWrap(path, options) {
    Readable.call(this, options);

    this.under = fs.createReadStream('./test-duplex.js', {highWaterMark: options.highWaterMark});
}
util.inherits(ReadWrap, Readable);
ReadWrap.prototype._read = function _read(size) {
    var self = this;
    this.under.on('data', function(chunk) {
        self.push(chunk);
    });
    console.log('\n @@@@@@@@@@@ listener: ', self.listeners('data'), size)
};




// fileRS.on('readable', function() {
//     console.log(this.read(20));
// });

// fileRS.on('data', function(chunk) {
//     console.log('data', chunk.toString());
// });
// fileRS.on('end', function() {
//    console.log('end');
// });


var rw = new ReadWrap('./test-duplex.js', {highWaterMark: 16});

rw.pipe(process.stdout);