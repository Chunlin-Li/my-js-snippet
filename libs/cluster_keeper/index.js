'use strict';

var cluster = require('cluster');
var http = require('http');

var N = 3;
var workers = [];

function newWorker() {
    var worker = cluster.fork();
    worker.on('disconnect', function () {
        console.log('worker disconnect.', this.process.pid);
    });
    worker.on('error', function (err) {
        console.log('worker error', this.process.pid, err.stack);
    });
    worker.on('exit', function (code, signal) {
        console.log('worker exit.', this.process.pid, code, signal);
    });
    worker.on('listening', function (addr) {
        console.log('worker listening.', this.process.pid);
    });
    worker.on('message', function (msg) {
        console.log('worker message.', this.process.pid, JSON.stringify(msg));
    });
    workers.push(worker);
}

if(cluster.isMaster) {
    for (var i = 0; i < N; i ++) {
        newWorker();
    }
    cluster.on('disconnect', function(work) {
        console.log('cluster disconnect. ', work.process.pid);
    });
    cluster.on('listening', function (work, addr) {
        console.log('cluster listening. ', work.process.pid);
    });
    cluster.on('fork', function (work) {
        console.log('cluster fork.', work.process.pid);
    });
    cluster.on('message', function (work, msg) {
        console.log('workers length ', Object.keys(cluster.workers).length);
        newWorker();
        console.log('cluster message.', work, JSON.stringify(msg));
    });
    cluster.on('online', function(work) {
        console.log('cluster online.', work.process.pid);
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('cluster exit:', worker.process.pid, code, signal);
        console.log('workers length ', Object.keys(cluster.workers).length);
    });

} else {
    var server = http.createServer(function(req, res){
        if (req.url.indexOf('remove') !== -1) {
            cluster.worker.send('I will die');
            server.close();
            cluster.worker.disconnect();
        }
        console.log('process ', process.pid);
        res.end();
    });
    server.listen(3131);
}



process.on('SIGHUP', function() {
    console.log('receive signal');
    if (cluster.isMaster) {
        console.log('Master', cluster.workers);
    }
});


