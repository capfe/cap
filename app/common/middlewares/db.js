/**
 * @file 数据库连接管理中间件
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const db = require('../db.js');
const co = require('co');

module.exports = function () {

    return function* (next) {

        this.getDBModels = co.wrap(function* () {
            return db;
        });

        yield next;
    };

};
