'use strict';


function parseID(id) {
    id = id.replace(/_/g, '+').replace(/-/g, '/');
    var buf = new Buffer(id, 'base64');
    var date = new Date(buf.readUInt32BE(0) * 1000);
    var pid = buf.readUIntBE(4,2);
    var hostname = buf.slice(6,12).toString('hex');
    var inc = buf.readUIntBE(12,3);
    return date.toJSON() + ' ' + pid + ' ' + hostname + ' ' + inc;
}
