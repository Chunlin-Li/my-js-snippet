'use strict';



// module.exports = function() {
//
// };

const child_process = require('child_process');

child_process.fork('./worker.js');

let id = null;

setInterval(() => {
    if (id === null) {
        id = Math.random();
    }
    console.log('id : ', id, ' is running....');
}, 1000);


process.on('SIGINT', function() {
    console.log('SIGINT triggered!');
    setTimeout(() => {
        console.log('finished cleanup work!');
        process.exit(0);
    }, 10000);
});