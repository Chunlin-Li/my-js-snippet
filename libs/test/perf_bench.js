'use strict';

var obj = {},start, x,
    assert = require('assert'),
    N = 1000 * 100 * 1;
start = process.hrtime();

/*####################################*/
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
/*####################################*/

for(var i = 0 ; i < N; i++) {  }
start = process.hrtime(); for(var i = 0 ; i < N; i++) {}
console.log('container cost ' + timeUse(start)); for(var i = 0 ; i < N; i++) {obj[i] = 'data' + i;}

start = process.hrtime();
/****   section 1 ******************/
/***********************************/
for(var i = 0 ; i < N; i++ ) {
    x = Math.random();
}
/***********************************/
console.log('section 1 : ' + timeUse(start));start = process.hrtime();for(let i = 0 ; i < N; i++) {} console.log('container cost ' + timeUse(start));

start = process.hrtime();
/****   section 2 ******************/
/***********************************/
for(var i = 0 ; i < N; i++) {
    x = idGenerator();
}
/***********************************/
console.log('section 2 : ' + timeUse(start));


function timeUse(start) {var t = process.hrtime(start);return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';}









