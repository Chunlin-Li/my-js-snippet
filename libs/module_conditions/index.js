'use strict';

/**
 * if the module has loaded, run load_cb, else run non_load_cb
 * @param {string} path path to module.
 * @param {function} load_cb
 * @param {function} non_load_cb
 */
function ifLoaded(path, load_cb, non_load_cb){
    var fullPath = require.resolve(path);
    if (!require('path').isAbsolute(fullPath)) {
        mod = require(path);
        load_cb(mod);
        return;
    }
    var mod = require.cache[fullPath];
    if (!(mod && mod.loaded)) {
        require(path);
        non_load_cb && non_load_cb();
    } else if (mod.loaded) {
        load_cb(mod.exports);
    }
}




