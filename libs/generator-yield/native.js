#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var testPath = '/tmp';

var g = function*() {
    let t, files;
    files = yield $P(fs.readdir)(testPath);
    let sizes = [];
    for (var item of files[1]) {
        t = path.resolve(testPath, item); // abs path
        t = yield $P(fs.lstat)(t);
        sizes.push(t[1].size);
    }
    return sizes.reduce((p,c) => p+=c, 0);
};

simpleExecutor(g).then(res => console.log('mmmmm', res)).catch(err => console.error(err.stack));

// var x = g();
// var promise =
//     Promise.resolve().then(x.next.bind(x)) // return first promise
//     .then(res => res.value) // return first real value
//     .then(x.next.bind(x)) // return second promise
//     .then(res => res.value) // second real value
//     .then(x.next.bind(x)) // last return value
//     .then(res => console.log('total size:', res)) // consumer result
//     .catch(err => console.error('catch Error',err));



function $P(fn) {
    return function() {
        let args = [].slice.call(arguments);
        return new Promise(function(resolve) {
            args.push(function(){
                resolve([].slice.call(arguments));
            });
            fn.apply(null, args);
        });
    }
}

function simpleExecutor(gen) {
    gen = gen();
    return (function looper (prom) {
        return prom.then(realValue => {
            let t =gen.next(realValue); // t = {value: promise, done:xxx}
            return t.done ? t.value : looper(Promise.resolve(t.value));
        });
    })(Promise.resolve());
}
