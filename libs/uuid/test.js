var uuid = require('uuid');

var start;
var time1;
var time2;
var id;

start = process.hrtime();
id = uuid.v1();
time1 = process.hrtime(start)[1]/1000000;

start = process.hrtime();
time2 = process.hrtime(start)[1]/1000000;

console.log(`time1 : ${time1};  time2: ${time2}`);
console.log(`uuid : ${id}`);

id='0a8a4d20-8154-11e5-bbc1-cb0be4f4fa7e';
uuidReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
console.log(uuidReg.test(id));