/**
 * @file 图层管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const Model = require('../model/Keyframe.js');

router.prefix('/keyframe');

router.post('/add', function* () {
    this.body = {};
});


module.exports = router;
