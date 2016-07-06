/**
 * @file 校验器中间件
 * @author mj(zoumiaojiang@gmail.com)
 */

const Ajv = require('ajv');

const EXTRA_SCHEMA = {
    additionalProperties: true
};

const AJV_DEFAULT_OPTIONS = {
    coerceTypes: true
};

module.exports = function (schema, options) {

    const ajv = new Ajv(
        Object.assign({}, AJV_DEFAULT_OPTIONS, options || {})
    );

    const validate = ajv.compile(schema);

    return function* (next) {

        const request = this.request;
        const params = this.params;

        const valid = validate({params, request}, EXTRA_SCHEMA);

        if (!valid) {

            const error = validate.errors[0];

            this.status = 400;
            this.body = {
                message: `${error.dataPath.split('.').slice(-1)[0]} ${error.message}`
            };

            return;
        }

        yield next;

    };

};
