import template from './jobs-page.html';
import controller from './jobs-page.controller';

import './jobs-page.scss';

let jobsPageComponent = {
    bindings : {
        jobs    : '<',
        company : '<'
    },
    template,
    controller,
    controllerAs : 'jobsPageCtrl'
};

export default jobsPageComponent;
