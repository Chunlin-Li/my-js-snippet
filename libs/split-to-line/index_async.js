/**
 * @param {string} filePath : file absolute path.
 * @param {function} cb : cb(err, buf, next){ ... }.  return false stop reading  next(false) will stop reading
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

        var foo = finish => {
            if (finish === false) {
                stream.destroy();
                return;
            }
            if (offset < chunk.length) {
                LF_index = chunk.indexOf(options.separator, offset);
                if (LF_index !== -1) {
                    let _offset = offset;
                    process.nextTick(()=>{
                        cb(undefined, chunk.slice(_offset, LF_index), foo);
                    });
                    offset = LF_index + 1;
                    return;
                } else { // tail of chunk is incomplete.
                    tail = chunk.slice(offset);
                }
            }
            stream.resume();
        };

        // the head and tail of chunk may be incomplete line, use special process.
        if (LF_index === -1) {
            tail = Buffer.concat([tail, chunk]);
            return;
        } else {
            let _tail = tail;
            process.nextTick(() => {
                cb(undefined, Buffer.concat([_tail, chunk.slice(0, LF_index)]), foo);
            });
            offset = LF_index + 1;
            tail = new Buffer(0);
        }

        stream.pause();
    });

    stream.on('end', () => {
        if(tail.length > 0) { // output last line if has.
            cb(undefined, tail, end_cb);
        } else {
            end_cb();
        }
    });

    stream.on('error', err => cb(err));
}

// compress: function readByLine(filePath,cb,end_cb){'use strict';let fs=require('fs');var options={chunkSize:1024*1024*16,separator:0x0a};let stream=fs.createReadStream(filePath,{highWaterMark:options.chunkSize});let tail=new Buffer(0);stream.on('data',chunk=>{let offset=0;let LF_index=chunk.indexOf(options.separator,offset);var foo=finish=>{if(finish===false){stream.destroy();return}if(offset<chunk.length){LF_index=chunk.indexOf(options.separator,offset);if(LF_index!==-1){let _offset=offset;process.nextTick(()=>{cb(undefined,chunk.slice(_offset,LF_index),foo)});offset=LF_index+1;return}else{tail=chunk.slice(offset)}}stream.resume()};if(LF_index===-1){tail=Buffer.concat([tail,chunk]);return}else{let _tail=tail;process.nextTick(()=>{cb(undefined,Buffer.concat([_tail,chunk.slice(0,LF_index)]),foo)});offset=LF_index+1;tail=new Buffer(0)}stream.pause()});stream.on('end',()=>{if(tail.length>0){cb(undefined,tail,end_cb)}else{end_cb()}});stream.on('error',err=>cb(err))}

// test
readByLine('./01', (err, buf, next) => {
    if (err) {
        console.log('ERR: ', err);
        return;
    }
    console.log(buf.toString());
    setTimeout(next, 0);
}, () => {
    console.log('@FINISHED');
});