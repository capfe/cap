/**
 * @file 应用配置
 * @author mj(zoumiaojiang@gmail.com)
 */

const path = require('path');

module.exports = {

    appName: 'cap',

    rootPath: path.join(__dirname, '../'),

    port: process.env.PORT || 8080

};
