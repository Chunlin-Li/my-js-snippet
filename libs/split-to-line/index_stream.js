'use strict';
const Writable = require('stream').Writable;
const Stream = require('stream');
const fs = require('fs');
const util = require('util');
const EMPTYBUF = new Buffer(0);
const DEFAULTCHUNKSIZE = 16 * 1024 * 1024;
const NOOP = function() {};

/**
 * Support callback, next()/hasNext(), for ... of, yield stl.next()
 * @param input
 * @param eachLineCallback
 * @constructor
 */


function SplitToLine(input, eachLineCallback) {
    if (!this instanceof SplitToLine)  {
        return new SplitToLine(input, eachLineCallback);
    }
    Writable.call(this);

    let options = {
        chunkSize: DEFAULTCHUNKSIZE,
        separator: 0x0a
    };

    if (typeof input === 'string') {
        this.input = getFileStream(input);
    } else if (typeof input === 'object') {
        if (input.input instanceof Stream.Readable)
            this.input = input.input;
        else if (typeof input.input === 'string')
            this.input = getFileStream(input.input);
        options = Object.assign(options, input);
    }

    function getFileStream(path) {
        if (fs.existsSync(path))
            return fs.createReadStream(path, {highWaterMark: options.chunkSize});
        else
            throw new ReferenceError('file ' + path + ' not exists');
    }

    this.options = options;

    if (this.input)
        this.input.pipe(this);

    this.isPromise = false;
    if (eachLineCallback)
        this.outputCallback = eachLineCallback;
    else {// promise
        this.isPromise = true;
        this.outputCallback = this.defaultOutput;
    }

    this.isEmpty = true;
    this.tail = EMPTYBUF;
    this.nextCallbacks = [];
    this.nextResults = [];

    this.on('pipe', (src) => {
        if (src instanceof Stream.Readable)
            this.input = src;
    })
}
util.inherits(SplitToLine, Writable);


SplitToLine.prototype._write = function (data, encoding, nextReadCallback) {

    let LF_index;
    let offset = 0;
    let self = this;
    self.isEmpty = self.isEmpty && data.length === 0;

    function handle (finish) {
        if (finish) {
            self.input.unpipe();
            self.input.destroy();
        }
        let _tail = self.tail;
        let _offset = offset;

        if (offset <= data.length) {
            LF_index = data.indexOf(self.options.separator, offset);

            if (LF_index !== -1) { // contains separator
                offset = LF_index + 1;
                self.tail = EMPTYBUF;
                process.nextTick(() => {
                    self.outputCallback(null, {
                        last: false,
                        line: Buffer.concat([_tail, data.slice(_offset, LF_index)]),
                        next: handle
                    })
                });
            } else { // not contains separator
                self.tail = Buffer.concat([self.tail, data.slice(offset)]);
                nextReadCallback();
            }
        }
    }

    handle();
};

SplitToLine.prototype.next = function (cb) {

    if (!this.isPromise) return cb && cb('not support');

    if (cb) {
        if (this.nextResults.length > 0) {
            process.nextTick(() => {
                let element = this.nextResults.shift();
                cb(element.err, element.res);
            });
        } else {
            this.nextCallbacks.push(cb);
        }
    } else {
        if (this.nextResults.length > 0) {
            let element = this.nextResults.shift();
            if (element.err)
                return Promise.reject(element.err);
            else
                return Promise.resolve(element.res);
        } else {
            return new Promise((resolve, reject) => {
                this.nextCallbacks.push(function(err, res) {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
        }
    }

};

SplitToLine.prototype.end = function () {
    if (!this.isEmpty)
        this.outputCallback(null, {
            last: true,
            line: this.tail,
            next: () => {}
        });
};

SplitToLine.prototype.defaultOutput = function (err, res) {
    let next = res.next;
    res.next = NOOP;
    if (this.nextCallbacks.length > 0) {
        process.nextTick(() => {
            this.nextCallbacks.shift()(err, res)
        });
    } else {
        this.nextResults.push({err:err, res:res});
    }
    next();
};

/*
 * var stl = new SplitToLine(readStream, eachLineCallback);
 * eachLineCallback:  function(err, result){}
 * result: {last: true/false,  line: buffer, next:readNextLineCallback}
 * yield stl.next();
 */

// var sp = new SplitToLine('./01', (err, res) => {
//     console.log('line:', res.line.toString(), 'last?',res.last);
//     if (/b/.test(res.line)) {
//         return res.next(true);
//     }
//     res.next();
// });

var stl = new SplitToLine('./01');

// stl.next((err, res) => {
//     console.log(err, res.last, res.line.toString());
// });


