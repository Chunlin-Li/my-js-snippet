'use strict';
var assert = require('assert');
var LOGGER = require('./');

describe('Logger', function () {

  it('log some informatino to console', function () {
    let console = LOGGER();
    console.info('hi ...');
    console.warn('warning about ...');
    console.error('something wrong ...');
  });

  it('log information to file', function () {
    let console = LOGGER('ro_file');
    console.info('hi ...');
    console.warn('warning about ...');
    console.error('something wrong ...');
  });

  it('debug logs', function () {
    // non JSON output, Environment
    let debug= LOGGER('debug')(); // default section is  DEFAULT
    debug('hi, here is some information for debug! (Not JSON)');

    // NODE_DEBUG=MYLOGMODULE as the debug section.
    let debug2 = LOGGER('debug')('MYLOGMODULE');
    debug2('some other debug information..... ');
  });

});