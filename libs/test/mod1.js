'use strict';


var count = 0;

setInterval(() => {
    count ++;
}, 1000);



module.exports.val = () => count;

