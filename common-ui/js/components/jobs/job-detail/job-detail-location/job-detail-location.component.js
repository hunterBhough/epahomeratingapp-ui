import template from './job-detail-location.html';
import controller from './job-detail-location.controller';

let jobDetailLocationComponent = {
    bindings : {
        location : '<'
    },
    template,
    controller,
    controllerAs : 'jobDetailLocationCtrl'
};

export default jobDetailLocationComponent;
