var addon = (() => {try {return require('./build/Release/addon.node');} catch (err) {return require('./build/Debug/addon.node');}})();



console.log((addon.ObjHello('8')).toString());


