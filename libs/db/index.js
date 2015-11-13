'use strict';
var MongoClient = require('mongodb').MongoClient;
var EventEmitter = require('events');

var configs;
var total_coll;

var mongo = {};

var initor = new EventEmitter();

initor.connNum = 0;

initor.on('_connect_coll', () => {
    if (++initor.connNum === total_coll) {
        initor.emit('done');
    }
});

initor.init = function (conf) {
    configs = conf || [];

    // count collection in configs.
    let sum = 0;
    for (let i = 0; i < configs.length; i++ ) {
        sum += configs[i][2].length;
    }
    total_coll = sum;

    // init db
    configs.forEach(config => {
        MongoClient.connect(config[1])
            .then(db => {
                // init collection
                mongo[config[0]] = {};
                config[2].forEach(collName => {
                    initor.emit('_connect_coll');
                    mongo[config[0]][collName] = db.collection(collName);
                });
            })
            .catch(err => initor.emit('error', err));
    });
};


module.exports = {
    mongo,
    initor
};