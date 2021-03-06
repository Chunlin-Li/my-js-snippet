/**
 * @param {string} filePath : file absolute path.
 * @param {function} cb : cb(err, buf){ ... }.  return false stop reading
 * @param {function} end_cb : end_cb(){ ... }
 */
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

// compressed : function readByLine(filePath,cb,end_cb){'use strict';let fs=require('fs');var options={chunkSize:1024*1024*16,separator:0x0a};let stream=fs.createReadStream(filePath,{highWaterMark:options.chunkSize});let tail=new Buffer(0);stream.on('data',chunk=>{let offset=0;let LF_index=chunk.indexOf(options.separator,offset);if(LF_index===-1){tail=Buffer.concat([tail,chunk]);return}else{if(cb(undefined,Buffer.concat([tail,chunk.slice(0,LF_index)]))===false){stream.destroy();return}tail=new Buffer(0);offset=LF_index+1}while(offset<chunk.length){LF_index=chunk.indexOf(options.separator,offset);if(LF_index!==-1){if(cb(undefined,chunk.slice(offset,LF_index))===false){stream.destroy();return}offset=LF_index+1}else{tail=chunk.slice(offset);return}}});stream.on('end',()=>{if(tail.length>0){cb(undefined,tail)}end_cb()});stream.on('error',err=>cb(err))}

// test
readByLine('./01', (err, buf) => {
    if (err) {
        console.log('ERR: ', err);
        return;
    }
    console.log(buf.toString());
}, () => {
    console.log('@FINISHED');
});