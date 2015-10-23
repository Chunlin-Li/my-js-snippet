//var mongo = require('mongoskin');
//var LRU = require('lru-cache');
//
//var cache = LRU({
//  max: 100,
//  dispose: function(key, data) {
//    flush(data);
//  },
//  maxAge: 1000 * 60 * 2
//});
//
//
//function flush(data) {
//  db[data.name][data.collection].update(data.query, {
//    '$inc': data.inc
//  }, {
//    upsert: true
//  }, function(err) {
//    if (err) console.error('flush stats data error', err);
//  });
//}
//
//
//
//var sspData = mongo.db(global.config.sspURI, {native_parser: true});
//var dspData = mongo.db(global.config.dspURI, {native_parser: true});
//
//sspData.bind('reportStats');
//dspData.bind('reportStats');
//sspData.bind('reqInfo');
//dspData.bind('reqInfo');
//
//var db = {
//  ssp: sspData,
//  dsp: dspData
//};
//
//// 写操作:  insert save update 需要使用 buffer
//
//
//function buffering(dbName, collection, query, type, count, callback) {
//  query.date = new moment().startOf('hour').toDate();
//  var querys = [dbName, collection, query.date.valueOf(), query.sspId, query.slotId, query.dspId].filter(id => id)
//  var key = querys.join('#')
//  var c = cache.get(key);
//  if (!c) {
//    c = {
//      query: query,
//      name: dbName,
//      collection: collection,
//      inc: {}
//    };
//    cache.set(key, c);
//  }
//  c.inc[type] = (c.inc[type] || 0) + count;
//  if (process.env.NODE_ENV === 'development'){
//    // console.log(dbName,collection,query,type,count);
//    cache.reset();
//  }
//  callback && callback();
//
//}
//
//
//
//
//
//
//
//
//function updateClick(dspID, pubID, slotID, callback) {
//
//  buffering('ssp', 'reportStats', {
//    sspId: pubID,
//    slotId: slotID
//  }, 'click', 1, callback);
//  buffering('dsp', 'reportStats', {
//    dspId: dspID
//  }, 'click', 1, callback);
//}
//
//
//
//function updatePV(dspID, pubID, slotID, callback) {
//  buffering('ssp', 'reportStats', {
//    sspId: pubID,
//    slotId: slotID
//  }, 'pv', 1, callback);
//  buffering('dsp', 'reportStats', {
//    dspId: dspID
//  }, 'pv', 1, callback);
//}
//
//function updateReq(db, type, id, slotID, callback) {
//  if (db == 'ssp')
//    buffering(db, 'reqInfo', {
//      sspId: id,
//      slotId: slotID
//    }, type, 1, callback)
//  else
//    buffering(db, 'reqInfo', {
//      dspId: id,
//      slotId: slotID
//    }, type, 1, callback)
//}
//
//function updateMoney(db, id, money, slotID,callback) {
//  if (db == 'ssp')
//    buffering(db, 'reportStats', {
//      sspId: id
//    }, 'money', money, callback)
//  else
//    buffering(db, 'reportStats', {
//      dspId: id,
//      slotId: slotID
//    }, 'money', money, callback)
//}
//
//function updataResponse(id, data, callback) {
//  // 每个小时的数据写入, 不需要过 Cache, 直接入库.
//  if (!id || !data || !data.respTimes || !data.timeStamp) {
//    return;
//  }
//  dspData['reqInfo'].update({
//    dspId: id,
//    date: data.timeStamp
//  }, {
//    '$set': {respTimes: data.respTimes}
//  }, {
//    upsert: true,
//    multi: false
//  }, callback);
//}
//
//
//exports.updateClick = updateClick;
//exports.updatePV = updatePV;
//exports.updateReq = updateReq;
//exports.updateMoney = updateMoney;
//
//exports.updateResponse = updataResponse;