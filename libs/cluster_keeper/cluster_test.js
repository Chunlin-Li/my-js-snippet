'use strict';

var cluster = require('cluster');
var http = require('http');

var N = 3;
var tmp = 0;


if (cluster.isMaster) {
    for (var i = 0; i < N; i ++) {
        var worker = cluster.fork();
        console.log('!!! ', worker.isDead(), worker.isConnected());
    }
    setTimeout(() => {
        let worker = cluster.workers['1'];
        worker.kill('SIGKILL');
        setTimeout(() => console.log('??? ', worker.isDead(), worker.isConnected()), 100);
    }, 1000);
    cluster.on('message', function (work, msg) {
        if (JSON.parse(msg).type === 'jobreq'){
            console.log('' + process.pid + ' cluster message.', JSON.stringify(msg));
            fn(msg, work);
        } else {
            tmp ++;
            if (tmp === N) {
                work.send({id:JSON.parse(msg).id, type:'final', res: tmp})
            }
        }
    });
} else {
    let msgCtrl = {};
    var server = http.createServer(function(req, res){
        let taskId = Date.now();
        console.log('process ', process.pid);
        // process.send('job request from' + process.pid, ' taskId: ', taskId);
        process.send({id: taskId, type:'jobreq'});
        msgCtrl[taskId] = (content) => {
            res.end(content);
        }
    });
    console.log('use slave :', server._usingSlaves);
    server.listen(3131);


    process.on('message', msg => {
        if (JSON.parse(msg).type === 'act') {
            process.send({id:JSON.parse(msg).id, type:'res'})
        } else if (/final/.test(msg)) {
            process.send('');
        } else {
            console.log(`worker ${process.pid} receive msg: ${msg}`);
        }
    })
}
function getinfo(req, res) {

}
function fn (msg) {
    let job = JSON.parse(msg);
    for (var i in cluster.workers) {
        let worker = cluster.workers[i];
        worker.send({id:job.id, type:'act'})
    }
}




