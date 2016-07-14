/**
 * @file project相关
 * @author mj(zoumiaojiang@gmail.com)
 */

'use strict';

const co = require('co');


class Project {

    constructor (models) {
        this.ProjectModel = models.ProjectModel;
        this.LayerModel = models.LayerModel;
    }

    fetchProject (id) {

        const Model = this.ProjectModel;
        const LModel = this.LayerModel;

        return co(function* () {
            const result = yield Model.findOne({ _id: id }).exec();
            const layers = yield LModel.find({ projectid: id }).exec();
            result.layers = layers;
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

