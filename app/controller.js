/**
 * @file 路由配置
 * @author mj(zoumiaojiang@baidu.com)
 */

'use strict';

const compose = require('koa-compose');

const routers = [
    require('./action/project'),
    require('./action/layers'),
    require('./action/keyframes'),
    require('./action/static')
];

// 通过 koa-compose 合并为一个中间件
module.exports = compose(
    routers.map(router => router.routes())
);