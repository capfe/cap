/**
 * @file 静态资源管理
 * @author mj(zouamiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const Model = require('../model/Static.js');
const fs = require('fs');
const path = require('path');
const conf = require('../common/conf.js').get('app');


router.prefix('/static');

router.post('/upload', function* () {

    const files = this.request.body.files;
    const fields = this.request.body.fields;
    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);
    try {
        const imageFile = files.image;
        const filePath = imageFile.path;
        const hash = imageFile.hash;
        const type = imageFile.type;
        const name = imageFile.name;
        const size = parseInt(imageFile.size / 1000, 10) + 'kb';
        const storePath = path.resolve(conf.rootPath, 'data/resources/', name);

        // 数据库增加文件(上传的文件)
        const data = yield model.addFile({
            name,
            size,
            type,
            comments: '',
            parent: ''
        });
        fs.writeFileSync(storePath, fs.readFileSync(filePath));

        this.body = {
            status: 0,
            data
        };

    }
    catch (e) {
        this.logger.warning(e.message);
        this.status = 500;
        this.body = {
            status: 500,
            statusInfo: '上传出错'
        };
    }
});

router.post('/addFold', function* () {
    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);

    try {
        const index = yield model.fetchNewFoldIndex();
        const name = `文件夹${index}`;

        // 数据库增加文件夹
        const data = yield model.addFold({
            name,
            comments: '',
            parent:'',
            open: false
        });

        this.body = {
            status: 0,
            data
        }

    }
    catch (e) {
        this.logger.warning(e.message);
        this.status = 500;
        this.body = {
            status: 500,
            statusInfo: '添加文件夹出错'
        };
    }
});


router.post('/update', function* () {
    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);
    const params = this.request.body;

    yield model.update(params);

    this.body = {
        status: 0
    }
});

module.exports = router;
