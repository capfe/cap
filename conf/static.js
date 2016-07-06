/**
 * @file 项目入口配置
 * @author mj(zoumiaojiang@gmail.com)
 */

const path = require('path');

module.exports = {
    root: path.join(__dirname, '../../cap-vue/build/dist'),
    options: {
        maxage: 2592000000,
        hidde: false,
        index: 'index.html',
        defer: false
    }
};
