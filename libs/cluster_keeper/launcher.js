'use strict';

const cluster = require('cluster');
const worker = require('./worker');
let n = 1;

if(cluster.isMaster) {
    cluster.fork();
} else {
    worker();
}