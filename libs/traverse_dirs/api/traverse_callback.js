'use strict';

var fs = require('fs');
var path = require('path');

// callback(err, end, res)
// res : filePath,  stats
function Traverser (filePath, callback) {
    this.dirList = [path.resolve(filePath)];
    this.callback = callback || function(){};
    this._current = null;
    this.nextFile();
}

Traverser.prototype.nextFile = function nextFile () {
    try {
        this._current = this.dirList.shift();
        if (!this._current) {
            this.callback(null, true);
        } else {
            fs.lstat(this._current, this.fileCounter.bind(this));
        }
    } catch (err) {
        err.stack = 'try catch exception in nextFile function\nCaused by:\n' + err.stack;
        this.callback(err);
    }
};

Traverser.prototype.fileCounter = function fileCounter (err, stats) {
    try {
        if (err) {
            err.stack = 'from caller of fileCounter function\nCaused by:\n' + err.stack;
            this.callback(err);
        } else {
            this.callback(null, false, stats);
            if (stats.isDirectory()) {
                fs.readdir(this._current, this.listSubDir.bind(this));
            } else {
                this.nextFile();
            }
        }
    } catch (err) {
        err.stack = 'try catch exception in fileCounter function\nCaused by:\n' + err.stack;
        this.callback(err);
    }
};

Traverser.prototype.listSubDir = function listSubDir (err, files) {
    try {
        if (err) {
            err.stack = 'from caller of listSubDir function\nCaused by:\n' + err.stack;
            this.callback(err);
        } else {
            this.dirList = this.dirList.concat(files.map((function(t){ return path.resolve(this._current, t)}).bind(this)));
            // console.log(this.dirList);
            this.nextFile();
        }
    } catch (err) {
        err.stack = 'try catch exception in listSubDir function\nCaused by:\n' + err.stack;
        this.callback(err);
    }
};


var count = 0;
new Traverser('/home/chunlin/Dropbox/.webstorm/my-js-snippet/',
    function (err, end, res) {
        if (err) {
            console.log(err.stack);
            return;
        }
        if (!end) {
            count ++;
        } else {
            console.log('finished.', count);
        }
});
