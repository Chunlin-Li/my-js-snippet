'use strict';
var nsq = require('nsqjs');
var event = require('events');
var http = require('http');
var util = require('util');

const RECONN_INTERVAL = 5 * 60 * 1000; // min
const MAX_QUEUE_LEN = 1000;
const SEND_RETRY_TIMES = 3; // for send
const RECON_RETRY_TIMES = 5; // for auto reconnect
const RETRY_DELAY = 500; // ms

/**
 * Construct a new NSQSender to handle everything.
 * You provide a lookupd address, it will find nsqd, random pick and auto reconnect.
 * You send message, it will check error info and retry.
 * If the net failure cause a socket error, it will auto lookup and retry other valid node.
 * You new instance and send message synchronously, it will handle the async initiation.
 *
 * @class
 * @param {string} host  nsqlookupd host
 * @param {number} port  nsqlookupd http port
 * @param {object} options  this options pass to nsqjs module directly
 *
 * @function send (topic, message, callback)
 * @function destroy
 *
 * @event error NSQSender general error event. it's safe to listen a ignore handler like `function(){}`
 * @event close If this event be fired, the NSQSender instance will be destroyed after current handle finished. you need to handle this!
 *
 * @event lookup
 * @event nsqd_connected fired when NSQSender connected. one param: socket address string.
 * @event nsqd_error fired when nsqd has a error event. one param: error
 * @event nsqd_closed fired when nsqd closed.
 * @event msg_error fired when send message to nsq encounter an error.
 * @event lookupd_error fired when connect to nsqlookupd error or response code not 200
 */

module.exports = NSQSender;
function NSQSender(host, port, options) {
    if (!this instanceof NSQSender){
        return new NSQSender(host, port, options);
    }
    event.EventEmitter.call(this);

    this.nsqd = null;
    this.host = host;
    this.port = port;
    this.options = options;
    this.queue = []; // need schedule periodic
    this._timeout = null;
    this._connect_retry = 0;
    this.destroyed = false;
    this._flushInterval = null;

    lookup.bind(this)();

    // set interval to flush queue
    this._flushInterval = setInterval(flushQueue.bind(this), 5000);
}
util.inherits(NSQSender, event.EventEmitter);


NSQSender.prototype.destroy = function destroy() {
    if (this.nsqd) {
        this.nsqd.close();
        this.nsqd = null;
    }
    this.destroyed = true;
    this.queue = null;
    clearTimeout(this._timeout);
    clearInterval(this._flushInterval);
};

NSQSender.prototype.send = function send(topic, msg, callback) {
    // callback = callback || function(){};
    if (this.destroyed) {
        throw new Error('should not send msg after destroyed');
    }
    if (!this.nsqd) {
        // enqueue
        this.queue.push(arguments);
        if (this.queue.length > MAX_QUEUE_LEN) {
            let e = new Error('Max Queue Length Reached');
            callback && callback(e);
            this.emit('error', e);
            this.emit('close');
            this.destroy();
        }
    } else {
        let self = this;
        this.nsqd.publish(topic, msg, err => {
            if (err) {
                self.emit('msg_error', err);
                if (arguments['retry'] > SEND_RETRY_TIMES) {
                    callback && callback('nsq msg send failed after retry.', msg.slice(0, 100));
                } else {
                    arguments['retry'] = arguments['retry'] + 1 || 1;
                    this.queue.push(arguments);
                }
            } else {
                callback && callback();
            }
        });
    }
};


function connectNSQD (host, port, options) {
    let writer = new nsq.Writer(host, port, options);
    writer.on(nsq.Writer.READY, onREADY.bind(writer, this));
    writer.on(nsq.Writer.ERROR, onERROR.bind(writer, this));
    writer.on(nsq.Writer.CLOSED, onCLOSED.bind(writer, this));
    writer.connect();
    return writer;
}


function flushQueue () {
    // send queued message and clear
    for (var t of this.queue.splice(0)) {
        this.send.apply(this, t);
    }
}

function onREADY(self) {
    // set self.nsqd
    self.nsqd = this;
    self.emit('nsqd_connected', this.nsqdHost + this.nsqdPort);
    // self._flushQueue();
    flushQueue.bind(self)();
    // set reconnect timeout
    self._timeout = setTimeout(self.nsqd.close.bind(self.nsqd) , RECONN_INTERVAL * (Math.random() + 1));
    // clear retry counter
    self._connect_retry = 0;
}

function onERROR(self, err) {
    // log
    self.emit('nsqd_error', err);
    // count retry time
    if (++ self._connect_retry > RECON_RETRY_TIMES){
        self.emit('error', err);
        self.emit('close');
        self.destroy();
    }
}

function onCLOSED(self) {
    self.emit('nsqd_closed');
    // unset self.nsqd
    self.nsqd = null;
    // reconnect
    // self._lookup();
    if (!self.destroyed) {
        lookup.bind(self)();
        self.emit('reconnect');
    }
    // cleart time out
    clearTimeout(self._timeout);
}

function lookup () {
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
        self.emit('lookupd_error', err);
        onERROR(self, err);
        retry();
    });


    function parseResult(res) {
        res = JSON.parse(res);
        if (res.status_code !== 200) {
            let err = new Error('NSQ Lookup failed. http response: ' + res.status_code + res.status_txt);
            self.emit('lookupd_error', err);
            retry();
            return;
        }
        let count = res.data.producers.length;
        let producer = res.data.producers[Math.floor(Math.random() * count)]; // get a random nsqd

        if (producer) {
            connectNSQD.bind(self)(producer.broadcast_address, producer.tcp_port, self.options);
        } else {
            if (++ self._connect_retry > RECON_RETRY_TIMES) {
                self.emit('error', new Error('no valid nsqd node'));
                self.emit('close');
                self.destroy();
            } else {
                retry();
            }
        }
    }

    function retry() {
        setTimeout(() => {
            lookup.bind(self)();
        }, RETRY_DELAY);
    }
}



/* ########################################################### */

/* example: */

// /*

 var sender = new NSQSender('127.0.0.1', 4161); // this is all you need

 // establish this error event, you should abandon this sender if it trigger a error event
 sender.on('error', err => {
 console.error(err, err.stack);
 process.exit(1); // if module strict dependent on nsq, you should exit when nsq error.
 });

 // just notify you when it reconnect. default it will auto reconnect every 5 min.
 sender.on('reconnect', () => console.log('reconnecting'));

 // the only method is send. without callback
 sender.send('testTopic3', 'I dont care this message');

 // send with callback
 sender.send('testTopic3', 'Hello nsq', err => {
 if (err) console.error(err);
 else console.log('send finished');
 });

 setTimeout(() => {
 sender.destroy();
 }, 300);

 // */
