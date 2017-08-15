'use strict';

let loader = {};

loader.init = function () {
    let i = 0;
    let j = 8 / z.i;
    console.log(j);
};

let call = function (callback) {
    console.log('start');
    callback && callback();
};



try {
    call(loader.init);
} catch (err) {
    console.error(err, err.stack);
}
