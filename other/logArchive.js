'use strict';
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var curHDDN = parseInt(process.argv[2]);

var fileList = process.argv.slice(3);
console.log((new Date()).toISOString(), 'total length ', fileList.length);
var i = 0;

/*
 * 先移动到备份盘, 再原地压缩.
 */

function doArchive() {
    let fpath = fileList[i++];
    if (!fpath) {
        return;
    }
    let basename = path.basename(fpath);
    let fpath2 = fpath.replace(/hdd1/, 'hdd2');
    let topath = `/hdd${curHDDN}/${basename.split('.')[0]}/${basename.split('.')[1].substr(0, 7)}`;
    execSync(`mkdir -p ${topath}`);

    exec(`mv -f ${fpath} ${topath}/`, (err, res) => {
        if (err) {
            console.error((new Date()).toISOString(), ' mv file error: ', err);
            return;
        }
        console.log((new Date()).toISOString(), ' move finish : ' + fpath);
        exec(`gzip -9 ${topath}/${basename}`, (err, res) => {
            if (err) {
                console.error((new Date()).toISOString(), ' gzip error: ', err);
                return;
            }
            console.log((new Date()).toISOString(), ` gzip finish : ${topath}/${basename}`);
            doArchive();
            exec(`rm -f ${fpath2}`, (err, res) => {
                if (err) {
                    console.error((new Date()).toISOString(), 'rm error: ', err);
                    return;
                }
                console.log((new Date()).toISOString(), `${fpath2} remove finished!`);
            });
        });
    });
}


doArchive();
doArchive();