'use strict';
var util = require('util');
var mq = require('../mq');
var os = require('os');

/*
 export logger 的生成方法, 直接根据 Logger 的 name 获取 Logger 实例.
 所有的 Logger 实例都需要在 module 中事先配置好.
 */

var loggers = new Map();
var debugs = new Map();

var mqServerName = 'test';

function _mq () {

}

function _logify (obj) {
  return JSON.stringify({
    timestamp: new Date(),
    hostname: os.hostname(),
    content: obj
  });
}


function error (...args) {
  console.warn(...args);
}

function warn (...args) {
  console.warn(...args);
}

function info (...args) {
  console.log(...args);
}

function debug (section) {
  section = section || 'DEFAULT';
  return util.debuglog(section);
}

function toMQ (topic, obj, cb) {

  mq.send(mqServerName, topic, _logify(obj), cb);
}


module.exports = {
  debug,
  info,
  warn,
  error,
  toMQ
};

