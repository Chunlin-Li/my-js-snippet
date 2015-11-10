'use strict';
var nsq = require('nsqjs');
var events = require('events');
var stream = require('stream');
var util = require('util');
var http = require('http');

var _senders = {};
var _configs = {};
var confN = 0;
var retry = [];

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
        _getNSQDNode(name, (err, producer) => {
            if (err) {
                initiator.emit('error', err);
                return;
            }
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

    this.writer.on('error', err => initiator.emit('error', err));
    this.writer.on('ready', () => {
        console.log('NSQ sender ready : %s', JSON.stringify(socket));
        initiator.emit('_connected_one', this.name);
        this.closeTimeout = _closeTimeout(this);
    });
    this.writer.on('closed', () => {
        // writer closed, reconnect!
        clearTimeout(this.closeTimeout); // clear last setTimeout
        _getNSQDNode(this.name, (err, producer) => {
            if (err) {
                initiator.emit('error', err);
                return;
            }
            let newWriter = new nsq.Writer(producer.broadcast_address, `${producer.tcp_port}`, _configs[this.name]['opt']);
            newWriter.on('ready', () => {
                console.log('NSQ sender reconnect ready : %s:%s', producer.broadcast_address, producer.tcp_port);
                this.closeTimeout = _closeTimeout(this);
                _msgRetry(); // retry send failed message if it has.
            });
            newWriter.on('error', this.writer._events.error[0] || this.writer._events.error);
            newWriter.on('closed', this.writer._events.closed[0] || this.writer._events.closed);
            this.writer = newWriter; // replace writer.
            this.writer.connect();
        });
    });

    this.writer.connect();
}

function _closeTimeout (sender) {
    var time = 3600000 * 24 + Math.ceil(Math.random() * 300000); // 24 hour + random (0s, 5min)
    //var time = 2000 + Math.ceil(Math.random() * 200); // debug
    return setTimeout(() => {
        sender.writer.close();
    }, time)
}


function _msgRetry () {
    while (retry.length > 0) {
        let value = retry.pop();
        value[0].writer.publish(value[1], value[2], value[3]);
        //console.warn('failed message retry !!!!!!');
    }
}


function _getNSQDNode(name, cb) {
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
            if (producer) {
                cb(null, producer);
            } else {
                cb(new Error('no valid nsqd node'));
            }
        });
    }).on('error', err => cb(err));
}


/**
 * 发送消息
 */
Sender.prototype.sendMessage = function (topic, message, cb) {
    //this.writer.publish(topic, message, cb);
    this.writer.publish(topic, message, (err) => {
        if (err && retry.length < 1000) {
            retry.unshift([this, topic, message, cb]);
        } else {
            cb && cb(err);
        }
    });
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
