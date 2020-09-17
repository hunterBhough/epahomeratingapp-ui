import template from './radial-progress-mobile.html';
import controller from './radial-progress-mobile.controller';
import './radial-progress-mobile.scss';

let radialProgressMobileComponent = {
    bindings : {
        predrywall : '<',
        final : '<'
    },
    template,
    controller,
    controllerAs : 'radialProgressMobileCtrl'
};

export default radialProgressMobileComponent;
