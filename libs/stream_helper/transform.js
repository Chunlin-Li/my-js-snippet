'use strict';


const util = require('util');
const Readable = require('stream').Readable;
const fs = require('fs');
const Writable = require('stream').Writable;
const Transform = require('stream').Transform;


// var readstream = fs.createReadStream('./transform.js', {highWaterMark: 32});


function IterReadable(iterable, options) {
    if (!options) options = {};
    // options.objectMode = true;
    Readable.call(this, options);
    this._iterable = iterable;
    this._iter = iterable[Symbol.iterator]();
    this._nextValue = undefined;
    this._done = false;
}
util.inherits(IterReadable, Readable);
IterReadable.prototype._read = function _read() {
    if (this._done) {
        this.push(null);
        // console.log('last push:', this.push(null));
        return;
    }
    let next = this._iter.next();
    if (next.done) this._done = true;
    this._nextValue = next.value;
    this.push(this._nextValue);
    // console.log('push return value:', this.push(this._nextValue));
};



function MyTest (options) {
    if (!options){
        options = {};
    }
    // options.objectMode = true;
    Transform.call(this, options);
}
util.inherits(MyTest, Transform);
var count = 0;
MyTest.prototype._transform = function tran(data, encoding ,callback){
    console.log('transform step ' + count ++);
    if (data) {
        console.log('cb: ' + this.push('value: "' + data + '"\n'));
    } else {
        this.push('');
    }
    callback();
};

var IR = new IterReadable(['he', 'll', 'o', 'wo', 'rl', 'd']);

var t = new MyTest();
// IR.pipe(t).pipe(process.stdout);

IR.pipe(new Transform({transform: function(data, encoding, callback) {
    // console.log('transform step ' + count ++);
    if (data) {
        this.push('value: "' + data + '"\n');
    } else {
        this.push('');
    }
    callback();
}})).pipe(process.stdout);

// t.on('data', function (chunk) {
//     console.log('!!!!!', chunk.toString());
// });



