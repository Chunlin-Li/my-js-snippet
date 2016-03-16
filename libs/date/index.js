'use strict';

/**
 * js date 对象转为 yyyy-MM-dd 格式
 */
var dateFormat_date = date => `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;

/**
 *
 */
var dayPlus = (str, delta) => dateFormat_date(new Date(new Date(str).getTime() + 1000 * 3600 * 24 * delta));