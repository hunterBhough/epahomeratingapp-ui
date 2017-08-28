import template from './field-boolean.html';
import controller from './field-boolean.controller';

let mrfEditFieldBooleanComponent = {
    bindings : {
        field : '<',
        value : '='
    },
    template,
    controller,
    controllerAs : 'fieldBooleanCtrl'
};

export default mrfEditFieldBooleanComponent;
