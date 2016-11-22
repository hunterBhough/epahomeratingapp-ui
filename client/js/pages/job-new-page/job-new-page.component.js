import template from './job-new-page.html';
import controller from './job-new-page.controller';

let jobsNewPageComponent = {
    bindings : {
        job : '<'
    },
    template,
    controller,
    controllerAs : 'jobsNewPageCtrl'
};

export default jobsNewPageComponent;
