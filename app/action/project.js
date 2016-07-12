/**
 * @file 动画项目管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const ProjectModel = require('../model/Project.js');
const StaticModel = require('../model/Static.js');

router.prefix('/project');




router.get('/', function* () {
    const models = yield this.getDBModels();
    const pmodel = ProjectModel.getInstance(models);
    const smodel = StaticModel.getInstance(models);

    const tabs = yield pmodel.fetchTabs();
    const project = yield pmodel.fetchProject(tabs[0].id);

    // 递归一次性找出所有的静态资源
    // TODO: 文件数量大的话性能会有问题
    const statics = yield smodel.fetchStatics();

    this.body = {
        tabs,
        project,
        statics
    };
});

router.get('/:id', function* () {

    const id = this.params.id;
    const models = yield this.getDBModels();
    const model = ProjectModel.getInstance(models);
    const result = yield model.fetchProject(id);

    this.body = result
});


module.exports = router;
