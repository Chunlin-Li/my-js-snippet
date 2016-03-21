'use strict';
var util = require('util');
var mq = require('../mq');
var os = require('os');

var mqServerName = 'server';  // MQ Server alias in config

/*
 Facade 模块, 给 info, warn, error, debug, MQ 等提供一个统一接口.
 */

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
  mq.send(mqServerName, 'console', _logPrefix(LEVELS.ERROR) + util.format.apply(this, arguments));
}

function warn() {
  mq.send(mqServerName, 'console', _logPrefix(LEVELS.WARN) + util.format.apply(this, arguments));
}

function info() {
  mq.send(mqServerName, 'console', _logPrefix(LEVELS.INFO) + util.format.apply(this, arguments));
}

function debug(section) {
  section = section || 'DEFAULT';
  return util.debuglog(section);
}

function toMQ(topic, obj, cb) {
  topic = process.env.NODE_ENV + '-' + topic;
  mq.send(mqServerName,  topic, _logify(obj, undefined), cb);
}

function dspRespTime(msg) {
  dspRespTime.buffer.push(msg);
  if (dspRespTime.buffer.length > 100) {
    mq.send(mqServerName, 'dspRespTime', JSON.stringify(dspRespTime.buffer));
    dspRespTime.buffer = [];
  }
}
dspRespTime.buffer = [];

module.exports = {debug, info, log: info, warn, error, toMQ, dspRespTime};
