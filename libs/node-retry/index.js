'use strict';

let dns = require('dns');
let retry = require('retry');

function faultTolerantResolve(address, cb) {
    let operation = retry.operation();

    operation.attempt(function(currentAttempt) {
        dns.resolve(address, function(err, addresses) {
            if (operation.retry(err)) {
                return;
            }

            cb(err ? operation.mainError() : null, addresses);
        });
    });
}

faultTolerantResolve('nodejs.org', function(err, addresses) {
    console.log(err, addresses);
});
