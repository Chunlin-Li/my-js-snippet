'use strict';

var nsq = require('nsqjs');
var event = require('events');
var util = require('util');
var http = require('http');

const RETRY_DELAY = 1000; // ms
const MAX_INFLIGHT = 200;
const LOOKUP_INTERVAL = 60  * 1000; // ms


function NSQReader(host, port, channel, options) {
    if (!host || !port || !channel) {
        throw new Error('need arguments: host, port, channel!');
    }
    event.EventEmitter.call(this);

    let self = this;
    this.host = host;
    this.port = port;
    this.topics = [];
    this.channel = channel;
    this.options = options;
    this.readers = {};
    this.lookupIntervalID = null;
    this.lookupRetry = 0;

    queryTopics.bind(self)(() =>{
        establish.bind(self)(self.topics, () => {
            console.log('start');
        });
    });
}
util.inherits(NSQReader, event.EventEmitter);


// cb(err, topics)   topics : Array ['aaa', 'bbb']
function queryTopics (finish) {
    let data = [], self = this;
    clearInterval(self.lookupIntervalID); // close interval. setup after lookup finished.
    http.get(`http://${self.host}:${self.port}/topics`, res => {
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
            data = Buffer.concat(data).toString();
            parseResult(data);
        });
    }).on('error', err => {
        err.message = 'request lookupd error. Caused by:' + err.message;
        onERROR(err);
        retry();
    });

    function parseResult(res) {
        data = JSON.parse(res);
        console.log('lookup result', res);
        if (data.status_code !== 200) {
            console.log('C', data.status_code + data.status_txt);
            let err = new Error('NSQ Lookup failed. http response: ' + data.status_code + data.status_txt);
            onERROR(err);
            return retry();
        }


        self.topics = data.data.topics;
        finish();

        self.lookupIntervalID = setInterval(() => {
            queryTopics.bind(self)(() => {
                console.log('interval lookup');
                let currTopic = Object.keys(self.readers);
                if ( (self.topics.length === currTopic.length)
                    && (self.topics.filter(item => currTopic.find(e => e === item)).length = self.topics.length) ) {
                    // topic list not change
                    return;
                }
                establish.bind(self)(self.topics);
            });
        }, LOOKUP_INTERVAL);
    }

    function onERROR(err) {
        self.emit('error', err);
    }

    function retry() {
        console.log('lookup retry');
        setTimeout(() => {
            queryTopics.bind(self)(finish);
        }, RETRY_DELAY);
    }
}


function establish(topicList, finish) {
    let self = this;
    topicList.forEach(topic => {
        if (self.readers[topic])
            return;
        let reader = getNewReader(topic, self.channel);
        self.readers[topic] = reader;
        reader.connect();
    });
    finish && finish();

    function getNewReader(topic, channel) {
        let reader = new (nsq.Reader)(topic, self.channel, {
            lookupdHTTPAddresses: self.host + ':' + self.port,
            maxInFlight: MAX_INFLIGHT
        });
        reader.on(nsq.Reader.MESSAGE, onMESSAGE.bind(reader, self));
        reader.on(nsq.Reader.ERROR, onERROR.bind(reader, self));
        reader.on(nsq.Reader.NSQD_CLOSED, onCLOSED.bind(reader, self));
        reader.on(nsq.Reader.NSQD_CONNECTED, onCONNECTED.bind(reader, self));
        return reader;
    }

    function onCONNECTED(self) {
        console.log('onCONNECTED');
    }
    
    function onMESSAGE(self, msg) {
        self.emit('message', this.topic, msg.body);
        msg.finish();
    }

    function onERROR(self, err) {
        console.log('on ERROR', err);
        self.emit('error', err);
    }

    function onCLOSED(self) {
        console.log('debug nsq reader topic for it self', this.topic);
        let reader = getNewReader(this.topic, this.channel);
        reader.connect();
        delete self.readers[this.topic];
    }
}


//========================================

let reader = new NSQReader('127.0.0.1', 4161, 'jsReader');

reader.on('message', (topic, buf) => {
    console.log('Get Message from ' + topic + '  : ' + buf.toString());
});
reader.on('error', err => {
    console.error('=== error ', err);
});






