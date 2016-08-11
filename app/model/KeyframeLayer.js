/**
 * @file keyframes layers model
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');

class KeyframeLayer {

    constructor(models) {
        this.Model = models.KeyframeLayerModel;
    }

    fetchKeyframeLayer (layerid) {
        const Model = this.Model;
        return co(function* () {
            const layer = yield Model.findOne({ layerid }).exec();
            return layer;
        });
    }

    add (params) {
        const Model = this.Model;
        return co(function* () {
            const model = new Model(params);
            yield model.save();
        });
    }

    update (params) {
        const Model = this.Model;
        const kfid = params.kfid;
        const layerid = params.layerid;
        return co(function* () {
            Model.update(
                {
                    kfid,
                    layerid
                },
                {
                    $set: params.props
                }
            ).exec();
        });
    }

}

KeyframeLayer.getInstance = function (models) {
    return new KeyframeLayer(models);
};

module.exports = KeyframeLayer;
