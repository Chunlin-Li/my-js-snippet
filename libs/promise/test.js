'use strict';

function foo (time, name) {
    return new Promise(function (resolve, reject){
        let timeout = setTimeout(() => {
            resolve('foo ' + name);
        }, time);
    });
}

function bar (time, name) {
    return new Promise(function (resolve, reject) {
        let timeout = setTimeout(() => {
            resolve('bar ' + name);
        }, time);
    });
}

function baz (type) {
    return new Promise(function (resolve, reject) {
        switch (type) {
            case 1:
                foo(1000, 'Tom')
                    .then(res => {
                        resolve(res);
                    });
                break;
            case 2:
                resolve(new Promise(function (resolve, reject) {
                    let timeout = setTimeout(() => {
                        resolve('baz ' + 'whatever');
                    }, 500);
                }));
                break;
            case 3:
                foo(1000, 'Tom')
                    .then(res => {
                        resolve(bar(1000, res));
                    });
                break;
            case 4:
                foo(1000, 'Tom')
                    .then(res => {
                        return bar(1000, res);
                    });
                break;
        }
    });
}


function fn() {
    return baz(2)
        .then(res => {
            console.log('A', res);
            // if ((Date.now()/1000 >> 0) % 2 === 0)
                // return new ReferenceError('It\'s My Fault!');
                // return new Promise((resolve, reject) => {
                //     // resolve(18);
                //     reject(19);
                // });
            // throw new Buffer('ppqppqpq');
                return bar(1000, res);
            // else
            //     return Promise.reject(res);
        })
        .then(res => {
            if (res === false) return res;
            console.log('B', res);
            // return foo(2000, res);
            return Promise.resolve({
                then(resolve, reject){
                    console.log('this is insert thenable promise ');
                    // resolve('YYQQKZZ');
                    reject('pseudo error');
                }
            }).catch(err => {
                console.error('insert promise error', err);
                throw err;
            });
        })
        .then(res => {
            if (res === false) return res;
            // aaaa.xxxx = 3;
            console.log('C', res);
            return res;
        })
        .catch(err => {
            if (err instanceof Error) {
                console.error('ERR1', err);
                throw err;
            } else {
                console.log('OK1', err);
                throw err;
            }
        }).then(res => {
            console.log('then after catch: ', res);
            return res;
        }).catch(err => {
            console.log('second catch: ', err);
            if (err instanceof Error) {
                console.error('ERR2', err);
                throw err;
            } else {
                console.log('OK2', err);
                throw err;
            }
        });

}


var pp = fn().then(res => {
    console.log('=================================');
    return res;
}).then(res => console.log('output:', res))
    .catch(err => {
        console.error('output ERROR:',err,err.stack);
        throw 'fuck';
    }).catch(err => {
        aaaa.xxxx = 3;
}).then(res => {
        console.log('last then');
    });


setTimeout(() => {
    console.log('pp stats:', pp);
    pp.catch(err => console.error('delay catch;', err));
}, 3000);

process.on('uncaughtException', err => console.error('The Uncaught Exception:', err));
