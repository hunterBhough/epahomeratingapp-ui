import template from './checklist-nav.html';
import controller from './checklist-nav.controller';

import './checklist-nav.scss';

let jobChecklistNavComponent = {
    bindings : {
        'progress' : '<'
    },
    template,
    controller,
    controllerAs : 'jobChecklistNavCtrl'
};

export default jobChecklistNavComponent;
