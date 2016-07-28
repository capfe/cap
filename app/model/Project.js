/**
 * @file project相关
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');


class Project {

    constructor (models) {
        this.ProjectModel = models.ProjectModel;
    }

    fetchProject (id) {

        const Model = this.ProjectModel;
        return co(function* () {
            const result = yield Model.findOne({ _id: id }).exec();
            return result;
        });
    }

    changeFocusStatus (id) {
        const Model = this.ProjectModel;
        return co(function* () {
            yield Model.update(
                {
                    focus: true
                },
                {
                    $set: {
                        focus: false
                    }
                }
            ).exec();
            yield Model.update(
                {
                    _id: id
                },
                {
                    $set: {
                        focus: true
                    }
                }
            ).exec();
        });
    }

    fetchTabs () {
        const Model = this.ProjectModel;

        return co(function* () {
            const projects = yield Model.find().exec();
            const tabs = [];
            for (let project of projects) {
                tabs.push({
                    id: project.id,
                    name: project.name,
                    focus: project.focus,
                    show: project.show
                });
            }

            return tabs;
        });
    }

    update (params) {
        const Model = this.ProjectModel;
        const id = params.id;
        const field = params.field;
        const value = params.value;

        return co(function* () {
            yield Model.update(
                {
                    _id: id
                },
                {
                    $set: {
                        [field]: value
                    }
                }
            );
        });
    }

}

Project.getInstance = (models) => {
    return new Project(models);
};

module.exports = Project;

