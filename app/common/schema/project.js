/**
 * @file project schema
 * @author mj(zoumiaojiang@gmail.com)
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
    focus: Boolean,
    // not for db
    // layers: Array,
    // keyframes: Array
};

const projectSchema = new Schema(fields);

module.exports = projectSchema;
