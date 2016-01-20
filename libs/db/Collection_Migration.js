#!/usr/bin/env node

'use strict';

var MongoClient = require('mongodb').MongoClient;
var dbHost = 'mongo-adpro-general-1:1301,mongo-adpro-general-2:1301,mongo-adpro-general-3:1301';
var dbOpts = 'auto_reconnect=true&poolSize=1';
var dburl = `mongodb://${dbHost}/ssp?${dbOpts}`;
var src_coll = 'reqInfo';
var dst_coll = 'req_info';

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
