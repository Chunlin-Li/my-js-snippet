'use strict';
var mongo = require('./').mongo;
var mongoInitor = require('./').initor;
var utils = require('util');

mongoInitor.init([
    ['moduleTest', 'mongodb://localhost:27017/moduleTest', ['users', 'article']]
]);

mongoInitor.on('error', function (err) {
    console.error(`err info : ${err}`); done(err);
});

mongoInitor.on('done', function () {
    console.log('init ok');
    let doc = {
        //_id: 'testID',
        name: 'Javascript',
        timestamp: new Date()
    };
    mongo.moduleTest.users.insert(doc)
        .then(res => {
            console.log('res  :' + JSON.stringify(res));
        })
        .catch(onError);


    function onError(err) {
        logger.error('Error Catched: ' + err.stack);
    }


});