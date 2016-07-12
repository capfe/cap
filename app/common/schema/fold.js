/**
 * @file project schema
 * @author mj(zoumiaojiang@baidu.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    name: String,
    comments: String,
    open: Boolean,
    parent: String,
    statics: Object,
    level: Number,
    path: String
};

const foldSchema = new Schema(fields);

module.exports = foldSchema;
