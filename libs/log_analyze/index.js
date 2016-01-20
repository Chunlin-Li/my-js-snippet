'use strict';
var fs = require('fs');
var readline = require('../readline');


//var filePath = './test-view.2015-11-18_05.log';

//var basePath = '/hdd1/adx_nsq_output/';
var basePath = './';
//var date = process.argv[2];
var date = '2015-11-18';
var topic = 'test-click';

for (let i = 0; i < 24; i++) {
    let filePath = `${topic}.${date}_${('0' + i).slice(-2)}.log`;
    console.log(filePath);
    let count = 0;
    if (fs.existsSync(filePath)) {

        readline(filePath, (err, line) => {
            console.log(line);
        }, () => {
            console.log('end');
        });
    }
}



function processView() {

}