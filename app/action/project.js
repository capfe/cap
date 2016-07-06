/**
 * @file 动画项目管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const Model = require('../model/Project.js');

router.prefix('/project');

router.get('/', function* () {
    const models = yield this.getDBModels();
    const model = Model.getInstance(models);
    const tabs = yield model.fetchTabs();
    const project = yield model.fetchProject(tabs[0].id);
    const files = yield model.fetchFiles();
    const folds = yield model.fetchFolds();

    this.body = {
        tabs,
        project,
        files,
        folds
    };
});

router.get('/:id', function* () {

    const id = this.params.id;
    const models = yield this.getDBModels();
    const model = Model.getInstance(models);
    const result = yield model.fetchProject(id);

    this.body = result
});


module.exports = router;
