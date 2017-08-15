'use strict';


var obj = {seatbid:[{
    bid: [{
        impid: 'qwer'
    }]
},{
    bid: [{
        impid: 'asdf'
    }]
}]};


function objGet(obj, path) {
    path = path.split('.');
    let result;

}

function objExists(obj, path, value) {

}


console.log(objGet(obj, 'seatbid.*.bid.*.impid'));



req.content = {
    'impid01' : {
        impObj : {}, // request imp obj
        seatbids: [{
            bid:{},
            seat:'id'
        }],
        win: {
            bid: {}, // for resonse
            seat: 'id'
        },
        reqInfo: 'xxx, xxx, xxx',
    },
    'impid02' : {
        impObj : {}, // request imp obj
        seatbids: [],
        bid: {}, // dsp response bid obj
        seat: 'bidderId',
        reqInfo: 'xxx, xxx, xxx',
    }
};