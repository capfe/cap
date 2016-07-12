/**
 * @file project相关
 * @author mj(zoumiaojiang@baidu.com)
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

    fetchTabs () {
        const Model = this.ProjectModel;

        return co(function* () {
            const projects = yield Model.find().exec();
            const tabs = [];
            for (let project of projects) {
                tabs.push({
                    id: project.id,
                    name: project.name,
                    focus: 0,
                    show: project.show
                });
            }
            tabs[0].focus = 1;

            return tabs;
        });
    }

}

Project.getInstance = (models) => {
    return new Project(models);
};

module.exports = Project;

