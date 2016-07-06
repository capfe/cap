/**
 * @file 静态资源管理
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');
const conf = require('../common/conf.js').get('app');
const path = require('path');

const TYPE_MAP = {
    '.jpg': 'image',
    '.png': 'image',
    '.gif': 'image',
    '.psd': 'psd'
}

const TYPE_NAME_MAP = {
    'image': '图像',
    'psd': 'psd文件'
}


class Static {

    constructor(models) {
        this.StaticModel = models.StaticModel;
        this.FoldModel = models.FoldModel;
    }

    addFile (file) {
        const SModel = this.StaticModel;
        const model = new SModel(file);

        return model.save();
    }

    addFold (fold) {
        const FModel = this.FoldModel;
        const model = new FModel(fold);

        return model.save();
    }

    /**
     * 获取文件夹下标
     *
     * @return {number} 当前下标
     */
    fetchNewFoldIndex() {

        const FModel = this.FoldModel;

        return co(function* () {
            const name = /^文件夹\d*?$/;
            const folds = yield FModel.find({ name }, 'name').exec();
            let maxNum = 0;
            if (folds.length === 0) {
                return '';
            }
            for (const fold of folds) {
                const nums = fold.name.match(/\d+/);
                if (nums && nums.length) {
                    const num = +nums[0];
                    if (num > maxNum) {
                        maxNum = num;
                    }
                }
            }

            return ++maxNum;
        });
    }

    update (params) {
        const Model = params.type === 'fold'
            ? this.FoldModel
            : this.StaticModel;

        if (params.type === 'fold') {
            return Model.update(
                {
                    _id: params.id
                },
                {
                    $set: {
                        [params.field]: params.value
                    }
                }
            ).exec();
        }
    }

}

Static.getInstance = (models) => {
    return new Static(models);
};

module.exports = Static;

