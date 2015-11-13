'use strict';

/**
 * 用于eval执行函数
 */
var funcs = {};

/**
 *   code sample :  "function(arg){console.log('hello' + arg); return 0;}"
 */

function run (code) {

    let fun = _compile(code);

    /**
     * 执行目标代码
     */
    [].shift.apply(arguments);
    return fun.apply(null, arguments);
}

function _compile(code) {
    /**
     eval 执行代码的过滤条件, 需保证目标 code 的安全性和正确性
     */
    // 拒绝对原型和全局的直接访问, 拒绝非函数类型, 必须指定返回值,假值为执行失败
    if (/prototype/.test(code)
        || /global/.test(code)
        || !/^\(?function\s*\(/.test(code)
        || !/return/.test(code)) {
        console.warn('eval code Reject!');
        return null;
    }
    // 去掉函数定义的尾部多余分号
    code = code.replace(/;+\)?$/, '');
    // 给函数字符串添加必要的括号
    if (!/^\(.*\)$/.test(code)) {
        code = '(' + code + ')';
    }

    return eval(code);
}

module.exports = run;
