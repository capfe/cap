/**
 * @file 图层管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');

class Layer {

    constructor(models) {
        this.Model = models.LayerModel;
    }

    fetchLayers (projectid) {
        const Model = this.Model;
        return co(function* () {
            const layers = yield Model.find({ projectid }).exec();
            return layers;
        });
    }

    alreadyHasLayer (projectid, name) {
        const Model = this.Model;
        return co(function* () {
            const layer = yield Model.findOne({ projectid, name }).exec();
            return !!layer;
        });
    }

    add (params) {
        const Model = this.Model;
        const model = new Model(params);
        return co(function* () {
            yield model.save();
        });
    }

    update (params) {
        console.log(params.props);
        const Model = this.Model;
        return co(function* () {
            Model.update(
                {
                    _id: params.layerid
                },
                {
                    $set: params.props
                }
            ).exec();
        });
    }

}

Layer.getInstance = function (models) {
    return new Layer(models);
};

module.exports = Layer;
