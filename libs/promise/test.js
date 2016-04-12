'use strict';

// function foo (time, name, callback) {
//     console.log('enter foo');
//     setTimeout(() =>  {
//         console.log('hello ' + name);
//         callback('hello ' + name);
//     }, time);
// }
// foo(5000, 'GG', data => console.log(data));

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



baz(2)
    .then(res => {
        console.log('A', res);
        // if (Date.now() % 2 === 0)
        //     return bar(1000, res);
        // else
            return Promise.reject('got it');
    })
    .then(res => {
        console.log('B', res);
        return foo(2000, res);
    })
    .then(res => {
        console.log('C', res);
    })
    .catch(err => {
        console.error('ERR', err);
    });

