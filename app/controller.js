/**
 * @file 路由配置
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const compose = require('koa-compose');

const routers = [
    require('./action/project'),
    require('./action/layer'),
    require('./action/keyframe'),
    require('./action/static')
];

// 通过 koa-compose 合并为一个中间件
module.exports = compose(
    routers.map(router => router.routes())
);