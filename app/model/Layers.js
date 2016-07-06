/**
 * @file 图层管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

class Layers {

    constructor(connection) {
        this.connection = connection;
    }

}

Layers.getInstance = function (connection) {
    return new Layers(connection);
};

module.exports = Layers;

