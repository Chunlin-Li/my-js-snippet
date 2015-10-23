'use strict';

var mongoskin = require('mongoskin');
console.log('A');
var db = mongoskin.db('mongodb://localhost:27017/moduleTest');
console.log('B : db :' + db);
db.bind('users');
console.log('C');
db.users.find().toArray(function (err, data) {
  console.log('data: '+data);
});
console.log('end');