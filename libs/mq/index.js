'use strict';
var events = require('events');

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
 * 发送消息
 * @param name 在 config 中给 sender 设置的 alias
 * @param topic 消息的主题(Key, 频道等)
 */
function send (name, topic, message, cb) {
  if (!curSender) {
    console.error('Message Sender not initiated');
    return;
  }
  // 保证 send 方法不会抛出异常, 内部错误 callback 返回.
  let s = send['_invalidT_' + name];
  if (s && ((s + 1000 * 60) > Date.now())) {  // 60秒内出现过错误
    cb && cb();
    return;
  }
  try {
    curSender.getSender(name).sendMessage(topic, message, cb);
  } catch (err) {
    send['_invalidT_' + name] = Date.now();
    cb && cb(err);
  }
}

/**
 * 获取对应的 Writable Stream
 */
function getStream (name, topic) {
  return curSender.getSender(name).getStream(topic);
}

module.exports = {
  init: init,
  send: send,
  getStream: getStream
};