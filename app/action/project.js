/**
 * @file 动画项目管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const validate = require('../common/middlewares/validator.js');
const ProjectModel = require('../model/Project.js');
const LayerModel = require('../model/Layer.js');
const KeyframeModel = require('../model/Keyframe.js');
const StaticModel = require('../model/Static.js');

router.prefix('/project');


router.get('/', function* () {
    const models = yield this.getDBModels();
    const pmodel = ProjectModel.getInstance(models);
    const smodel = StaticModel.getInstance(models);
    const lmodel = LayerModel.getInstance(models);
    const kmodel = KeyframeModel.getInstance(models);

    const tabs = yield pmodel.fetchTabs();
    let projectid = tabs[0].id;
    for (let tab of tabs) {
        if (tab.focus) {
            projectid = tab.id;
        }
    }
    const project = yield pmodel.fetchProject(projectid);
    const layers = yield lmodel.fetchLayers(projectid);
    const keyframes = yield kmodel.fetchKeyframes(projectid);

    // 递归一次性找出所有的静态资源
    // TODO: 文件数量大的话性能会有问题
    const statics = yield smodel.fetchStatics();

    this.body = {
        tabs,
        project,
        layers,
        statics,
        keyframes
    };
});

router.get('/:id', function* () {

    const id = this.params.id;
    const models = yield this.getDBModels();
    const pmodel = ProjectModel.getInstance(models);
    const lmodel = LayerModel.getInstance(models);
    const kmodel = KeyframeModel.getInstance(models);
    const project = yield pmodel.fetchProject(id);
    const layers = yield lmodel.fetchLayers(id);
    const keyframes = yield kmodel.fetchKeyframes(id);
    yield pmodel.changeFocusStatus(id);

    this.body = {
        project,
        layers,
        keyframes
    }
});

router.post('/update', function* () {

    const models = yield this.getDBModels();
    const model = ProjectModel.getInstance(models);
    const params = this.request.body;

    model.update(params);

    this.body = {
        status: 0
    }
});


module.exports = router;
