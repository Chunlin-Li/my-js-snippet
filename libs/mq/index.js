'use strict';
var events = require('events');

console.log('base:  ' + require('path').dirname(require.main.filename) + '\n');
/*
   Message Queue 的模板. 针对不同的 MQ 实现对应的 Sender, 并配置在 MQ_TYPE 中.
 */

var curSender = null;
var MQ_TYPE = {
  NSQ: './nsqSender',
  ZMQ: './zmqSender'
};

/**
 * 全局下只需要初始化一次即可.
 * @param type  (NSQ|ZMQ|....)
 * @param config 针对特定实现的 config
 * @returns 返回一个 EventEmitter. Events: 'done' 表示初始化完成.
 */
function init (type, config) {
  if (!MQ_TYPE[type]) {
    throw new Error('No such type of message queue', 1);
  }
  curSender = require(MQ_TYPE[type]);
  return curSender.init(config);
}

/**
 * 直接使用 config 中的 alias 作为 name 取出已经配置好的 sender.
 * @param name sender alias
 * @returns {*} 返回一个Sender对象
 */
function getSender (name) {
  if (!curSender) {
    throw new Error('Message Sender not initiated');
  }
  return curSender.getSender(name);
}

/**
 * 发送消息
 * @param name 在 config 中给 sender 设置的 alias
 * @param topic 消息的主题(Key, 频道等)
 */
function send (name, topic, message, cb) {
  if (!curSender) {
    throw new Error('Message Sender not initiated');
  }
  getSender(name).sendMessage(topic, message, cb);
}

/**
 * 获取对应的 Writable Stream
 */
function getStream (name, topic) {
  return getSender(name).getStream(topic);
}

module.exports = {
  init: init,
  getSender: getSender,
  send: send,
  getStream: getStream
};