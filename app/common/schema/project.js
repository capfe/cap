/**
 * @file project schema
 * @author mj(zoumiaojiang@baidu.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    fps: Number,
    totalFrame: Number,
    frameIndex: Number,
    scale: Number,
    name: String,
    show: Boolean,
    pixel: Number,
    layers: Array,
    keyframes: Array
};

const projectSchema = new Schema(fields);

module.exports = projectSchema;
