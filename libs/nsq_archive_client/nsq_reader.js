'use strict';

const nsq = require('nsqjs');
const events = require('events');

function NSQReader (host, port, channel, topic) {
    if (!this instanceof NSQReader) {
        return new NSQReader(host, port, channel, topic);
    }
    events.EventEmitter.call(this);

    this.hostAddr = host + ':' + port;
    this.channel = channel;
    this.topic = topic;
    this._reader = establish(this.hostAddr, this.channel, this.topic, this);

}
require('util').inherits(NSQReader, events.EventEmitter);

function establish(nsqlookupd, channel, topic, wrapper) {
    let reader = new (nsq.Reader)(topic, channel, {
        lookupdHTTPAddresses: nsqlookupd,
        maxInFlight: 200
    });
    reader.wrapper = wrapper;
    reader.on(nsq.Reader.MESSAGE, onMessage);
    reader.on(nsq.Reader.ERROR, onError);
    reader.on(nsq.Reader.NSQD_CONNECTED, onConnect);
    reader.on(nsq.Reader.NSQD_CLOSED, onClose);
    reader.connect();
    return reader;
}

function onClose(){
    console.info(`NSQReader closed. [${this.topic}]`);
    this.wrapper._reader = establish(this.wrapper.hostAddr, this.channel, this.topic, this.wrapper);
}

function onConnect() {
    console.info(`NSQReader connect. [${this.topic}]`);
}

function onError() {
    console.error(this.topic, ' NSQReader error ', err);
}

function onMessage(msg) {
    msg.finish();
    try {
        this.wrapper.emit('message', this.channel, this.topic, msg);
    } catch (err) {
        console.error('NSQReader message process error: ' + err.stack, err);
    }
}

NSQReader.prototype.pause = function () {
    if (!this._reader.isPaused())
        this._reader.pause();
    console.log('NSQReader paused!', this.topic);
};

NSQReader.prototype.unpause = function () {
    if (this._reader.isPaused())
        this._reader.unpause();
    console.log('NSQReader resumed!', this.topic);
};


module.exports = NSQReader;
