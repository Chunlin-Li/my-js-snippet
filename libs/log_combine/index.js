'use strict';

var fs = require('fs');
var moment = require('moment');

var defaultOption={separator:'\n',chunkSize:1024*1024*16,ignoreEmpty:true};function readline(filePath){let option=typeof arguments[1]!=='object'?defaultOption:Object.assign({},defaultOption,arguments[1]);let line_cb,end_cb;for(let i=0;i<arguments.length;i++){if(typeof arguments[i]==='function'){line_cb=arguments[i];end_cb=arguments[i+1];break}}if(typeof line_cb!=='function'){line_cb(Error('Callback arguments not correct! useage: readline(filepath, [option], line_cb, [end_cb])'));return}if(!fs.existsSync(filePath)){line_cb(Error('file not exist: '+filePath));return}let stream=fs.createReadStream(filePath,{flags:'r',mode:438,autoClose:true,highWaterMark:option.chunkSize});let lines=[''];stream.on('data',chunk=>{let readOut=chunk.toString().split(option.separator);lines[0]+=readOut[0];lines=lines.concat(readOut.splice(1));while(lines.length>1){if(option.ignoreEmpty&&lines[0].trim().length===0){lines.splice(0,1)}else{line_cb(null,lines.splice(0,1)[0])}}});stream.on('end',()=>{line_cb(null,lines[0]);end_cb&&end_cb()});stream.on('error',err=>line_cb(err))}


var time_point = moment().subtract(1, 'hour');
var dateStr = time_point.format('YYYY-MM-DD'); // 2015-11-30
var dateTimeStr = `${dateStr}_${('0' + time_point.hour()).substr(-2)}`;


// view click 比 request 和 response 晚, 通过对较早的 req 和 resp 缓冲, 来匹配 view 与 click
var requestBuffer = '/tmp/logcombinerequestbuffer.tmp';
var responseBuffer = '/tmp/logcombineresponsebuffer.tmp';

var filenames = ['sspRequest', 'sspResponse', 'view', 'click'];
var logPathPrefix = '.';
filenames = files.reduce((ary, item) => {
    ary.push('test-' + item);
    ary.push('production-' + item);
    return ary;
}, []).map(item => `${logPathPrefix}/${item}.${dateTimeStr}.log`);


readline(filenames, (err, line) => {

});
