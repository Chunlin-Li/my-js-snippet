'use strict';

var fs = require('fs');
var path = require('path');

var root = process.argv[2];

// initial state
var dirList = [path.resolve(root)];
var totalSize = 0;
var counter = 0;

nextFile();

function nextFile () {
    try {
        let c = dirList.shift();
        if (!c) {
            console.log('finished! totalSize: ', totalSize, ' file/dir number: ', counter);
            return;
        }
        fileCounter(c, err => {
            if (err) {
                onError('from fileCounter function', err);
            } else {
                nextFile();
            }
        });
    } catch (err) {
        onError('try catch exception in nextFile function', err);
    }
}

function fileCounter (filePath, returnCallback) {
    try {
        fs.lstat(filePath, (err, stats) => {
            if (err) {
                err.stack = 'fileCounter function: from fs.lstat callback\nCaused by:\n' + err.stack;
                returnCallback(err);
            } else {
                counter++;
                totalSize += stats.size;
                if (stats.isDirectory()) {
                    listSubDir(filePath, (err, array) => {
                        if (err) {
                            returnCallback(err);
                        } else {
                            dirList = dirList.concat(array);
                            returnCallback();
                        }
                    });
                } else {
                    returnCallback();
                }
            }
        });
    } catch (err) {
        err.stack = 'try catch exception in fileCounter function\nCaused by:\n' + err.stack;
        returnCallback(err);
    }
}

function listSubDir (dir, returnCallback) {
    try {
        fs.readdir(dir, (err, files) => {
            try {
                if (err) {
                    err.stack = 'listSubDir function: from fs.readdir callback\nCaused by:\n' + err.stack;
                    returnCallback(err);
                } else {
                    returnCallback(null, files.map(t => path.resolve(dir, t)));
                }
            } catch (err) {
                err.stack = 'try catch exception in fs.readdir function callback\nCaused by:\n' + err.stack;
                returnCallback(err);
            }
        });
    } catch (err) {
        err.stack = 'try catch exception in listSubDir function\nCaused by:\n' + err.stack;
        returnCallback(err);
    }
}

function onError(msg, err) {
    console.error('ON ERROR: ', msg, err, err.stack);
}
