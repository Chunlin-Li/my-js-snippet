'use strict';

function queryParse(inputQuery) {
    let result = {api: '/_count'}; //  api, queryBody, indices
    let es_queryDSL = {query:{bool:{filter:[]}}};
    result.queryBody = es_queryDSL;

    try {
        // type
        if (inputQuery.type === 'aggregation') {
            result.api = '/_search';
            es_queryDSL.aggs = {};
            es_queryDSL.size = 0;
        } else if (inputQuery.type !== 'count') {
            throw new RangeError(`type ${inputQuery.type} not support!`);
        }

        // time range
        let time = inputQuery['filter_and']['time_range'];
        if (!time || Object.keys(time).length !== 1) {
            throw new RangeError(`should add one and only one time range in query condition`);
        }
        // date formate : 2016-05-03_13:28
        let keyName = Object.keys(time)[0];
        let tz = new Date().getTimezoneOffset();
        let tz_offset = (tz > 0 ? '-' : '+') + ('0' + Math.abs(tz) / 60).slice(-2);
        let range = {range: {}};
        result.indices = getIndesList(time[keyName].start, time[keyName].end);
        range['range'][keyName] = {gte: time[keyName].start + tz_offset, lt: time[keyName].end + tz_offset, format:'yyyy-MM-dd_HH:mmZZ'};
        es_queryDSL.query.bool.filter.push(range);

        // ssp
        let ssp = inputQuery['filter_and']['ssp'];
        if (ssp && ssp.id && ssp.type) {
            es_queryDSL.query.bool.filter.push({term: {ssp: ssp.id}});
            if (ssp.type === 'all') {

            } else if (ssp.type === 'success') {
                es_queryDSL.query.bool.filter.push({prefix: {res: 'success'}});
            } else if (ssp.type === 'empty') {
                es_queryDSL.query.bool.filter.push({term: {res: 'empty'}});
            } else {
                throw new RangeError(`ssp type ${ssp.type} not support!`);
            }
        }

        // dsp
        let dsp = inputQuery['filter_and']['dsp'];
        if (dsp && dsp.id && dsp.type) {
            if (dsp.type === 'req') {
                es_queryDSL.query.bool.filter.push({prefix: {dsp: dsp.id}});
            } else if (dsp.type === 'set') {
                es_queryDSL.query.bool.filter.push({term: {dsp: dsp.id + ' set'}});
            } else if (dsp.type === 'win') {
                es_queryDSL.query.bool.filter.push({term: {res: 'success ' + dsp.id}});
            }
        }

        // size
        let size = inputQuery['filter_and']['size'];
        if (size) {
            if (!/^\d+\*\d+$/.test(size)) {
                throw new RangeError(`size format error: ${size}`);
            }
            es_queryDSL.query.bool.filter.push({term: {size: size}});
        }

        // dev type
        let dev_type = inputQuery['filter_and']['dev_type'];
        if (dev_type) {
            if (!/^(iOS|Android|PC)$/.test(dev_type)) {
                throw new RangeError(`not support dev type: ${dev_type}`);
            }
            es_queryDSL.query.bool.filter.push({terms: {os: devType2os(dev_type)}});
        }

        // aggregation
        let aggs = inputQuery['aggregation'];
        if (aggs) {
            if (aggs.type === 'distribution') {
                if (!/^(ssp|dsp|size|dev_type)$/.test(aggs.field)) {
                    throw new RangeError(`not support aggregation field ${aggs.field} for ${aggs.type}`);
                }
                if (aggs.field === 'dev_type') aggs.field = 'os';
                es_queryDSL.aggs = {task: {terms: {field: aggs.field, size: 0}}};
            } else if (aggs.type === 'sum') {
                if (/^(dspPrice|sspPrice)$/.test(aggs.field)) {
                    es_queryDSL.aggs = {task: {sum: {field: aggs.field}}};
                } else {
                    throw new RangeError(`not support aggregation field ${aggs.field} for ${aggs.type}`);
                }
            } else {
                throw new RangeError(`not support aggregation type: ${aggs.type}`);
            }
        }

        return result;

    } catch (err) {
        // inputQuery formate
        console.error('input query formate error or not support.', err.stack);
        return err.message;
    }
}

function devType2os(dev) {
    if ('iOS' === dev) return ['ios', 'iOS', 'IOS'];
    if ('Android' === dev) return ['Android', 'android'];
    if ('PC' === dev) return ['win', 'mac'];
}


function getIndesList(start, end) {
    let list = [];
    start = start.split('_')[0];
    end = end.split('_')[0];
    list.push(dayPlus(start, -1));
    let next = start;
    while (new Date(next) < new Date(end)) {
        next = dayPlus(next, 1);
        list.push(next);
    }
    return list;
}

var dateFormat_date = date => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
var dayPlus = (str, delta) => dateFormat_date(new Date(new Date(str).getTime() + 1000 * 3600 * 24 * delta));



module.exports = {
    queryParse
};
