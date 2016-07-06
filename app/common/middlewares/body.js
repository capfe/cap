/**
 * @file POST 请求体解析
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const body = require('koa-body');
const fs = require('fs');
const thunkify = require('thunkify');
const rm = thunkify(fs.unlink);

function* clean() {

    // 如果有业务使用了文件上传，我们需要清理；没使用到的就 pass。
    if (!this.request.body || !this.request.body.files) {
        return;
    }

    const files = this.request.body.files;
    const temporaries = Object.keys(files)
        .reduce((result, name) => result.concat(files[name]), [])
        .map(file => file.path);

    try {
        yield temporaries.map(file => rm(file));
        this.logger.trace('upload temporary files cleaned:' + JSON.stringify(temporaries));
    }
    catch (e) {
        this.logger.warning('cannot clean upload temporaries', temporaries, JSON.stringify(e));
    }

}

const compose = require('koa-compose');

module.exports = function (conf) {
    return compose([
        body(conf),
        function* (next) {
            this.set('Access-Control-Allow-Origin', '*');
            try {
                yield next;
            }
            finally {
                yield clean.call(this);
            }

        }
    ]);
};
