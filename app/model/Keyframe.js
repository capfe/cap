/**
 * @file keyframes
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

class Keyframe {

    constructor(models) {
        this.Model = models.KeyframeModel;
    }

}

Keyframe.getInstance = function (models) {
    return new Keyframe(models);
};

module.exports = Keyframe;

