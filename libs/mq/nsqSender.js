'use strict';
var nsq = require('nsqjs');
var events = require('events');
var stream = require('stream');
var util = require('util');
var http = require('http');

var _senders = {};
var _configs = {};
var confN = 0;

// 配置信息格式: [[alias, host, port, option]...] alias 可以作为获取 sender 的 id
// 配置 lookupd 的地址, 动态获取 nsqd 列表并进行发送.
//  var sample = [
//    ['sample', '10.0.0.1', '4150', {tls: true}],
//    ['test', 'localhost', '1234', {}]
//  ];

var initiator = new events.EventEmitter();
initiator.connected = new Set();
initiator.on('_connected_one', function (name) {
    initiator.connected.add(name);
    if (initiator.connected.size === confN) {
        initiator.emit('done');
    }
});

/**
 * 初始化
 */
function init(configs) {
    // 需要先通过 http 请求从 lookupd 上获取 nsqd list, 然后随机取一个nsqd建立连接
    for (let i in configs) {
        let name = configs[i][0];
        _configs[name] = {
            addr: `${configs[i][1]}:${configs[i][2]}`,
            opt: configs[i][3]
        };
        confN ++;
        getNSQDNode(name, (err, producer) => {
            if (err) initiator.emit('error', err);
            console.error('address : ', JSON.stringify(producer.tcp_port));
            if (!_senders[name]) {
                _senders[name] = new Sender(name, producer.broadcast_address, '' + producer.tcp_port, _configs[name]['opt']);
            }
        });
    }
    return initiator;
}


function getSender(name) {
    if (_senders[name]) {
        return _senders[name];
    }
    throw new Error('no thus sender. please add config to config list', 1);
}


function Sender(name, nsqdHost, nsqdPort, options) {
    let socket = {nsqdHost: nsqdHost, nsqdPort: nsqdPort};
    this.name = name;
    this.streams = {};
    this.writer = new nsq.Writer(nsqdHost, nsqdPort, options);
    this.writer.on('ready', function () {
        console.log('NSQ sender ready : %s', socket);
        initiator.emit('_connected_one', this.name);
    }.bind(this));
    this.writer.on('error', err => {
        // 捕获异常, 重连
        getNSQDNode(this.name, (err, producer) => {
            if (err) initiator.emit('error', err);
            let newWriter = new nsq.Writer(producer.broadcast_address, `${producer.tcp_port}`, _configs[this.name]['opt'])
            newWriter.on('ready', this.writer._events.ready);
            newWriter.on('error', this.writer._events.error);
            this.writer = newWriter;
            this.writer.connect();
        });
        initiator.emit('error', err);
    });
    this.writer.connect();
}


function getNSQDNode(name, cb) {
    let data = '';
    http.get(`http://${_configs[name]['addr']}/nodes`, res => {
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            res.body = data.toString();
            res.body = JSON.parse(res.body);
            if (res.body.status_code !== 200) {
                console.error('MQ Init Error. nsq lookup nodes failed: %s', res.status_txt);
                return;
            }
            let count = res.body.data.producers.length;
            let producer = res.body.data.producers[Math.floor(Math.random() * count)];
            cb(null, producer);
        });
    }).on('error', err => cb(err));
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


function SenderStream(name, topic) {
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
