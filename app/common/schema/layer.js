/**
 * @file layer schema
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    name: String,
    tag: String,
    statusLayer: Boolean,
    statusProp: Boolean,
    statusView: Boolean,
    statusDview: Boolean,
    statusLock: Boolean,
    parentid: String,
    projectid: String,
    zIndex: Number,
    classname: String,
    sourceid: String,
    position: Object,
    rotate: Object,
    scale: Object,
    opacity: Object,
    size: Object,
    css: Object
};

const layerSchema = new Schema(fields);

module.exports = layerSchema;
