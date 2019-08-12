import template from './user-register-page.html';
import controller from './user-register-page.controller';

import './user-register-page.scss';

let userRegisterPageComponent = {
    bindings : {
        user : '<'
    },
    template,
    controller,
    controllerAs : 'userRegisterPageCtrl'
};

export default userRegisterPageComponent;
