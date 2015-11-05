'use strict';
var util = require('util');
var mq = require('../mq');
var process = require('process');
var os = require('os');

var mqServerName = 'test';  // MQ Server alias in config

/*
 Facade 模块, 给 info, warn, error, debug, MQ 等提供一个统一接口.
 */


function _logify (obj, level, TRXNID) {
  return JSON.stringify({
    timestamp: new Date(),
    level: level,
    hostname: os.hostname(),
    content: obj
  });
}

var LEVELS = {ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG'};

function error () {
  process.stderr.write(util.format.apply(this, arguments) + '\n');
}

function warn () {
  process.stderr.write(util.format.apply(this, arguments) + '\n');
}

function info () {
  process.stdout.write(util.format.apply(this, arguments) + '\n');
}

function debug (section) {
  section = section || 'DEFAULT';
  return util.debuglog(section);
}

function toMQ (topic, TRXNID, obj, cb) {
  mq.send(mqServerName, topic, _logify(obj, LEVELS.INFO, TRXNID), cb);
}

module.exports = {debug, info, log: info, warn, error, toMQ};

