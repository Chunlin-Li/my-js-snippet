'use strict';

var uuid = require('uuid');
var v8 = require('v8');


function BigMap(keyLen, valLen, limit) {
    this.keyLen = keyLen;
    this.valLen = valLen;
    this.size = 0;
    this.limit = limit;
    this.eleLen = keyLen + valLen;
    this._buf = new Buffer(this.eleLen * limit);
    this._buf.fill(0);
    this._obj = {};
}
var step = 13;

BigMap.prototype.set = function (key, value) {
    if (this.size === this.count) return false;
    if (key.length > this.keyLen || value.length > this.valLen) return false;
    let hc = murmurhash3_32_gc(key);
    hc = hc % this.limit;
    while (this._buf[hc * this.eleLen] !== 0) {
        //console.log('conf set with key : ' + key, hc);
        confSetCount ++;
        //hc = hc < this.limit ? hc + 1 : 0;
        hc = (hc  + step) % this.limit;
    }
    this._buf.write(key, hc * this.eleLen);
    this._buf.write(value, hc * this.eleLen + this.keyLen);
    return 0;
};

BigMap.prototype.get = function (key) {
    if (key.length > this.keyLen) return false;
    let hc = murmurhash3_32_gc(key);
    hc = hc % this.limit;
    if (this._buf[hc * this.eleLen] === 0) return undefined;
    while (this._buf.slice(hc * this.eleLen, hc * this.eleLen + this.keyLen).toString().replace(/\u0000/g, '') !== key) {
        //console.log('conf get with key : ' + key, hc);
        confGetCount ++;
        //hc = hc < this.limit ? hc + 1 : 0;
        hc = (hc  + step) % this.limit;
    }
    return this._buf.slice(hc * this.eleLen + this.keyLen, hc * this.eleLen + this.eleLen).toString().replace(/\u0000/g, '');
};


function murmurhash3_32_gc(key,seed){var remainder,bytes,h1,h1b,c1,c1b,c2,c2b,k1,i;remainder=key.length&3;bytes=key.length-remainder;h1=seed;c1=0xcc9e2d51;c2=0x1b873593;i=0;while(i<bytes){k1=((key.charCodeAt(i)&0xff))|((key.charCodeAt(++i)&0xff)<<8)|((key.charCodeAt(++i)&0xff)<<16)|((key.charCodeAt(++i)&0xff)<<24);++i;k1=((((k1&0xffff)*c1)+((((k1>>>16)*c1)&0xffff)<<16)))&0xffffffff;k1=(k1<<15)|(k1>>>17);k1=((((k1&0xffff)*c2)+((((k1>>>16)*c2)&0xffff)<<16)))&0xffffffff;h1^=k1;h1=(h1<<13)|(h1>>>19);h1b=((((h1&0xffff)*5)+((((h1>>>16)*5)&0xffff)<<16)))&0xffffffff;h1=(((h1b&0xffff)+0x6b64)+((((h1b>>>16)+0xe654)&0xffff)<<16))}k1=0;switch(remainder){case 3:k1^=(key.charCodeAt(i+2)&0xff)<<16;case 2:k1^=(key.charCodeAt(i+1)&0xff)<<8;case 1:k1^=(key.charCodeAt(i)&0xff);k1=(((k1&0xffff)*c1)+((((k1>>>16)*c1)&0xffff)<<16))&0xffffffff;k1=(k1<<15)|(k1>>>17);k1=(((k1&0xffff)*c2)+((((k1>>>16)*c2)&0xffff)<<16))&0xffffffff;h1^=k1}h1^=key.length;h1^=h1>>>16;h1=(((h1&0xffff)*0x85ebca6b)+((((h1>>>16)*0x85ebca6b)&0xffff)<<16))&0xffffffff;h1^=h1>>>13;h1=((((h1&0xffff)*0xc2b2ae35)+((((h1>>>16)*0xc2b2ae35)&0xffff)<<16)))&0xffffffff;h1^=h1>>>16;return h1>>>0}

//module.exports = BigMap;
var N = 1024 * 1024;
var map = new BigMap(40, 10, Math.floor(1.35 * N));
var obj = {};
//console.log(map.set('a', '123'));
//console.log(map.get('a'));

var confSetCount= 0;
var confGetCount= 0;
console.log('start');
var keylist = [];
var start;
let key;
var x;

for (let i = 0; i < N; i ++) {
    keylist.push(uuid.v4().toString());
}

start = process.hrtime();
for (let i = 0; i < N; i ++) {
    obj[keylist[i]] = i.toString();
    x = obj[keylist[i]];
}
console.log('time use : ',  process.hrtime(start));


start = process.hrtime();
for (let i = 0; i < N; i ++) {
    map.set(keylist[i], i.toString());
    x = map.get(keylist[i]);
}
console.log('time use : ',  process.hrtime(start));




//console.log('obj contain : ', Object.keys(map._obj).length);
console.log('confSet count : ', confSetCount);
console.log('confGet count : ', confGetCount);
//console.log('heap statistics : ', v8.getHeapStatistics());

var opbuf = new Buffer(2 * N);

for (let i = 0; i < 2 * N;  i++) {
    opbuf[i] = map._buf[i * map.eleLen] == 0 ? 48 : 49;
}
console.log(opbuf.toString().replace(/1+/g, ',').split(',').length);