'use strict';
var assert = require('assert');
var logger = require('./');
var mq = require('../mq');

describe('test loggingify', function () {

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

  it('info', () => {
    logger.info('this is info');
  });

  it('warn', () => {
    logger.warn('this is warn');
  });

  it('error', () => {
    logger.error('this is error');
  });

  it('debug', () => {
    // this need set the environment variable, E.g. NODE_DEBUG=Mocha
    logger.debug('Mocha')('debug info');
  });

  it('toMQ', function (done) {
    logger.toMQ('test', 'jiajisji', (err, res) => {
      logger.info(`err : ${err} ,  res: ${res}`);
      done()
    });
  })


});