/**
 * @file keyframes
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

class Keyframes {

    constructor(connection) {
        this.connection = connection;
    }

}

Keyframes.getInstance = function (connection) {
    return new Keyframes(connection);
};

module.exports = Keyframes;

