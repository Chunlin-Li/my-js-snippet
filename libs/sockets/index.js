'use strict';

var idGenerator = (function generate() {
    var idBase = new Buffer(15);   // 4B time + 6B hostname + 3B pid + 2B increment
    //idBase.write(require('os').hostname(), 4, 6, 'hex');  // docker container id is hex char
    idBase.write(require('os').hostname().slice(0,6), 4, 6, 'utf8');  // docker container id is hex char
    idBase.writeIntBE(process.pid, 10, 3);
    var prevSecond = Date.now()/1000 >> 0;
    var increment = 0;
    var tmp;

    return function() {
        if ((tmp = Date.now()/1000 >> 0) !== prevSecond) {
            prevSecond = tmp;
            increment &= 0x00FF; // keep lower 16bit
        }
        idBase.writeUInt32BE(prevSecond, 0);
        idBase.writeUInt16BE(increment++, 13);
        return idBase.toString('base64');
    }
})();


setInterval(()=>{
    console.log(idGenerator());
}, 300);