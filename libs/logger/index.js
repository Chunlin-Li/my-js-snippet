'use strict';
var bunyan = require('bunyan');
var util = require('util');

/*
export logger 的生成方法, 直接根据 Logger 的 name 获取 Logger 实例.
所有的 Logger 实例都需要在 module 中事先配置好.
 */

var loggers = new Map();
var debugs = new Map();

var configs = [
  {
    name: 'console',
    streams: [
      {level: 'info', stream: process.stdout},
      {level: 'error', stream: process.stderr}
    ]
  }
  //{
  //  name: 'ro_file',
  //  streams: [{
  //    type: 'rotating-file',
  //    path: '/home/chunlin/WebstormProjects/node-cron/logs/node.log',
  //    period: '1d',
  //    count: 7
  //  }]
  //}
  //{ // mq 的 stream 初始化是异步的, 所以该配置需要在 mq 初始化后再 使用 getLogger 添加
  //  name: 'mq',
  //  streams: [{
  //    stream: require('../mq').getStream('test', 'myTopic')
  //  }]
  //}
];


// 创建 Logger, 带错误检查机制.
function _create(option) {
  let logger = bunyan.createLogger(option);
  logger.on('error', function () {
    throw new Error('logger initiation error: ' + JSON.stringify(option));
  });
  return logger;
}
function init() {
  configs.forEach(function (item) {
    if (!loggers.has(item.name)) {
      loggers.set(item.name, _create(item));
    }
  });
}
init();

/**
 * 获取 Logger 实例.
 * @param name|option, 已经配置的logger的name, 或者是新的配置.
 */
function getLogger (name) {
  if (typeof name === 'object') { // add new logger configuration in run time.
    // overwrite if logger name exists.
    loggers.set(name.name, _create(name));
    name = name.name;
  } else if (name === 'debug') { // debug logger use Build-in util.debuglog
    return function (section) {
      section = section || 'DEFAULT';
      return util.debuglog(section);
    };
  } else {
    name = name || 'console'; //  default logger is console.
  }
  let logger = loggers.get(name);
  if (!logger) {
    throw new Error('No Such Logger : ' + name, 1);
  }
  return logger;
}

module.exports = getLogger;

