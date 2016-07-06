/**
 * @file mongodb连接
 * @author mj(zoumiaojiang@baidu.com)
 */


'use strict';


const mongoose = require('mongoose');
const dbconf = require('./conf.js').get('db');
const connectPath = `mongodb://${dbconf.host}:${dbconf.port}/${dbconf.dbname}`;

const options = {
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};

mongoose.Promise = global.Promise;

const connection = mongoose.createConnection(connectPath, options);
const ProjectModel = connection.model('project', require('./schema/project'));
const StaticModel = connection.model('file', require('./schema/file'));
const FoldModel = connection.model('fold', require('./schema/fold'));

module.exports = {
    ProjectModel,
    StaticModel,
    FoldModel
};
