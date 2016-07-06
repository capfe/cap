/**
 * @file static schema
 * @author mj(zoumiaojiang@baidu.com)
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    name: String,
    size: String,
    type: String,
    comments: String,
    parent: String
};

const staticSchema = new Schema(fields);

module.exports = staticSchema;