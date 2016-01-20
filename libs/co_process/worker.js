'use strict';



console.log('processor start....');


process.on('message', (msg, obj) => {
    obj.buf.fill('z');
    process.send(msg + '_OK');
});


console.log('processor finished....');