'use strict';



var RocketChat = require('rocketchat').RocketChatApi;

var rocketChatApi = new RocketChat('https', 'host', '443', 'account', 'password');

// rocketChatApi.version((err, body) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(body)
// });


// rocketChatApi.getPublicRooms(function(err,body){
//     if(err)
//         console.log(err);
//     else
//         console.log(body);
// });

rocketChatApi.sendMsg('sMBdX5ntSWoyyW7iT', 'Event: exchange too many timeout', function(err, body){
    if(err)
        console.log(err);
    else
        console.log(body);
});
