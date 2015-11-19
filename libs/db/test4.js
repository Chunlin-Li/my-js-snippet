'use strict';
var MongoClient = require('mongodb').MongoClient;


var url = 'mongodb://127.0.0.1:27017,127.0.0.1:27027,127.0.0.1:27037/test?auto_reconnect=true&poolSize=3&readPreference=secondaryPreferred';
var count = 0;

MongoClient.connect(url, (err, db) => {
  console.log('db : '+ db);
  db.on('reconnect', arg => {
    console.warn('db reconnect event : ' + arg);
  });
  db.on('error', err => {
    console.error('db error event : ' + err.stack, err);
  });
  db.on('close', arg => {
    console.error('db close event : ', arg);
  });
  db.on('timeout', arg => {
    console.error('db timeout event : ', arg);
  });

  var coll = db.collection('user');

  setInterval(() => {
    var id = count++;
    coll.insertOne({userID: id}, (err, res) => {
      if (err) {
        console.error('exe error! ' + err.stack, err);
      } else if (res.result.ok){
        console.info('exe success! ' + id);
      }
    })
  }, 50);


});


