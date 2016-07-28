/**
 * @file keyframe schema
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    projectid: String,
    index: Number,
    layers: Array
};

const keyframeSchema = new Schema(fields);

module.exports = keyframeSchema;
