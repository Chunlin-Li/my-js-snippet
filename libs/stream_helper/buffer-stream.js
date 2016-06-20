'use strict';

const zlib = require('zlib');
const stream = require('stream');

const orgStr = 'highly optimized virtual machines can run web apps at blazing speed. But one should';

function StreamZlib(zlibType, opt) {

    this.zlibType = zlibType;
    this.opt = opt;
    this.zlibs = [];
    this.freezlibs = [];

    for (var t = null, i = 0; i < 150; i ++) {
        t = buildPipes(this.zlibType, this.opt);
        this.freezlibs.push(t);
        this.zlibs.push(t);
    }
}

function buildPipes(zlibType, opt) {
    let zlibInst = new zlibType(opt);
    zlibInst.on('readable', () => {
        let r = zlibInst.read();
        zlibInst._offset = 0;
        if (zlibInst.ext_callback) {
            zlibInst.ext_callback(null, r);
        } else {
            console.log('******  no callback');
        }
    });
    zlibInst.ext_flush = (callback) => {
        zlibInst.ext_callback = callback;
        zlibInst.flush();
    };
    return zlibInst;
}

StreamZlib.prototype.write = function(input, callback) {
    let cur;
    if (this.freezlibs.length) {
        cur = this.freezlibs.shift();
    } else {
        cur = buildPipes(this.zlibType);
        this.zlibs.push(cur);
    }
    cur.write(input);
    cur.ext_flush((err, data) => {
        // this.zlibs.splice(this.zlibs.findIndex(item => item === cur), 1);
        this.freezlibs.push(cur);
        callback && callback(err, data);
    });
};




// var sf = new StreamZlib(zlib.DeflateRaw);
// let cc =0;
//
// (function fn() {
//     sf.write(new Buffer(orgStr), function (err, data) {
//         cc++;
//         if (cc % 10000 === 0 ) {
//             console.log(cc);
//         }
//         // if (cc < 5)
//             fn();
//     });
// })();

module.exports = StreamZlib;
