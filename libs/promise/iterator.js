'use strict';

var list = [11,22,33,44];


function foo (n) {
    return new Promise(
        function(resolve) {
            // console.log('p exec');
            setTimeout(() =>{
                resolve(n);
            }, 300);
        }
    )
}

function Thenable(fn) {
    this.then = fn;
}


var P = foo(10).then(f);

function f(res) {
    console.log('this', this);
    if (res) {
        console.log(res -= 1);
        P = P.then(f);
        return new Thenable(function(fn) {
            return 
        });
    } else {
        console.log('end!');
    }
}
