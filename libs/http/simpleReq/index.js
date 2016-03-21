/**
 * return a http request helper object.
 * @param {string} host
 * @param {number} port
 * @returns {object} helper Object
 */
var createHttpHelper = (host, port) => {
    'use strict';
    let agent = undefined; // set your agent or leave it default.
    let http = require('http');
    let func = (method) => {
        /**
         * @param {string} path
         * @param {string|buffer} data
         * @param {function} callback  (responseBody, statusCode, statusMessage)
         */
        return (path, data, callback, errorHandler) => {
            if (!callback && typeof data === 'function'){
                callback = data;
                data = undefined;
            }
            let buffer = data instanceof Buffer ? data : (data && new Buffer(data));
            let request = http.request({
                host: host,
                port: port,
                path: path,
                method: method,
                agent: agent,
                headers: buffer && {
                    'Content-Length': buffer.length
                }
            }, resp => {
                let body = [];
                resp.on('data', chunk => body.push(chunk));
                resp.on('end', () => {
                    callback && callback(body.length > 1 ? Buffer.concat(body).toString() : (body.length ? body[0].toString() : undefined), resp.statusCode, resp.statusMessage);
                });
            });
            request.on('error', errorHandler || (err => console.log('httpHelperError ', err, err.stack)));
            request.end(buffer);
        }
    };

    return http.METHODS.reduce((obj, method) => {
        obj[method.toLowerCase()] = func(method);
        return obj;
    }, {});
};

// var createHttpHelper=(host,port)=>{'use strict';let agent=undefined;let http=require('http');let func=(method)=>{return(path,data,callback,errorHandler)=>{if(!callback&&typeof data==='function'){callback=data;data=undefined}let buffer=data instanceof Buffer?data:(data&&new Buffer(data));let request=http.request({host:host,port:port,path:path,method:method,agent:agent,headers:buffer&&{'Content-Length':buffer.length}},resp=>{let body=[];resp.on('data',chunk=>body.push(chunk));resp.on('end',()=>{callback&&callback(body.length>1?Buffer.concat(body).toString():(body.length?body[0].toString():undefined),resp.statusCode,resp.statusMessage)})});request.on('error',errorHandler||(err=>console.log('httpHelperError ',err,err.stack)));request.end(buffer)}};return http.METHODS.reduce((obj,method)=>{obj[method.toLowerCase()]=func(method);return obj},{})};

var chh = createHttpHelper('127.0.0.1', 12345);
var data = new Buffer('aaaaaaaaaaaaaaxxxxxxxxxxxxxxddddddddddeeeeeeeee');
chh.post('/_test', data, (resp, code, msg) => {
    console.log('code:', code);
    console.log('msg:', msg);
    console.log('resp:', resp);
}, err => {
    console.log('my error handler:', err.code)
});