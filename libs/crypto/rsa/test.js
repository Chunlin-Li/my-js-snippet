'use strict';

let crypto = require('crypto');
let fs = require('fs');

let pri_key = fs.readFileSync('/home/chunlin/test/node_crypto/openssl_pri_key');
let pub_key = fs.readFileSync('/home/chunlin/test/node_crypto/openssl_pub_key');
let cipher = fs.readFileSync('/home/chunlin/test/node_crypto/cipher');
let sign = fs.readFileSync('/home/chunlin/test/node_crypto/mysign');

// let msg = crypto.createHash('md5').update('123456').digest();
// console.log('msg : ', msg.toString('base64'));

// let cipher = crypto.publicEncrypt(pri_key, msg);
//
// console.log('cipher : ', cipher.toString('base64'));

let plain = crypto.privateDecrypt(pri_key, cipher);

console.log('decrypt : ', plain.toString());