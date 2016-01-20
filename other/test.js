'use strict';

var obj = {
    fun: () => {
        console.log('arguments :  ' + JSON.stringify(arguments));
    }
};

obj.fun(123, 'haha');