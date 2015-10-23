'use strict';
var assert = require('assert');

describe('Message Queue Sender -- for nsq', function () {

  const topic = 'myTopic';
  const channel = 'test_channel';
  const message = 'MQ: Hello World';
  const HOST = '127.0.0.1';
  const PORT = '4150';
  const EVENT = {
    MESSAGE: 'message',
    DONE: 'done'
  };

  before(function (done) {
    let mqSender = require('../mq');
    let initor = mqSender.init('NSQ', [
      ['test', HOST, PORT, {}]
    ]);
    initor.on(EVENT.DONE, function () {
      done();
    });

  });

  it('should send message', function (done) {
    let mqSender = require('../mq');
    mqSender.send('test', topic, message, function (err) {
      return err ? 0 : done();
    });
  });

  it('use stream method send message', function (done) {
    let mqSender = require('../mq');
    var stream = mqSender.getStream('test', topic);
    stream.write(message, 'utf-8', function (err) {
      return err ? 0 : done();
    });
  });

  it('the reader should receive message', function (done) {
    let nsqReader = new (require('nsqjs').Reader)(topic, channel, {
      nsqdTCPAddresses: [HOST, PORT].join(':')
    });
    let count = 0;
    nsqReader.on(EVENT.MESSAGE, function (msg) {
      assert.equal(msg.body.toString(), message, 'message content not expect');
      msg.finish();
      count ++;
      console.log('count ' + count );
      if (count == 1)
        done();
    });
    nsqReader.connect();
  });

});
