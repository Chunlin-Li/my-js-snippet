'use strict';

var util = require('util');
var os = require('os');

var nsqSender = new (require('../nsq_archive_client/writer'));

/*
 Facade 模块, 给 info, warn, error, debug, MQ 等提供一个统一接口.
 */

var noconflict = console;


function _logify(obj, level) {
    return JSON.stringify({
        timestamp: new Date(),
        //level: level,
        hostname: os.hostname(),
        content: obj
    });
}

function _logPrefix(level) {
    return util.format('%s %s - ', (new Date()).toJSON(), level);
}

var LEVELS = {ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG'};

function error() {
    process.stderr.write(util.format.apply(this, arguments) + '\n');
    mq.send('console', _logPrefix(LEVELS.ERROR) + util.format.apply(this, arguments));
}

function warn() {
    //process.stderr.write(util.format.apply(this, arguments) + '\n');
    mq.send('console', _logPrefix(LEVELS.WARN) + util.format.apply(this, arguments));
}

function info() {
    //process.stdout.write(util.format.apply(this, arguments) + '\n');
    mq.send('console', _logPrefix(LEVELS.INFO) + util.format.apply(this, arguments));
}

function debug(section) {
    section = section || 'DEFAULT';
    return util.debuglog(section);
}

function toMQ(topic, obj, cb) {
    topic = process.env.NODE_ENV + '-' + topic;
    mq.send(topic, _logify(obj, undefined), cb);
}

function dspRespTime(msg) {
    dspRespTime.buffer.push(msg);
    if (dspRespTime.buffer.length > 100) {
        mq.send('dspRespTime', JSON.stringify(dspRespTime.buffer));
        dspRespTime.buffer = [];
    }
}
dspRespTime.buffer = [];

module.exports = {debug, info, log: info, warn, error, toMQ, dspRespTime};
