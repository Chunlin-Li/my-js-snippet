'use strict';

var BloomFilter = require('bloomfilter').BloomFilter;
var uuid = require('uuid');

var bloom = new BloomFilter(32 * 256, 4);



bloom.add(uuid.v4());

