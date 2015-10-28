'use strict';
var assert = require('assert');

describe('Message Queue Sender -- for nsq', function () {

  let mqSender = require('../mq');
  const topic = 'myTopic';
  const channel = 'test_channel';
  const message = 'MQ: Hello World';
  const HOST = '127.0.0.1';
  const PORT = '4161';
  const EVENT = {
    MESSAGE: 'message',
    DONE: 'done'
  };

  before(function (done) {
    let initor = mqSender.init('NSQ', [
      ['test', HOST, PORT, {}]
    ]);
    initor.on(EVENT.DONE, function () {
      done();
    });

  });

  it('should send message', function (done) {
    mqSender.send('test', topic, message, function (err) {
      return err ? 0 : done();
    });
  });

  it('use stream method send message', function (done) {
    var stream = mqSender.getStream('test', topic);
    stream.write(message, 'utf-8', function (err) {
      return err ? 0 : done();
    });
  });

  it('the reader should receive message', function (done) {
    let nsqReader = new (require('nsqjs').Reader)(topic, channel, {
      lookupdHTTPAddresses: [HOST, PORT].join(':')
    });
    let count = 0;
    nsqReader.on(EVENT.MESSAGE, function (msg) {
      assert.equal(msg.body.toString(), message, 'message content not expect');
      msg.finish();
      count ++;
      if (count == 1)
        done();
    });
    nsqReader.connect();
  });

});


describe('Message Queue Sender -- for nsq', function () {

  let mqSender = require('../mq');
  const topic = 'myTopic';
  const channel = 'test_channel';
  const message = 'MQ: Hello World';
  const EVENT = {
    MESSAGE: 'message',
    DONE: 'done',
    ERROR: 'error'
  };

  it('should connect error', function (done) {
    let initor = mqSender.init('NSQ', [
      ['test', '127.0.0.1', '4155', {}]
    ]);

    initor.on(EVENT.DONE, function () {
      done('Fail, No Throw');
    });

    initor.on(EVENT.ERROR, err => {
      console.log('initor on error : ', err);
      done();
    })
  });

  it('should send error', function (done) {
    mqSender.send('test', 'adpro', message);
    mqSender.send('test', 'adpro', message);
    mqSender.send('test', 'adpro', message);
    done();

  });

});