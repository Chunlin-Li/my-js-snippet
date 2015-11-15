#!/usr/bin/env node
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

var highWaterMark = 1024 * 1024 * 64;  // 64M stream chunk size

// input para
var flag = process.argv[2]; //  -c compress  -d decompress. required.
var filepath = process.argv[3]; // path. required.

var buffer;
var source;
var dest;
var source_stream;
var dest_stream;
var gzip;
var gunzip;


if (flag === '-d') {
  source = filepath;
  dest = filepath.replace(/\.gz$/, '');
  if (source === dest) {
    console.error('input file not .gz ext');
    process.exit(2);
  }
  source_stream = fs.createReadStream(filepath, {flags: 'r', autoClose: true, mode: 0o666, highWaterMark: highWaterMark});
  dest_stream = fs.createWriteStream(dest, {flags: 'a+', mode: 0o666, highWaterMark: highWaterMark});
} else if (flag === '-c') {
  source = filepath;
  if (/\.gz$/.test(source)) {
    console.error('input file already has .gz ext');
    process.exit(2);
  }
  dest = filepath + '.gz';
  source_stream = fs.createReadStream(filepath, {flags: 'r', autoClose: true, mode: 0o666, highWaterMark: highWaterMark});
  dest_stream = fs.createWriteStream(dest, {flags: 'a+', mode: 0o666, highWaterMark: highWaterMark});
}
source_stream.on('end', function () {
  console.timeEnd('run');
  source_stream.close();
});

console.time('run');
if (flag === '-c') {
  gzip = zlib.createGzip({level: 9, memlevel: 9});
  source_stream.pipe(gzip).pipe(dest_stream);
} else if (flag === '-d') {
  gunzip = zlib.createGunzip();
  source_stream.pipe(gunzip).pipe(dest_stream);
}

dest_stream.on('finish', function(){
  dest_stream.close();
  fs.unlinkSync(filepath); // delete source file
  process.exit(0);
});

