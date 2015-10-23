'use strict';
var co = require('co');
var mongo = require('mongodb');
var EventEmitter = require('events');
var util = require('util');
var url = 'mongodb://localhost:27017/moduleTest';

var config = [
  ['db01', 'mongodb://localhost:27017/moduleTest', ['users', 'article']]
];
var _dbs = {};

function getDB(dbAlias) {
  if (!_dbs[dbAlias]) {
    throw new Error('No such db, please check db config');
  }
  return _dbs[dbAlias];
}
getDB._emitter = new EventEmitter();
getDB.on = function (eventName, cb) {
  getDB._emitter.on(eventName, cb);
};
getDB.once = function (eventName, cb) {
  getDB._emitter.once(eventName, cb);
};

co(function* () {
  // connect db
  let tmp = {};
  for (let i = 0; i < config.length; i ++ ) {
    tmp[config[i][0]] = mongo.connect(config[i][1]);
  }
  _dbs = yield tmp;

  // setup collections
  config.forEach(function (item) {
    item[2].forEach(function (collName) {
      _dbs[item[0]][collName] = _dbs[item[0]].collection(collName);
    });
  });

  // finish
  getDB._emitter.emit('done');
}).catch(function (err) {
  let listenerCount = getDB._emitter.listeners('error').length();
  if (listenerCount > 0) {
    getDB._emitter.emit('error', err);
  } else {
    throw err;
  }
});
module.exports = getDB;




