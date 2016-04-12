'use strict';

var fs = require('fs');
var path = require('path');
var Emitter = require('events').EventEmitter;

var root = process.argv[2];
var traverser = new Emitter();

// initial state
var dirList = [path.resolve(root)];
var totalSize = 0;
var counter = 0;


traverser.on('next', nextFile);
traverser.on('count', fileCounter);
traverser.on('sub', listSubDir);
traverser.on('error', onError);

function nextFile () {
    try {
        let c = dirList.shift();
        if (!c) {
            console.log('finished! totalSize: ', totalSize, ' file/dir number: ', counter);
        } else {
            fs.lstat(c, fileCounter.bind(c));
        }
    } catch (err) {
        traverser.emit('error', 'try catch exception in nextFile function', err);
    }
}

function fileCounter (err, stats) {
    try {
        if (err) {
            onError('fileCounter function: from caller', err);
        } else {
            counter++;
            totalSize += stats.size;
            if (stats.isDirectory()) {
                fs.readdir(this, listSubDir.bind(this));
            } else {
                nextFile();
            }
        }
    } catch (err) {
        onError('try catch exception in fileCounter function', err);
    }
}

function listSubDir (err, files) {
    try {
        if (err) {
            onError('listSubDir function: from caller', err);
        } else {
            dirList = dirList.concat(files.map(t => path.resolve(this, t)));
            nextFile();
        }
        // zzzz.xxxx = 3;
    } catch (err) {
        onError('try catch exception in listSubDir function', err);
    }
}

function onError(msg, err) {
    console.error('ON ERROR: ', msg, err);
}




