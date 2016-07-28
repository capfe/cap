/**
 * @file keyframe管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const KeyframeModel = require('../model/Keyframe.js');
const KeyframeLayerModel = require('../model/KeyframeLayer.js');

router.prefix('/keyframes');

router.post('/add', function* () {
    const dbModels = yield this.getDBModels();
    const keyframeModel = KeyframeModel.getInstance(dbModels);
    const keyframeLayerModel = KeyframeLayerModel.getInstance(dbModels);

    const params = this.request.body;
    const projectid = params.projectid;
    const index = params.index;
    const layerid = params.layerid;
    const prop = params.prop;
    const type = params.type;
    const key = params.key;
    const value = +(params.value || 0);
    const fx = 'linear';
    const keyframe = yield keyframeModel.fetchKeyframe({ index, projectid });
    const keyframes = yield keyframeModel.fetchKeyframes(projectid);

    let obj = {};
    let flag = false;

    // 找到前一帧，并复制前一帧的属性值
    for (let i = index - 1; i >= 0; i--) {
        const item = keyframes[i];
        if (item) {
            for (let layer of item.layers) {
                console.log(layer.layerid, layer[prop]);
                if (layer.layerid === layerid && layer[prop]) {
                    obj = layer[prop];
                    flag = true;
                }
            }
        }
    }

    console.log(flag);

    if (!flag) {
        if (('' + type) === 'false') {
            obj = {
                value: 100,
                fx
            }
        }
        else {
            obj = {
                x: {
                    value: 0,
                    fx
                },
                y: {
                    value: 0,
                    fx
                }
            }
        }
    }

    console.log(obj);

    if (value) {
        if (key) {
            obj[key] = {
                value,
                fx
            }
        }
        else {
            obj = {
                value,
                fx
            }
        }
    }

    // 先判断是不是在index下含有关键帧, 没有就新增一项
    if (!keyframe) {
        const newKeyframe = yield keyframeModel.add({ index, projectid });
        yield keyframeLayerModel.add({
            kfid: newKeyframe._id,
            layerid,
            [prop]: obj
        })
    }
    else {
        // 如果确定有关键帧的话，确定是不是有这个图层的关键帧
        const keyframeLayer = yield keyframeLayerModel.fetchKeyframeLayer(layerid);
        if (!keyframeLayer) {
            yield keyframeLayerModel.add({
                layerid,
                kfid: keyframe._id,
                [prop]: obj
            });
        }
        else {
            yield keyframeLayerModel.update({
                kfid: keyframe._id,
                props: {
                    [prop]: obj
                }
            });
        }
    }

    const data = yield keyframeModel.fetchKeyframes(projectid);

    this.body = {
        status: 0,
        data
    };
});


module.exports = router;
