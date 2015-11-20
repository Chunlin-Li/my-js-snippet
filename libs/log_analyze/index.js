'use strict';

var fs = require('fs');

var filePath = './test-view.2015-11-18_05.log';

var readStream = fs.createReadStream(filePath, {flags: 'r', mode: 438, autoClose: true});