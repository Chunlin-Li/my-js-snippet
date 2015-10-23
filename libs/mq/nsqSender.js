'use strict';
var nsq = require('nsqjs');
var events = require('events');
var stream = require('stream');
var util = require('util');

var _senders = {};

// 配置信息格式: [[alias, host, port, option]...] alias 可以作为获取 sender 的 id
//  var sample = [
//    ['sample', '10.0.0.1', '4150', {tls: true}],
//    ['test', 'localhost', '1234', {}]
//  ];
var _configs = null;


var initiator = new events.EventEmitter();
initiator.connected = new Set();
initiator.on('_connected_one', function (name) {
  initiator.connected.add(name);
  if (initiator.connected.size === _configs.length) {
    initiator.emit('done');
  }
});

/**
 * 初始化
 */
function init(configs) {
  for (let i in configs) {
    if (configs.hasOwnProperty(i)) {
      let name = configs[i][0];
      if (!_senders[name]) {
        _senders[name] = new Sender(...configs[i]);
      }
    }
  }
  _configs = configs;
  return initiator;
}


function getSender (name) {
  if (_senders[name]) {
    return _senders[name];
  }
  throw new Error('no thus sender. please add config to config list', 1);
}


function Sender (name, nsqdHost, nsqdPort, options) {
  let socket = {nsqdHost: nsqdHost, nsqdPort: nsqdPort};
  this.name = name;
  this.streams = {};
  this.writer =  new nsq.Writer(nsqdHost, nsqdPort, options);
  this.writer.on('ready', function () {
    console.log('NSQ sender ready : %s', socket);
    initiator.emit('_connected_one', this.name);
  }.bind(this));
  this.writer.connect();
}


/**
 * 发送消息
 */
Sender.prototype.sendMessage = function (topic, message, cb) {
  this.writer.publish(topic, message, cb);
};

/**
 * 获取 Stream
 */
Sender.prototype.getStream = function (topic) {
  if (!topic) {
    throw new Error('must specify the topic');
  }
  return this.streams[topic] ? this.streams[topic] : (this.streams[topic] = new SenderStream(this.name, topic));
};

/**
 * 关闭 Sender
 */
Sender.prototype.close = function () {
  this.writer.close();
};


function SenderStream (name, topic) {
  this.sender = getSender(name);
  this.topic = topic;
}
SenderStream.prototype.write = function (chunk, enc, cb) {
  var text = Buffer.isBuffer(chunk) ? chunk.toString(enc) : chunk;
  this.sender.sendMessage(this.topic, text, cb);
};

module.exports = {
  init: init,
  getSender: getSender
};
