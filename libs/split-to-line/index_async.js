/**
 * @param {string} filePath : file absolute path.
 * @param {function} cb : cb(err, buf, nextFile){ ... }.  return false stop reading  nextFile(false) will stop reading
 * @param {function} end_cb : end_cb(){ ... }
 */
function readByLine(filePath, cb, end_cb) {
    'use strict';

    let fs = require('fs');
    let end = 0;

    var options = {
        chunkSize: 1024 * 1024 * 16,
        separator: 0x0a
    };

    let stream = fs.createReadStream(filePath, {highWaterMark: options.chunkSize});

    let tail = new Buffer(0); // Buffer.concat() not support null, so use Empty Buffer.

    stream.on('data', chunk => {
        let offset = 0,
            LF_index = chunk.indexOf(options.separator, offset);
        end &= 10; // clear chunk end flag

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
            over('chunk');
            stream.resume();
        };

        // the head and tail of chunk may be incomplete line, use special process.
        if (LF_index === -1) {
            tail = Buffer.concat([tail, chunk]);
            over('chunk');
        } else {
            let _tail = tail;
            process.nextTick(() => {
                cb(undefined, Buffer.concat([_tail, chunk.slice(0, LF_index)]), foo);
            });
            offset = LF_index + 1;
            tail = new Buffer(0);
            stream.pause();
        }

    });

    function over(flag) {
        if (flag === 'global') {
            end |= 10;
        } else if (flag === 'chunk') {
            end |= 1;
        }
        if (end !== 11) {
            return; // not really end
        }
        if(tail.length > 0) { // output last line if has.
            cb(undefined, tail, end_cb);
        } else {
            end_cb();
        }
    }

    stream.on('end', () => {
        over('global');
    });

    stream.on('error', err => cb(err));
}

// compress: function readByLine(filePath,cb,end_cb){'use strict';let fs=require('fs');let end=0;var options={chunkSize:1024*1024*16,separator:0x0a};let stream=fs.createReadStream(filePath,{highWaterMark:options.chunkSize});let tail=new Buffer(0);stream.on('data',chunk=>{let offset=0,LF_index=chunk.indexOf(options.separator,offset);end&=10;var foo=finish=>{if(finish===false){stream.destroy();return}if(offset<chunk.length){LF_index=chunk.indexOf(options.separator,offset);if(LF_index!==-1){let _offset=offset;process.nextTick(()=>{cb(undefined,chunk.slice(_offset,LF_index),foo)});offset=LF_index+1;return}else{tail=chunk.slice(offset)}}over('chunk');stream.resume()};if(LF_index===-1){tail=Buffer.concat([tail,chunk]);over('chunk')}else{let _tail=tail;process.nextTick(()=>{cb(undefined,Buffer.concat([_tail,chunk.slice(0,LF_index)]),foo)});offset=LF_index+1;tail=new Buffer(0);stream.pause()}});function over(flag){if(flag==='global'){end|=10}else if(flag==='chunk'){end|=1}if(end!==11){return}if(tail.length>0){cb(undefined,tail,end_cb)}else{end_cb()}}stream.on('end',()=>{over('global')});stream.on('error',err=>cb(err))}

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
