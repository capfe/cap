/**
 * @file keyframe schema
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    layerid: String,
    kfid: String,
    position: Object,
    scale: Object,
    opacity: Object,
    rotate: Object,
    skew: Object,
    zIndex: Number,
    size: Object,
    css: Object
};

const keyframeLayerSchema = new Schema(fields);

module.exports = keyframeLayerSchema;
