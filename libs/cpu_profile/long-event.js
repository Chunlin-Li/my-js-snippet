'use strict';




function loop() {
    let obj = {};
    for (var i = 0; i < 1000; i ++) {
        obj['random' + i] = Math.random() * 1000;
    }
    // console.dir(obj);
}

(function fn(n) {
    loop();
    if (--n > 0) {
        setTimeout(fn.bind({}, n), 0);
    } else {
        console.log('finished');
    }
})(1e3);



var interval = 100;
setInterval(function() {
    let last = process.hrtime();          // replace Date.now()
    setImmediate(function() {
        var delta = process.hrtime(last)[1]; // with process.hrtime()
        if (delta > 1e6) {
            console.log("node.eventloop_blocked", delta);
        }
    });
}, interval);
