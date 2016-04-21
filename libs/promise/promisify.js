'use strict';


/**
 * promisify asynchronous function, support not only node style (err, value), but also
 * any other callback signatures. because the wrapper function will return a promise
 * which will resolve an array value. for node style you will got [err, value], for other
 * style as well.
 *
 * @param {function} fn any asynchronous function, last arguments should be callback.
 * @returns {Function} a function wrapper. you can call this func as usual, expects the last callback.
 * @promise {array} final value. the wrapper function will return promise. the resolved promise will return a array,
 *   the elements of array will one-to-one correspond to original function callback signature
 */
function $P(fn) {
    return function() {
        let THIS = this ? this : {};
        let args = [].slice.call(arguments);
        return new Promise(function(resolve) {
            args.push(function(){
                resolve([].slice.call(arguments));
            });
            fn.apply(this, args);
        }.bind(THIS));
    }
}
