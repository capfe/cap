/**
 * @file koa-body插件配置
 * @author mj(zoumiaojiang@gmail.com)
 */

const os = require('os');

module.exports = {

    // 解析 multipart 类型的 POST 请求
    multipart: true,

    formidable: {

        // 计算上传文件的 md5 值
        hash: 'md5',

        // 上传文件的缓存目录
        uploadDir: os.tmpdir(),

        // 支持同名上传多个文件；
        // 如果请求体中只有一个同名的字段 那么解析出来的 files[name] 是个 Object；
        // 如果请求体中有两个或多个同名的字段，那么此时解析出的 files[name] 数据是 Array；
        multiples: true

    }

};
