'use strict';

var http = require('http');
var util = require('util');
var agent = new http.Agent({keepAlive: true});

var obj = {"timestamp":"2016-02-25T18:01:59.973Z","hostname":"b7aaf0d3c5ea","content":{"reqInfo":"start_req /bidrequest application/x-protobuf v2_6,start_time 2016-02-25T18:01:59.920Z,_reqId 780adc8e4561446291486b888fb8279f,_requester 564c5bafbff38506004082a8,_imp_size 320*50,set_bid_floor 100,_dsp_resp 55811c4bd473f20c000aba60#55811c4bd473f20c000aba60 empty_response,_dsp_resp 5666447380963b060049c000#566691b9736dd40600e656db empty_response,_dsp_resp 55d54b2ceab013050048eee2#55d54b2ceab013050048eee2 empty_response,_ssp_resp empty,process_time 52.768686ms","sspRequest":{"id":"780adc8e4561446291486b888fb8279f","imp":[{"id":"1","banner":{"id":"5805","w":320,"h":50,"wmax":null,"hmax":null,"wmin":null,"hmin":null,"btype":[],"wtype":["IMAGE"],"pos":null,"keywords":[],"bwords":[]},"bidfloor":100}],"site":null,"app":{"id":"396905","name":null,"bundle":"com.appbyme.app138786","domain":null,"storeurl":null,"cat":null,"sectioncat":null,"pagecat":null,"ver":null,"paid":0,"publisher":{"id":"564c5bafbff38506004082a8","name":null,"cat":[],"domain":"com.appbyme","type":null,"slot":null},"keywords":[]},"user":null,"device":{"ua":"Mozilla/5.0 (Linux; Android 5.0.2; ALE-UL00 Build/HuaweiALE-UL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36 Appbyme","geo":null,"ip":"182.139.211.239","devicetype":"MOBILE","make":null,"model":"unknow","hwv":null,"os":"android","osv":"4.4.4","w":720,"h":1184,"js":0,"language":null,"connectiontype":"WIFI","imei":"866657028529162","mac":"04:02:1f:c6:62:0e","idfa":null},"test":0,"tmax":300,"at":1,"wseat":[],"scenario":{"type":"APP","info":null}}}};

var server = http.createServer(function(req, res){
    req.on('data', (data) => {
        console.log('server request data:', data.toString());
    });
    req.on('end', () => {
        console.log('server request end.');
        res.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': 100});
        res.end(JSON.stringify(obj));
    });
});
server.on('checkContinue', () => {console.log('checkContinue', JSON.stringify(arguments))});
server.on('clientError', (err) => {console.error('server clientError:', err.stack, err)});
server.on('error', (err) => {console.error('server error:', err, err.stack)});

server.listen(1234, '127.0.0.1', (socket, arg2) => {
    setTimeout(() => {
        var client = http.request({
            host: '127.0.0.1',
            port: 1234,
            path: '/test.html',
            method: 'GET',
            headers: {
                'Content-Length': JSON.stringify(obj).length
            },
            agent: agent
        }, function (res) {
            res.on('data', (data) => {
                console.log('client response data:', data.toString());
            });
            res.on('end', () => {
                console.log('client response end.');
            });
            res.on('error', (err) => {
                console.error('client response error.', err, err.stack);
            })
        });
        client.on('error', (err) => {
            console.error('client error:', err, err.stack)
        });
        var str = JSON.stringify(obj);
        client.write(str.substr(0, 200));
        //console.log(util.inspect(client));
        //client.agent.sockets['127.0.0.1:1234:'][0];
        client.end(str.substring(200));
    }, 400);
});
