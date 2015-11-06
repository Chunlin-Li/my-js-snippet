'use strict';

var nsq = require('nsqjs');
var http = require('http');
var path = require('path');
var fs = require('fs');

var hostAddr = process.argv[2];     // IP:port
var channel = process.argv[3];      //
var output = process.argv[4];       // absolute path
var buffers = {};
//const BUFFERSIZE = 67108864; // 64MB
const BUFFERSIZE = 256; // 64MB
const CHECKINTERVAL = 5000; // 5s
var streams = {};
var readers = {};


if (!hostAddr || !channel || !output) {
    console.log('loss arguments, not running');
    process.exit(0);
}

// cb(err, topics)   topics : Array ['aaa', 'bbb']
function queryTopics (cb) {
    let data = '';
    http.get(`http://${hostAddr}/topics`, res => {
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            res.body = data.toString();
            res.body = JSON.parse(res.body);
            if (res.body.status_code !== 200) {
                console.error('MQ Init Error. nsq lookup nodes failed: %s', res.status_txt);
                return;
            }
            let topics = res.body.data.topics;
            cb(null, topics);
        });
    }).on('error', err => cb(err));
}


function doprocess(topic, buf) {
    let len = buf.length;
    buffers[topic] = buffers[topic] || [];
    if (!buffers[topic][0]) { // first buffer
        buffers[topic][0] = new Buffer(BUFFERSIZE);
        buffers[topic][0]._cstart = 0;
    } else if (buffers[topic][0]._cstart + len + 1 >= BUFFERSIZE) {
        // buffer full
        buffers[topic].unshift(new Buffer(BUFFERSIZE));
        buffers[topic][0]._cstart = 0;
    }
    let buffer = buffers[topic][0];
    buf.copy(buffer, buffer._cstart);
    buffer._cstart += len;
    buffer.write('\n', buffer._cstart);
    buffer._cstart += 1;
    buffer._dirty |= 1; // set dirty
}


function checkWrite () {
    for (let topic in buffers) {
        // not full fill buffer
        if (!buffers[topic] || buffers[topic].length < 1) {
            continue; // no buffer
        } else if (!buffers[topic][0]._dirty && buffers[topic].length < 2 ) {
            continue; // only has one clear buffer.
        }
        var fullPath = getWritePath(topic);
        if (!streams[topic]) { // first open
            streams[topic] = fs.createWriteStream(fullPath, {flags: 'a+', mode: 438});
        } else if (streams[topic].path !== fullPath) { // need rotate
            fs.close(streams[topic].fd, err => {
                if (err) console.error('close file error: ', err);
            });
            streams[topic] = fs.createWriteStream(fullPath, {flags: 'a+', mode: 438});
        }
        let bufs;
        if (buffers[topic][0]._dirty) {
            bufs = buffers[topic].splice(0, buffers[topic].length); // buffer 0...N
        } else {
            bufs = buffers[topic].splice(1, buffers[topic].length); // buffer 1...N
        }
        while (bufs.length > 0) {
            let b = bufs.pop();
            b = b.slice(0, b._cstart);
            streams[topic].write(b, 'utf-8', err => {
                if (err) console.error('write to file error: ', err);
            });
        }
    }
}


function getWritePath (topic) {
    // filename format
    let date = new Date();
    let dateStr = [date.getFullYear(), date.getMonth(), date.getDate()].join('-') + '_' + date.getHours();
    return path.normalize(`${output}/${topic}.${dateStr}.log`);
}


function flushToFile() {
    clearInterval(interval);
    checkWrite();
    setTimeout(() => {
        for (let topic in streams) {
            fs.close(streams[topic].fd);
            readers[topic].close();
        }
        console.log('shutdown successfully');
    }, 2000);
}

process.on('SIGINT', flushToFile);
process.on('SIGTERM', flushToFile);


queryTopics((err, topics) =>{
    if (err) {
        console.error('query topics error. ');
        process.exit(0);
    }
    topics.forEach((topic, index) => {
        let nsqReader = new (nsq.Reader)(topic, channel, {
            lookupdHTTPAddresses: hostAddr,
            maxInFlight: 200
        });
        readers[topic] = nsqReader;
        nsqReader.on(nsq.Reader.MESSAGE, function (msg) {
            doprocess(topic, msg.body);
            msg.finish();
        });
        nsqReader.on(nsq.Reader.ERROR, function (err) {
            console.error('reader error ', err);
        });
        nsqReader.connect();
    });
    console.log('start');
});
var interval = setInterval(checkWrite, CHECKINTERVAL);













function writeDisk_ (topic, buf) {
    var fullPath = getWritePath(topic);
    streams[topic] = streams[topic] || [];
    if (streams[topic][0]) {
        if (streams[topic][0].path !== fullPath) {
            // rotate
            streams[topic].unshift(fs.createWriteStream(fullPath, {flags: 'a+', mode: 438}));
            fs.close(streams[topic][1].fd, err => {
                if (err) console.error('close file error: ', err);
                streams[topic].splice(1, 1);
            });
        }
        //streams[topic][0].write(buf, 'utf-8', err => console.error('write to file error: ', err));
    } else {
        // first open
        streams[topic][0] = fs.createWriteStream(fullPath, {flags: 'a+', mode: 438});
    }
    streams[topic][0].write(buf, 'utf-8', err => {
        if (err) console.error('write to file error: ', err);
    });
}

function doprocess_(topic, buf) {
    if (!buffers[topic]) {
        buffers[topic] = new Buffer(BUFFERSIZE);
        buffers[topic]._cstart = 0;
    }
    let buffer = buffers[topic];
    let len = buf.length;
    if (buffer._cstart + len + 1 >= BUFFERSIZE) {
        writeDisk(topic, buffer.slice(0, buffer._cstart));
        buffer = buffers[topic] = new Buffer(BUFFERSIZE);
        buffer._cstart = 0;
    }
    buf.copy(buffer, buffer._cstart);
    buffer._cstart += len;
    buffer.write('\n', buffer._cstart);
    buffer._cstart += 1;
}
