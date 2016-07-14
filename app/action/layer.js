/**
 * @file 图层管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const Model = require('../model/Layer.js');
const randomColor = require('randomcolor');

router.prefix('/layers');

router.post('/add', function* () {

    const dbModels = yield this.getDBModels();
    const model = Model.getInstance(dbModels);
    const params = this.request.body;
    const sourceid = params.sourceid;
    const projectid = params.projectid;
    const parentid = '';
    const tag = randomColor(/*{ luminosity: 'light' }*/);
    const status = {
        view: true,
        dview: false,
        lock: false,
        layer: false,
        props: false
    };
    const position = {
        x: { value: 0, fx: 'linear' },
        y: { value: 0, fx: 'linear' }
    };

    const rotate = {
        x: { value: 0, fx: 'linear' },
        y: { value: 0, fx: 'linear' }
    };

    const scale = {
        x: { value: 1, fx: 'linear' },
        y: { value: 1, fx: 'linear' }
    };

    const opacity = { value: 100, fx: 'linear' };

    const skew = {
        x: { value: 1, fx: 'linear' },
        y: { value: 1, fx: 'linear' }
    };

    const css = {};

    const namere = /^(.*?)(\d*?)?$/i;
    let name = '图层';
    let zIndex = 0;
    let alreadyHasLayer = yield model.alreadyHasLayer(projectid, name);
    let originLayerName;
    let num = 0;
    while (alreadyHasLayer) {
        let arr = name.match(namere);
        originLayerName = arr[1];
        num = arr[2] || 0;
        num++;
        name = `${originLayerName}${num}`;
        alreadyHasLayer = yield model.alreadyHasLayer(projectid, name);
    }
    zIndex = num * 10;

    yield model.add({
        sourceid,
        projectid,
        parentid,
        tag,
        name,
        status,
        position,
        scale,
        rotate,
        opacity,
        zIndex,
        skew,
        css
    });

    const data = yield model.fetchLayers(projectid);

    try {
        this.body = {
            status: 0,
            data
        }
    }
    catch (e) {
        this.body = {
            status: 0,
            statusInfo: ''
        };
    }
});


module.exports = router;
