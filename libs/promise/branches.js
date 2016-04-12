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


function baz (time, name) {
    return new Promise(function (resolve, reject) {
        let timeout = setTimeout(() => {
            resolve('baz ' + name);
        }, time);
    });
}

function qux (time, name) {
    return new Promise(function (resolve, reject) {

        if ('Tom' === name) {
            foo(200, name).then(res => {
                if (false) {
                    return bar(250, 'Jerry')
                } else {
                    resolve(baz(150, 'Tom and Jerry'));
                }
            }).then(res =>{
                
            });
        } else {
            resolve('Deny!')
        }

    });
}


qux(300, 'Tom')
    .then(res => console.log(res));
