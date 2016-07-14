/**
 * @file 静态资源管理
 * @author mj(zouamiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const Model = require('../model/Static.js');
const fs = require('fs-extra');
const conf = require('../common/conf.js').get('app');

const re = /^(.*?)(\((\d*?)\))?(\.(png|gif|psd|jpg|jpeg))?$/i;

router.prefix('/static');

const EXT_NAME_MAP = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
};

router.post('/upload', function* () {

    const files = this.request.body.files;
    const fields = this.request.body.fields;
    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);
    try {
        const imageFile = files.image;
        const sourcePath = imageFile.path;
        const type = imageFile.type;
        const name = imageFile.name;
        const parent = fields.parent;
        const size = parseInt(imageFile.size / 1000, 10) + 'K';
        let alreadyHasName = yield model.alreadyHasName({ parent, name });
        let num = 0;
        let originName = '';
        let abspath = yield model.fetchPath(parent);
        let storePath;
        let extname = EXT_NAME_MAP[type];
        while (alreadyHasName) {
            let arr = name.match(re);
            originName = arr[1] || '';
            num = arr[3] || 0;
            extname = arr[4] || extname;
            num++;
            name = `${originName}(${num})${extname}`;
            alreadyHasName = yield model.alreadyHasName({ parent, name });
        }
        yield model.unfold(parent);
        yield model.addFile({ name, size, type, comments: '文件描述', parent });
        storePath = `${conf.rootPath}/data/resources/${abspath}${name}`;
        fs.copy(sourcePath, storePath);
        const data = yield model.fetchStatics();

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
    const params = this.request.body;
    const parent = params.parent || '';

    try {
        let name = '文件夹';
        let alreadyHasName = yield model.alreadyHasName({ parent, name });
        let num = 0;
        let originName = '';
        let abspath = yield model.fetchPath(parent);
        let storePath;
        while (alreadyHasName) {
            let arr = name.match(re);
            originName = arr[1] || '';
            num = arr[3] || 0;
            num++;
            name = `${originName}(${num})`;
            alreadyHasName = yield model.alreadyHasName({ parent, name });
        }
        storePath = `${conf.rootPath}/data/resources/${abspath}${name}`;
        yield model.unfold(parent);
        yield model.addFold({
            name,
            comments: '文件夹描述',
            parent,
            open: false
        });

        fs.mkdirs(storePath);
        const data = yield model.fetchStatics();
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
    const parent = params.parent || '';

    if (params.field == 'name') {
        let name = params.value;
        let abspath = params.abspath;
        let alreadyHasName = yield model.alreadyHasName({ parent, name });
        let num = 0;
        let extname = params.extname || '';
        let originName = '';
        let newAbspath = yield model.fetchPath(parent);
        let oldStorePath;
        let newStorePath;
        while (alreadyHasName) {
            let arr = name.match(re);
            originName = arr[1] || '';
            num = arr[3] || 0;
            extname = arr[4] || extname;
            num++;
            params.value = name = `${originName}(${num})${extname}`;
            alreadyHasName = yield model.alreadyHasName({ parent, name });
        }

        oldStorePath = `${conf.rootPath}/data/resources/${abspath}`;
        newStorePath = `${conf.rootPath}/data/resources/${newAbspath}${name}`;
        fs.move(
            oldStorePath,
            newStorePath,
            {
                clobber: true,
            },
            err => {}
        );
    }

    yield model.update(params);
    const statics = yield model.fetchStatics();

    this.body = {
        status: 0,
        data: {
            statics,
            info: params
        }
    }
});

router.post('/remove', function* () {
    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);
    const params = this.request.body;
    const id = params.id;
    const abspath = params.abspath;

    yield model.remove(id);
    const statics = yield model.fetchStatics();
    const storePath = `${conf.rootPath}/data/resources/${abspath}`;
    fs.remove(storePath)

    this.body = {
        status: 0,
        data: {
            statics
        }
    };
});

module.exports = router;