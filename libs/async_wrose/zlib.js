'use strict';

const zlib = require('zlib');

const orgStr = 'Node is similar in design to, and influenced by, systems like Ruby\'s Event Machine or Python\'s Twisted. Node takes the event model a bit further, it presents an event loop as a runtime construct instead of as a library. In other systems there is always a blocking call to start the event-loop. Typically behavior is defined through callbacks at the beginning of a script and at the end starts a server through a blocking call like EventMachine::run(). In Node there is no such start-the-event-loop call. Node simply enters the event loop after executing the input script. Node exits the event loop when there are no more callbacks to perform. This behavior is like browser JavaScript — the event loop is hidden from the user.HTTP is a first class citizen in Node, designed with streaming and low latency in mind. This makes Node well suited for the foundation of a web library or framework.Just because Node is designed without threads, doesn\'t mean you cannot take advantage of multiple cores in your environment. Child processes can be spawned by using our child_process.fork() API, and are designed to be easy to communicate with. Built upon that same interface is the cluster module, which allows you to share sockets between processes to enable load balancing over your cores.';
const compressed = zlib.deflateRawSync(orgStr);

var count = 0;
var timeout = 0;
var res;

function start1() {  // sync
    let start, i;
    setTimeout(start1, 0);

    for (i = 0; i < 50; i++) {

        start = process.hrtime();

        res = zlib.inflateRawSync(compressed);

        let end = process.hrtime(start)[1] / 1e6;
        if (end > 5) timeout ++;
        count ++;
    }
}

function start2() {  // asyncs

    (function fn() {

        setTimeout(fn, 0);

        for (var i = 0; i < 50; i ++) {

            let start = process.hrtime();
            zlib.inflateRaw(compressed, function (err, buf) {

                let end = process.hrtime(start)[1] / 1e6;
                if (end > 5) timeout++;
                count++;
            });
        }
    })();
}

start1();


setInterval(() => {
    console.log('timeout : ', timeout + '/' + count);
    timeout = 0;
    count = 0;
    console.log('mem: ', JSON.stringify(process.memoryUsage()));
}, 1000);
