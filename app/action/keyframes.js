/**
 * @file 关键帧管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const Model = require('../model/Keyframes.js');

const listValidate = validate({
    additionalProperties: true,
    properties: {
        request: {
            type: 'object',
            properties: {
                query: {
                    type: 'object',
                    properties: {
                        // pageSize: {
                        //     'type': 'number',
                        //     'default': 20
                        // },
                        // pageNum: {
                        //     'type': 'number',
                        //     'default': 0
                        // },
                        // type: {
                        //     'type': ['number', 'string'],
                        //     'pattern': '^(|-1|1000|1001|1002|3000|3001|3002)$',
                        //     'default': '-1'
                        // },
                        // status: {
                        //     'type': ['number', 'string'],
                        //     'pattern': '^(|-1|0|1|2)$',
                        //     'default': '-1'
                        // },
                        // orderBy: {
                        //     'type': 'string',
                        //     'pattern': '^(|id|status|type|create_time|score|sales)$',
                        //     'default': 'create_time'
                        // },
                        // reverse: {
                        //     'type': ['number', 'string'],
                        //     'pattern': '^(|0|1)$',
                        //     'default': '1'
                        // }
                    }
                }
            }
        }
    }
});

router.prefix('/keyframes');

router.get('/', listValidate, function* () {

    this.body = {};
});


module.exports = router;
