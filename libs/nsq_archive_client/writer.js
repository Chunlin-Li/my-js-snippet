'use strict';
var nsq = require('nsqjs');
var event = require('events');
var http = require('http');
var util = require('util');

const RECONN_INTERVAL = 5 * 60 * 1000; // 5 min
const MAX_QUEUE_LEN = 1000;
const SEND_RETRY_TIMES = 3;
const RECON_RETRY_TIMES = 5;
const RETRY_DELAY = 500; // 500ms

/* Events :  error  reconnect */

module.exports = NSQSender;

// lookupd host and port
function NSQSender(host, port, options) {
    if (!this instanceof NSQSender){
        return new NSQSender(host, prot, options);
    }
    event.EventEmitter.call(this);

    this.nsqd = null;
    this.host = host;
    this.port = port;
    this.options = options;
    this.queue = []; // need schedule periodic
    this._timeout = null;
    this._reconnect_retry = 0;
    this.destroyed = false;

    this._lookup();

    // set interval to flush queue
    setInterval(this._flushQueue.bind(this), 5000);
}
util.inherits(NSQSender, event.EventEmitter);


NSQSender.prototype.destroy = function destroy() {
    if (this.nsqd) {
        this.nsqd.close();
    }
    this.destroyed = true;
    this.queue = null;
    clearTimeout(this._timeout);
};

NSQSender.prototype.send = function send(topic, msg, callback) {
    callback = callback || function(){};
    if (this.destroyed) {
        throw new Error('should not send msg after destroyed');
    }
    if (!this.nsqd) {
        // enqueue
        this.queue.push(arguments);
        if (this.queue.length > MAX_QUEUE_LEN) {
            let e = new Error('Max Queue Length Reached');
            callback(e);
            this.emit('error', e);
            this.destroy();
        }
    } else {
        this.nsqd.publish(topic, msg, err => {
            if (err) {
                console.log('nsq send msg error:', err);
                if (arguments['retry'] > SEND_RETRY_TIMES) {
                    callback && callback('nsq msg send failed after retry.', msg.slice(0, 100));
                } else {
                    arguments['retry'] = arguments['retry'] + 1 || 1;
                    this.queue.push(arguments);
                }
            } else {
                callback(null, msg);
            }
        });
    }
};

NSQSender.prototype._connectNSQD = function _connectNSQD(host, port, options) {
    let writer = new nsq.Writer(host, port, options);
    writer.on(nsq.Writer.READY, onREADY.bind(writer, this));
    writer.on(nsq.Writer.ERROR, onERROR.bind(writer, this));
    writer.on(nsq.Writer.CLOSED, onCLOSED.bind(writer, this));
    writer.connect();
    return writer;
};

NSQSender.prototype._flushQueue = function (){
    // send queued message and clear
    for (var t of this.queue.splice(0)) {
        this.send.apply(this, t);
    }
};

function onREADY(self) {
    // set self.nsqd
    self.nsqd = this;
    console.log('ready prot:', this.nsqdPort);
    self._flushQueue();
    // set reconnect timeout
    self._timeout = setTimeout(self.nsqd.close.bind(self.nsqd) , RECONN_INTERVAL * (Math.random() + 1));
    // clear retry counter
    self._reconnect_retry = 0;
}

function onERROR(self, err) {
    // log
    console.error('nsqd/lookupd error: ', err, err.stack);
    // count retry time
    if (++ self._reconnect_retry > RECON_RETRY_TIMES){
        self.emit('error', err);
        self.destroy();
    }
}

function onCLOSED(self) {
    console.log('nsqd writer closed');
    // unset self.nsqd
    self.nsqd = null;
    // reconnect
    self._lookup();
    self.emit('reconnect');
    // cleart time out
    clearTimeout(self._timeout);
}


NSQSender.prototype._lookup = function _lookup() {
    if (this.destroyed) {
        throw new Error('should not send msg after destroyed');
    }
    let data = [], self = this;
    http.get('http://' + this.host + ':' + this.port + '/nodes', res => {
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
            data = Buffer.concat(data).toString();
            parseResult(data);
        });
    }).on('error', err  => {
        err.message = 'request lookupd error. Caused by:' + err.message;
        onERROR(self, err);
        setTimeout(() => {
            self._lookup();
        }, RETRY_DELAY);
    });


    function parseResult(res) {
        res = JSON.parse(res);
        if (res.status_code !== 200) {
            console.error('NSQ Lookup Error. lookup nodes failed: ' + res.status_txt);
            return;
        }
        let count = res.data.producers.length;
        let producer = res.data.producers[Math.floor(Math.random() * count)]; // get a random nsqd

        if (producer) {
            self._connectNSQD(producer.broadcast_address, producer.tcp_port, self.options);
        } else {
            if (++ self._reconnect_retry > RECON_RETRY_TIMES) {
                self.emit('error', new Error('no valid nsqd node'));
                self.destroy();
            } else {
                console.log('retry lookup, ', self._reconnect_retry);
                setTimeout(() => {
                    self._lookup();
                }, RETRY_DELAY);
            }
        }
    }
};


// var NSQSender = require('./writer');
// var count = 0;
//
// var sender = new NSQSender('127.0.0.1', 4161);
// sender.on('error', err => console.log('zzz ', err));
// sender.on('reconnect', () => console.log('zzz reconnect'));
//
//
// setInterval(() => {
//     let start = Date.now();
//     sender.send('senderTest', 'Hello ' + count++, (err, msg) => {
//         if (err) console.error(err);
//         else console.log('time:', Date.now() - start, msg);
//     });
// }, 100);

