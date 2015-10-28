'use strict';
var assert = require('assert');
var logger = require('../logger')('console');
var db = require('./mongo');
var co = require('co');
var utils = require('util');

describe.skip('test mongo', function () {

  before(function (done) {
    db.on('done', function () { done(); });
    db.on('error', function (err) { console.error('err info : ${err}'); done(err); });
  });


  it('insert', function (done) {
    co(function* () {

      let doc = {
        _id: 'testID',
        name: 'Javascript',
        timestamp: new Date()
      };
      var result = yield db('db01').users.insert(doc);
      assert.equal(result.result.ok, 1);
      done();

    }).catch(onError.bind(null, done));
  });

  it('query', function (done) {
    co(function* () {

      var result = yield db('db01').users.find({_id:'testID'}).toArray();
      result.forEach(function (item) {
        assert.equal(item.name, 'Javascript');
      });
      done();

    }).catch(onError.bind(null, done));
  });

  it('update', function (done) {
    co(function* () {

      var result = yield db('db01').users.update({_id:'testID'}, {'$set': {timestamp: new Date(1445593568726)}});
      assert.equal(result.result.ok, 1);

      var doc = yield db('db01').users.find({_id:'testID'}).limit(1).next();
      assert.equal(doc.timestamp.getTime(), 1445593568726);

      done();

    }).catch(onError.bind(null, done));
  });

  it('delete', function (done) {
    co(function* () {

      var result = yield db('db01').users.remove({_id:'testID'});
      assert.equal(result.result.ok, 1);

      var count = yield db('db01').users.count({_id:'testID'});
      assert.equal(count, 0);
      done();

    }).catch(onError.bind(null, done));
  });

  it('error no dbName configed', function (done) {
    co(function* () {
      assert.throws(function () {
        db.on('error', function (err) {
          console.log('test error , ' + err);
        });
        var dB = db('ssp');
      });
      done();
    }).catch(onError.bind(null, done));
  });



  function onError(done, err) {
    logger.error('Error Catched: ' + err.stack);
    done(err);
  }

});

describe('Connection Error', function () {
  it('error on Mongo connection error', function (done) {
    co(function* () {
      db.on('done', function () { done(err); });
      db.on('error', function (err) {
        console.error('err info : ${err}'); done();
      });
    });
  });
});
