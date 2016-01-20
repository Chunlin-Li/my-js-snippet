/**
 * Created by chunlin on 16-1-8.
 */
'use strict';
var RateLimiter = require('limiter').RateLimiter;
// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
var limiter = new RateLimiter(10, 'second', true);
var run = 0;

// Throttle requests
for (var i = 0; i < 100; i ++ ) {
    let k = i.toString();
    limiter.removeTokens(1, function (err, remainingRequests) {
        // err will only be set if we request more than the maximum number of
        // requests we set in the constructor
        if (err) {
            console.error('err ' + err.stack, err);
        }
        // remainingRequests tells us how many additional requests could be sent
        // right this moment
        console.log('run' + run ++ + ' k : ' + k);
    });
}