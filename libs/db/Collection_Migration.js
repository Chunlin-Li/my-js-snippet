#!/usr/bin/env node

'use strict';

var MongoClient = require('mongodb').MongoClient;
var dbHost = '[dbHost]';
var dbOpts = 'auto_reconnect=true&poolSize=1';
var dburl = `mongodb://${dbHost}/test?${dbOpts}`;
var src_coll = 'srcCollection';
var dst_coll = 'dstCollection';

MongoClient.connect(dburl).then(db => {
    var sColl = db.collection(src_coll);
    var dColl = db.collection(dst_coll);
    console.log('get collection finished');
    sColl.find({
        date: {'$lt': new Date('2016-01-18T10:00:00Z')}
    }).toArray().then(docs => {
        console.log('to Array finished!');
        docs.forEach(item => {
            dColl.update({
                sspId: item.sspId,
                date: item.date
            }, {
                '$inc': {
                    req: item.req || 0,
                    empty: item.empty || 0,
                    success: item.success || 0,

//       pv: item.pv || 0,
//       click: item.click || 0,
//       verify: item.verify || 0,
//       money: item.money || 0
                }
            }, {
                upsert: true
            }).then(res => {
//    console.log('result : ' + res.result.ok);
            }).catch(errorHandle);
        })
    })
}).catch(errorHandle)



function errorHandle(err){
    console.error('error ', err.stack, err);
}
