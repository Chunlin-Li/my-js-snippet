'use strict';

const koa = require('koa');
const app = new koa();
const ipaddr =

app.use(function (ctx) {
    console.log('request...', new Date());
    // let a = b.c.d;
    ctx.res.writeHead(200, { 'Content-Type': 'text/plain' });
    ctx.res.write('request successfully backServer!' + '\n' + JSON.stringify(ctx.req.headers, true, 2));
    ctx.res.end();
});
app.listen(8000);
