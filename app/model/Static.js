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
        const me = this;
        return co(function* () {
            if (file.parent) {
                yield me.unfold(file.parent);
            }
            return model.save();
        });
    }

    /*
     * 递归向上展开文件夹
     */
    unfold (parent) {
        const Model  = this.FoldModel;
        const me = this;
        return co(function* () {
            if (parent) {
                let fold = yield Model.findOne({ _id: parent }).exec();
                yield Model.update(
                    {
                        _id: fold._id
                    },
                    {
                        $set: {
                            open: 1
                        }
                    }
                ).exec();
                if (fold.parent) {
                    yield me.unfold(fold.parent);
                }
            }
        });
    }

    addFold (fold) {
        const FModel = this.FoldModel;
        const model = new FModel(fold);
        const me = this;
        return co(function* () {
            if (fold.parent) {
                yield me.unfold(fold.parent);
            }
            return model.save();
        });
    }

    fetchFiles (pa) {
        const Model  = this.StaticModel;

        return co(function* () {
            const parent = pa || '';
            const result = yield Model.find({ parent }).exec();
            return result;
        });
    }

    /**
     * 获取单个文件
     *
     * @param  {String} fileid fileId
     * @return {Function}   co function
     */
    fetchFile (fileid) {
        const Model = this.StaticModel;

        return co(function* () {
            const result = yield Model.findOne({ _id: fileid }).exec();
            return result;
        });
    }

    /**
     * 获取单个文件
     *
     * @param  {String} fileid fileId
     * @return {Function}   co function
     */
    fetchFold (foldid) {
        const Model = this.FoldModel;

        return co(function* () {
            const result = yield Model.findOne({ _id: foldid }).exec();
            return result;
        });
    }

    fetchPath (parent) {
        const FModel = this.FoldModel;
        const me = this;
        let path = '';
        return co(function* () {
            while (parent) {
                const fold = yield FModel.findOne({ _id: parent }).exec();
                path = fold.name + '/' + path;
                parent = fold.parent;
            }

            return path;
        });
    }

    fetchStatics (parent, level) {
        const me = this;
        const SModel  = this.StaticModel;
        const FModel  = this.FoldModel;
        let filePath = '';
        parent = parent || '';
        level = level || 0;

        return co(function* () {
            let files = yield SModel.find({ parent }).exec();
            let folds = yield FModel.find({ parent }).exec();
            level++;
            for (let fold of folds) {
                const childs = yield me.fetchStatics(fold._id, level);
                const abspath = yield me.fetchPath(fold.parent)
                fold.statics = childs;
                fold.level = level;
                fold.abspath = `/${abspath}${fold.name}`;
            }
            for (let file of files) {
                const abspath = yield me.fetchPath(file.parent);
                file.level = level;
                filePath = `/${abspath}${file.name}`;
                file.abspath = filePath;
            }

            return { files, folds };
        });
    }


    alreadyHasName (params) {
        const FModel = this.FoldModel;
        const SModel = this.StaticModel;
        const parent = params.parent || '';
        const name = new RegExp('^' + params.name.toLowerCase().replace(/[\(\)]/g, s => `\\${s}`) + '$', 'i');

        return co(function* () {
            const fold = yield FModel.findOne({ parent, name }).exec();
            const file = yield SModel.findOne({ parent, name }).exec();
            return (!!fold) || (!!file);
        });
    }

    update (params) {
        const Model = params.type === 'fold'
            ? this.FoldModel
            : this.StaticModel;

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

    remove (id) {
        const me = this;
        const FModel = me.FoldModel;
        const SModel = me.StaticModel;
        return co(function* () {
            const fold = yield FModel.findOne({ _id: id }).exec();
            const file = yield SModel.findOne({ _id: id }).exec();

            if (file) {
                yield SModel.remove({ _id: id }).exec();
            }
            else if (fold) {
                yield FModel.remove({ _id: id }).exec();
                const folds = yield FModel.find({ parent: id }).exec();
                const files = yield SModel.find({ parent: id }).exec();
                for (let item of folds) {
                    yield me.remove(item._id);
                }
                for (let item of files) {
                    yield me.remove(item._id);
                }
            }
        });
    }

}

Static.getInstance = (models) => {
    return new Static(models);
};

module.exports = Static;

