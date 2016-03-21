var addon = (() => {try {return require('./build/Release/addon.node');} catch (err) {return require('./build/Debug/addon.node');}})();

console.time('all');
console.log(addon.priCount(1000 * 1000 * 10));

console.timeEnd('all');

