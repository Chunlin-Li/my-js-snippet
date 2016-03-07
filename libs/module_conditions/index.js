'use strict';

/**
 * 如果模块已经加载则执行....
 * 如果模块尚未加载.....
 */

function moduleCond(path, load_cb, non_load_cb){
    var fullPath = require.resolve(path);
    var mod = require.cache[fullPath];
    if (!(mod && mod.loaded)) {
        require(path);
        non_load_cb && non_load_cb();
    } else if (mod.loaded) {
        load_cb(mod.exports);
    }
}


require('v8');

moduleCond('v8', (readByLine) => {
    console.log(readByLine.toString());
}, () => {
    console.log('not load');
});

console.log('finished');


