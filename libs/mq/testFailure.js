'use strict';
var assert = require('assert');
let mqSender = require('../mq');

const topic = 'myTopic';
const channel = 'test_channel';
const message = 'MQ: Hello World';
const HOST = '127.0.0.1';
const PORT = '4161';
const EVENT = {
  MESSAGE: 'message',
  DONE: 'done',
  ERROR: 'error'
};

let initor = mqSender.init('NSQ', [
  ['test', HOST, PORT, {}]
]);
initor.on(EVENT.DONE, function () {
  setInterval(() => {
    mqSender.send('test', 'test', 'heihei', (err, res) => {
      if (err) {
        console.log(`err : ${err};  res: ${res}`);
      } else {
          console.log('start......');
      }
    })
  }, 100);
});

initor.on(EVENT.ERROR, err => {
  console.error(err);
});