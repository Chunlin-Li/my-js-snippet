'use strict';

const MS_PER_DAY = 24 * 3600 * 1000;

/**
 * js date 对象转为 yyyy-MM-dd 格式
 */
var dateFormat_date = date => `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;

/**
 *
 */
var dayPlus = (str, delta) => dateFormat_date(new Date(new Date(str).getTime() + 1000 * 3600 * 24 * delta));


/**
 * 后天中午的 UNIXTIME (ms) +8时区. (0时区把52改成60即可, 60=24*2+12)
 */
var foo = () => (((new Date().getTime() / MS_PER_DAY >> 0) * 24) + 52) * 3600000;