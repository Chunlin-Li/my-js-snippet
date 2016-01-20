'use strict';
// test online nsq send message
var nsq = require('nsqjs');
var events = require('events');
var stream = require('stream');
var util = require('util');
var http = require('http');

var hosts = ['10.12.1.45', '10.12.1.42', '10.12.1.16'];
var writers = [];
var messageNumber = 100;
var topic = 'console';


hosts.forEach((item, index) => {
    let newWriter = new nsq.Writer(item, '4150');
    writers[index] = newWriter;
    newWriter.on('ready', () => {
        newWriter.count = messageNumber;
        newWriter.id = index;
        console.log('sender start ....');
        send(newWriter);
    });
    newWriter.on('error', err => {
        console.error('nsq Writer Error ', err);
    });
    newWriter.connect();
});


function send(sender) {
    if (sender.count > 0) {
        sender.nextBatchTime = Math.ceil(Math.random() * 60) * 1000;
        let nextRandom = Math.ceil(Math.random() * 20);
        sender.nextNum = nextRandom < sender.count ? nextRandom : sender.count;
        sender.count -= sender.nextNum;
        for (let i = sender.nextNum; i > 0; i-- ) {
            sender.publish(topic, `LogTest-1${sender.id}:${i + sender.count}`, err => {
                if (err) {
                    console.error('Message Send Error ', err);
                }
            });
        }
        console.log(new Date(), ` sender ${sender.id} remain ${sender.count}`);
        setTimeout(() => {
            send(sender);
        }, sender.nextBatchTime);
    } else {
        console.log('sender finished.... ');
    }
}