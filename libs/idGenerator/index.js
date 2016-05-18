'use strict';

function generate(hostID) {
    var os = require('os');
    var idBase = new Buffer(15);   // 4B time + 2B pid + 6B hostname/MAC + 3B increment
    hostID = hostID || (() => {var ni = os.networkInterfaces();for(var n in ni){ if (!ni[n][0]['internal']) return ni[n][0]['mac'].replace(/:/g, '')}})();
    idBase.write(hostID.slice(0, 12), 6, 6, 'hex');  // docker container id(hostname) is 12 hex char.
    idBase.writeUIntBE(process.pid, 4, 2);
    var prevSecond = Date.now()/1000 >>> 0;
    var increment = 0, tmp;

    return function() {
        if ((tmp = Date.now()/1000 >>> 0) !== prevSecond) {
            prevSecond = tmp;
            increment &= 0x00FFFF; // keep lower 32bit
        }
        idBase.writeUInt32BE(prevSecond, 0);
        idBase.writeUIntBE(increment++, 12, 3);
        return idBase.toString('base64').replace(/\+/g, '_').replace(/\//g, '-');
    }
}

module.exports = generate;

/*
 // init
 var id_gen = generate(require('os').hostname());
 // generate
 console.log(id_gen());
 */
