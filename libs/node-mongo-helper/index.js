'use strict';


var mongodb = require('mongodb');


var connectMongo = function (config, callback) {
    let mongo = {};
    mongodb.MongoClient.connect(config.url).then(res => {
        mongo._db = res;
        for (let dbName of Object.keys(config.dbs)) {
            mongo[dbName] = mongo[dbName] || {};
            let db_i = mongo._db.db(dbName);
            for (let coll of config.dbs[dbName]) {
                mongo[dbName][coll] = db_i.collection(coll, {strict: false});
            }
        }
        callback(null, mongo);
    }).catch(err => callback(err))
};


// module.exports = connectMongo;


var config = {
    url: 'mongodb://127.0.0.1:27017?auto_reconnect=true&poolSize=3',
    dbs: {
        ssp: ['main'],
        dsp: ['main', 'req_info']
    },
    db_options: {},
    collection_options: {}
};

console.log('-------------');
var start = process.hrtime();
connectMongo(config, function (err, result) {
    if (err)
        console.error(err, err.stack);
    console.log('time used ', process.hrtime(start)[1] / 1e6);
    console.dir(result);
});

function customizeRequest(req) {
    'use strict';
    if (req.requester.id == '55ac7e8feeec11ac506c0aea' || req.requester.id == '55c9c4262c6a6a0500daaf20') {
        req.bidRequest.device.androidid = req.bidRequest.user.id
    }
    if (req.requester.id == '5666784d9f01da06000293de') {
        let sizeMap = {
            '1': [{w: 50, h: 50}, {w: 250, h: 250}, {w: 300, h: 300}],
            '1.2': [{w: 300, h: 250}, {w: 600, h: 500}],
            '6.4': [{w: 320, h: 50}, {w: 528, h: 90}, {w: 640, h: 100}]
        };
        let scaleArr = Object.keys(sizeMap);
        for (let i = 0; i < req.bidRequest.imp.length; i++) {
            if (req.bidRequest.imp[i].banner && req.bidRequest.imp[i].banner.w && req.bidRequest.imp[i].banner.h) {
                let scale = req.bidRequest.imp[i].banner.w / req.bidRequest.imp[i].banner.h;
                let matchedScale = scaleArr[0];
                for (let k = 0; k < scaleArr.length; k++) {
                    if (Math.abs(scale - scaleArr[k]) < Math.abs(scale - matchedScale)) {
                        matchedScale = scaleArr[k]
                    }
                }
                for (let h = 0; h < sizeMap[matchedScale].length; h++) {
                    if (sizeMap[matchedScale][h].w > req.bidRequest.imp[i].banner.w || h == sizeMap[matchedScale].length - 1) {
                        req.bidRequest.imp[i].banner.w = sizeMap[matchedScale][h].w;
                        req.bidRequest.imp[i].banner.h = sizeMap[matchedScale][h].h
                    }
                }
            }
        }
    }
}