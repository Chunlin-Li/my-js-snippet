'use strict';


var mongodb = require('mongodb');
var suspend = require('mon');
var url = 'mongodb://127.0.0.1:27017auto_reconnect=true&poolSize=3';

var db;

mongodb.MongoClient.connect(url).then(res => db = res);

// mongo('dsp')('main')


var mongo = {};

Object.defineProperties(mongo, {

});


