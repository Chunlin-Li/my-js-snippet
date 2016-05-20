'use strict';

function parse(inputObj, response) {
    let returnValue = {};
    response = JSON.parse(response);
    if (response._shards.failed) {
        throw new Error('ES shard failed: ' + response._shards.failed);
    }
    if (inputObj.type === 'aggregation') {
        // aggregations
        if (response.timed_out) {
            throw new Error('ES query timeout');
        }
        //queryBody
        returnValue.status = 'OK';
        returnValue.res = [['数据项', '数据值']];

        if (inputObj.aggregation.type === 'sum') {
            returnValue.res.push(['count', response.aggregations.task.value]);
        } else if (inputObj.aggregation.type === 'distribution') {
            let list = response.aggregations.task.buckets;
            for (var i of list) {
                returnValue.res.push([i.key, i.doc_count]);
            }
        }
    } else if (inputObj.type === 'count') {
        // count
        returnValue.status = 'OK';
        returnValue.res = [
            ['数据项', '数据值'],
            ['count', response.count]
        ]
    }

    return returnValue;
}



module.exports = parse;


// var inputObj = {type:'aggregation', aggregation: {type:'distribution'}};
// var queryObj = {"took":200,"timed_out":false,
//     "_shards": {"total":15,"successful":15,"failed":0},
//     "hits":{"total":380,"max_score":0.0,"hits":[]},
//     "aggregations":{
//         "task":{
//             "doc_count_error_upper_bound":0,
//             "sum_other_doc_count":0,
//             "buckets":[
//                 {"key":"iOS","doc_count":380}
//             ]}}};

// var inputObj = {type:'count'};
// var queryObj = {"count":380,"_shards":{"total":15,"successful":15,"failed":0}}
//
// var inputObj = {type:'aggregation', aggregation: {type:'sum'}};
// var queryObj = {"took":11,"timed_out":false,"_shards":{"total":15,"successful":15,"failed":0},
//     "hits":{"total":380,"max_score":0.0,"hits":[]},
//     "aggregations":{"task":{"value":114380.0}}};
//
// var o = parse(inputObj, JSON.stringify(queryObj));
// console.log(JSON.stringify(o));
