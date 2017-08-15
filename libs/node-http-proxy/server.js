'use strict';

const koa = require('koa');
const app = new koa();
const httpProxy = require('http-proxy');
const http = require('http');
let keepAliveAgent = new http.Agent({keepAlive: true});

let proxy = httpProxy.createProxyServer({
    target:'http://localhost:8000',
    agent: keepAliveAgent,
    xfwd: true
});

app.use(async function(ctx) {
    console.log("requst .....");
    proxy.web(ctx.req, ctx.res, function(err) {
        console.error(err);
    });
    await new Promise((resolve, reject) => {
        ctx.res.on("finish", function() {
            console.log("res write back");
            resolve();
        });
        ctx.res.on("error", function(err) {
            reject(err);
        })
    });
});
app.listen(9000);
