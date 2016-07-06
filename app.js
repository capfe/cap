/**
 * @file main file
 * @author mj(zoumaiojiang@baidu.com)
 */

'use strict';

const koa = require('koa');
const app = koa();
const conf = require('./app/common/conf.js');
const server = require('koa-static');

// error handler
app.use(require('./app/common/middlewares/error.js')({
    debug: process.env.NODE_ENV !== 'production'
}));

// log
app.use(require('./app/common/middlewares/log.js')(conf.get('log')));

// HTTP POST body parser
app.use(require('./app/common/middlewares/body.js')(conf.get('koa-body')));

// db
app.use(require('./app/common/middlewares/db.js')());

// app router
app.use(require('./app/controller.js'));

// static conf
const staticConf = conf.get('static');
app.use(server(
    staticConf.root,
    staticConf.options
));

// 静态资源 TODO: 迁移至bos
app.use(server(__dirname + '/data/resources'));



// run server
const port = conf.get('app').port;
app.listen(port, function () {
    /* eslint-disable no-console */
    console.log(`cap start: http://localhost:${port}`);
});