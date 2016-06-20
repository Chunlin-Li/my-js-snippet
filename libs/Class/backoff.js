'use strict';

let table = {};
/*
 status :  0 - 关闭请求, 1 - 打开请求,
 pauseLevel : 暂停的延迟级别
 timeoutId : timeout id.
 */
const max_pause_level = 256; // 指数递增
const interval = 50;  //ms   pauseLevel * interval 是每次实际中断请求的时间.


// return false: 停止请求,  return true: 正常请求;
// isTimeout :
function backoff_ctrl (bidderId, isTimeout) {
    return isTimeout === undefined ? check(bidderId) : feedback(bidderId, isTimeout);
}


function feedback (bidderId, isTimeout) {
    if (isTimeout) {
        table[bidderId]['status'] = 0;
        table[bidderId]['pauseLevel'] = table[bidderId]['pauseLevel'] < max_pause_level ? (table[bidderId]['pauseLevel'] * 2 || 1) : max_pause_level;
        if (table[bidderId]['timeoutId'])
            clearTimeout(table[bidderId]['timeoutId']);

        table[bidderId]['timeoutId'] = setTimeout(clear.bind(null, bidderId), table[bidderId]['pauseLevel'] * interval);
    } else {
        table[bidderId]['status'] = 1;
        table[bidderId]['pauseLevel'] = 0;
    }
}

function check (bidderId) { //  true 1 打开请求  false 0 关闭请求
    try {
        return table[bidderId]['status'] === 1;
    } catch (err) {
        if (err instanceof TypeError) { // 用异常捕获进行初始化
            table[bidderId] = {
                status: 1,
                pauseLevel: 0,
                timeoutId: null
            };
        }
        return true;
    }
}

function clear(id) {
    table[id]['status'] = 1;
    if (table[id]['timeoutId']) {
        clearTimeout(table[id]['timeoutId']);
        table[id]['timeoutId'] = null;
    }
    // console.log('cleared');
}

/* test
**********************
*/

let count = {
    req: 0,
    canceled: 0,
    timeout: 0,
    reqTimeout: 0
};
let p = 0.05; // 0.05   0.25   0.65    0.9
let f = 800;     // 70 - > 5000     70   200  800  2500  5000
let t;
function test () {
    let _t = Math.random();
    if (_t < p) {
        count.timeout ++;
    }
    count.req ++;
    if (count.req === 1000) {
        console.log('########## result:', JSON.stringify(count));
        process.exit(0);
    }
    if (!backoff_ctrl('test')) {
        count.canceled ++;
        console.log('-------pause', _t < p, table['test']['pauseLevel']);
    } else {
        setTimeout(() => {
            console.log('send', _t < p);
            if (_t < p) {
                count.reqTimeout ++;
            }
            backoff_ctrl('test', _t < p);
        }, 100 + 200 * _t);
    }
    t = (Math.random() * f) >>> 0;
    setTimeout(test, t);
}
test();

process.on('SIGINT', function () {
    console.log('########## result:', JSON.stringify(count));
    process.exit(0);
});

/*
*/
