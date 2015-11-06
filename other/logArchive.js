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
 * 从 hdd2 压缩归档到对应磁盘. 归档文件备份一份.
 * 删除 hdd1 hdd2 的源文件
 */

function doArchive(cb) {
    let fpath = fileList[i++];
    if (!fpath) {
        return;
    }
    let basename = path.basename(fpath);
    let fpath2 = fpath.replace(/hdd2/, 'hdd1');
    let topath = `/hdd${curHDDN}/${basename.split('.')[0]}/${basename.split('.')[2].substr(0, 7)}`;
    execSync(`mkdir -p ${topath}`);

    exec(`gzip -9 < ${fpath} > ${topath}/${basename}.gz`, (err, res) => {
        if (err) {
            console.error((new Date()).toISOString(), 'gzip error: ', err);
            return;
        }
        console.log((new Date()).toISOString(), 'gzip finish : ' + fpath);
        exec(`rm -f ${fpath} ${fpath2}`, (err, res) => {
            if (err) {
                console.error((new Date()).toISOString(), 'rm error: ', err);
                return;
            }
            console.log((new Date()).toISOString(), `${fpath} and ${fpath2} remove finished!`);
        });
    });
}


doArchive();
doArchive();
doArchive();