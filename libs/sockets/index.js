'use strict';

var idGenerator = (function generate(hostID) {
    var os = require('os');
    var idBase = new Buffer(15);   // 4B time + 2B pid + 6B hostname/MAC + 3B increment
    // docker container id(hostname) is 6 hex char.
    hostID = hostID || (() => {var ni = os.networkInterfaces();for(var n in ni){ if (!ni[n][0]['internal']) return ni[n][0]['mac'].replace(/:/g, '')}})();
    idBase.write(hostID, 6, 6, 'hex');  // docker container id is hex char
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
        return idBase.toString('base64').replace('+', '_').replace('/', '-');
    }
})();

for (var i =0 ; i < 10000; i ++) {
    console.log(idGenerator());
}