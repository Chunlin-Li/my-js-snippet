'use strict';
var feval = require('./');

var mongo = require('mongoskin');
var funcDB = mongo.db('mongodb://127.0.0.1:27017/codes?auto_reconnect=true&poolSize=3&readPreference=secondaryPreferred', {
    native_parser: true
});

funcDB.bind('setfloor');
funcDB.bind('customReq');

var setFloorCodes = [];

var req = {
    id: '12345',
    requester: {
        bidfloor: 0,
        settlement: {
            type: 'fixed'
        }
    },
    bidRequest: {
        device: {
            os: 'android'
        }
    }
};

funcDB.setfloor.find({
    state: 0 // 0 : 当前有效的
}, {
    src: 1
}).sort({
    order: 1
}).toArray((err, items) => {
    if (err) {
        return undefined;
    } else {
        for (let i in items) {
            setFloorCodes.push(items[i].src);
        }
    }
    console.log('floor : ', req.requester.bidfloor);

    for (let i = 0; i < setFloorCodes.length; i++) {
        var res = feval(setFloorCodes[i], req);
        if (res) {
            req.requester.bidfloor = res;
            break;
        }
    }
    console.log('floor : ', req.requester.bidfloor);
});

var h = function(req){
    if (req.requester.settlement.type === 'fixed') {
        if (req.bidRequest.device.os === 'android') {
            return 10
        }
    }
}

var t = function(req){
    if (id === '12345'){
        return 29;
    }
}
//var codes = [h.toString()];



//mongodb: [
//    [
//        'dsp',
//        'mongodb://127.0.0.1:27017/dsp?auto_reconnect=true&poolSize=3&readPreference=secondaryPreferred',
//        ['main', 'reportStats', 'reqInfo']
//    ],
//    [
//        'ssp',
//        'mongodb://127.0.0.1:27017/ssp?auto_reconnect=true&poolSize=3&readPreference=secondaryPreferred',
//        ['main', 'slot', 'reportStats', 'reqInfo']
//    ],
//    [
//        'codes',
//        'mongodb://127.0.0.1:27017/codes?auto_reconnect=true&poolSize=3&readPreference=secondaryPreferred',
//        ['setfloor', 'customreq']
//    ]
//]