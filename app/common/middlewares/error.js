/**
 * @file 异常处理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

module.exports = function errorHandler(conf) {

    return function* (next) {

        try {
            yield next;
        }
        catch (e) {


            this.logger.warning(JSON.stringify({
                message: e.message,
                stack: e.stack
            }));

            if (e.status === 401) {
                this.status = 401;
                this.body = {
                    error: 'Not Authorized'
                };
                return;
            }

            if (conf.debug) {
                this.status = 200;
                this.body = e.stack;
                return;
            }

            this.status = 500;

        }

    };

};
