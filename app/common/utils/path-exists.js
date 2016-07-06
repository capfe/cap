/**
 * @file 判断指定路径是否存在
 * @author mj(zoumiaojiang@gmail.com)
 */

const fs = require('fs');

exports.sync = function (path) {

    try {
        fs.accessSync(path);
        return true;
    }
    catch (e) {
        return false;
    }

};

exports.async = function (path) {

    return new Promise(function (resolve, reject) {

        fs.access(path, function (error) {
            resolve(!error);
        });

    });

};
