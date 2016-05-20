'use strict';

let http = require('http');
let requester = require('./httpHelper').createHttpHelper('127.0.0.1', 9200);
let queryParse = require('./queryParse').queryParse;
let resultParse = require('./resultParse');


let server = http.createServer(function(req, res) {
    req.body = [];
    req.on('data', data => req.body.push(data));
    req.on('end', () => {
        req.body = Buffer.concat(req.body).toString();
        fn(req, res);
    });

});
server.on('error', errorHandle);
server.listen(4991);

function fn(req, res) {
    let input, queryObj;
    try {
        input = JSON.parse(req.body);
        queryObj = queryParse(input);
    } catch (err) {
        console.error(err, err.stack);
        res.end(failedReturn(err.message));
        return;
    }

    requester.post(`/${queryObj.indices.join(',')}/${queryObj.api}`, JSON.stringify(queryObj.queryBody), (body, code, msg) => {
        res.response = null;
        if (code === 200) {
            console.log(body);
            try {
                res.end(JSON.stringify(resultParse(input, body)));
            } catch (err) {
                console.error(err, err.stack);
                res.end(JSON.stringify(failedReturn(err.message)));
                return;
            }
        } else {
            // res.response = {status:'Error', res: [
            //     ['状态', '错误码', '错误信息'],
            //     ['Error', code, msg]
            // ]}
            console.error('code: ' + code , msg, body);
            res.end(JSON.stringify(failedReturn(msg)));
            return;
        }
    }, errorHandle.bind(null, res));
}


function errorHandle(res, err) {
    console.error('error', err.stack);
    if (res) {
        res.end(err.message);
    }
}

function failedReturn(msg) {
    return {
        status: 'Error',
        res: [
            ['状态', '信息'],
            ['查询失败', msg]
        ]
    }
}
