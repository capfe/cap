/**
 * @file keyframes model
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');

class Keyframe {

    constructor(models) {
        this.Model = models.KeyframeModel;
        this.KLModel = models.KeyframeLayerModel;
    }

    fetchKeyframes (projectid) {
        const Model = this.Model;
        const KLModel = this.KLModel;
        return co(function* () {
            const keyframes = yield Model.find({ projectid }).exec();
            for (let keyframe of keyframes) {
                const kfid = keyframe._id;
                keyframe.layers = yield KLModel.find({ kfid }).exec();
            }
            return keyframes;
        });
    }

    fetchKeyframe (params) {
        const Model = this.Model;
        const index = params.index;
        const projectid = params.projectid;
        return co(function* () {
            const keyframe = yield Model.findOne({ index, projectid }).exec();
            return keyframe;
        });
    }

    add (params) {
        const Model = this.Model;
        return co(function* () {
            const model = new Model(params);
            const keyframe = yield model.save();
            return keyframe;
        });
    }

    update () {
        
    }

}

Keyframe.getInstance = function (models) {
    return new Keyframe(models);
};

module.exports = Keyframe;

