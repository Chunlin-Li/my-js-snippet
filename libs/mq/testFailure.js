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
      let t = '' + Date.now();
    mqSender.send('test', 'test', t, (err) => {
      if (err) {
        console.log(`--- err : ${err}`);
      } else {
          console.log(t);
      }
    })
  }, 30);
});


initor.on(EVENT.ERROR, err => {
  console.error(err);
});