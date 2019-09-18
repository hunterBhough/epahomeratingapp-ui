import template from './field-string.html';
import controller from './field-string.controller';

let mrfEditFieldStringComponent = {
    bindings : {
        field        : '<',
        value        : '=',
        handleChange : '&',
        date         : '<'
    },
    template,
    controller,
    controllerAs : 'fieldStringCtrl'
};

export default mrfEditFieldStringComponent;
