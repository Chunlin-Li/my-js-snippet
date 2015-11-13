'use strict';
/**
 * 代码保存在 Mongodb 中, dbName: codes, collection 根据代码不同的执行位置来分
 * 数据模型:
 *  _id : Object 自动生成
 *  src : 函数字符串
 *
 */

var mongo = require('../lib/mongo').mongo;


var setFloorCodes = [];


mongo.codes.setfloor.find({
    state: 0 // 0 : 当前有效的
}, {
    src: 1
}).sort({
    order: 1
}).toArray()
    .then(items => {
        for (let i in items) {
            setFloorCodes.push(items[i].src);
        }
    });


