/**
 * @file 配置模块
 * @author mj (zoumiaojiang@gmail.com)
 */

'use strict';

const path = require('path');
const exists = require('./utils/path-exists.js');
const rootPath = path.join(__dirname, '../../conf');

let confs = {};

/**
 * 获取配置
 *
 * @description
 * 1. 在有 NODE_ENV 配置时会优先使用 ${name}.${NODE_ENV}.js 做为配置；
 * 2. 没有 ${NODE_ENV} 时，返回 ${name}.js；
 * 3. 如果有 NODE_ENV 配置，但没有相应的 ${name}.${NODE_ENV}.js 时，会返回 ${name}.js；
 * 4. 如果 ${name}.${NODE_ENV}.js 和 ${name}.js 都不存在时，会报错；
 *
 * @param {string} name 配置名称
 *
 * @return {(Object | Array)}
 */
exports.get = function get(name) {

    if (!name) {
        throw new Error('`conf.get` need a `name` of configuration');
    }

    if (confs[name]) {
        return confs[name];
    }


    const env = process.env.NODE_ENV;

    let confPath;

    if (env) {

        confPath = path.join(rootPath, name + '.' + env + '.js');

        if (exists.sync(confPath)) {
            confs[name] = require(confPath);
            return confs[name];
        }

    }

    confPath = path.join(rootPath, name + '.js');

    if (exists.sync(confPath)) {
        confs[name] = require(confPath);
        return confs[name];
    }

    throw new Error(`no such conf: ${name}`);

};


exports.clear = function clear() {
    confs = {};
};
