'use strict';

let http = require('http');
http.keepAliveAgent = new http.Agent({keepAlive: true, maxSockets: 200, keepAliveMsecs: 10000});

var createHttpHelper = (host, port)=> {
    let agent = http.keepAliveAgent;
    let func = (method)=> {
        return (path, data, callback, errorHandler)=> {
            if (typeof data === 'function') {
                errorHandler = callback;
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
                headers: buffer && {'Content-Length': buffer.length}
            }, resp=> {
                let body = [];
                resp.on('data', chunk=>body.push(chunk));
                resp.on('end', ()=> {
                    callback && callback(body.length > 1 ? Buffer.concat(body).toString() : (body.length ? body[0].toString() : undefined), resp.statusCode, resp.statusMessage)
                });
            });
            request.on('error', errorHandler || (err=>console.log('httpHelperError ', err, err.stack)));
            request.end(buffer);
        }
    };
    return http.METHODS.reduce((obj, method)=> {
        obj[method.toLowerCase()] = func(method);
        return obj;
    }, {});
};

module.exports = {
    createHttpHelper
};





http.keepAliveAgent = new http.Agent({keepAlive: true, maxSockets: 200, keepAliveMsecs: 10000});

var createHttpHelper = (host, port)=> {
    'use strict';
    let http = require('http');
    let func = (method)=> {
        return (path, data, callback, errorHandler)=> {
            if (typeof data === 'function') {
                errorHandler = callback;
                callback = data;
                data = undefined;
            }
            let buffer = data instanceof Buffer ? data : (data && new Buffer(data));
            let request = http.request({
                host: host,
                port: port,
                path: path,
                method: method,
                headers: buffer && {'Content-Length': buffer.length}
            }, resp=> {
                let body = [];
                resp.on('data', chunk=>body.push(chunk));
                resp.on('end', ()=> {
                    callback && callback(body.length > 1 ? Buffer.concat(body).toString() : (body.length ? body[0].toString() : undefined), resp.statusCode, resp.statusMessage)
                });
            });
            request.on('error', errorHandler || (err=>console.log('httpHelperError ', err, err.stack)));
            request.end(buffer);
        }
    };
    return http.METHODS.reduce((obj, method)=> {
        obj[method.toLowerCase()] = func(method);
        return obj;
    }, {});
};

module.exports = {
    createHttpHelper
};
