import template from './job-detail.html';
import controller from './job-detail.controller.js';

let jobDetailComponent = {
    bindings : {
        job : '<'
    },
    template,
    controller,
    controllerAs : 'jobCtrl'
};

export default jobDetailComponent;
