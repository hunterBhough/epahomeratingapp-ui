import template from './item-mrf-edit-energy-infiltration.html';
import controller from './item-mrf-edit-energy-infiltration.controller';

let checklistItemMrfEditEnergyInfiltrationComponent = {
    bindings : {
        mrfDigest          : '<',
        mrfData            : '<',
        title              : '@',
        onSaveMrfRow       : '&',
        onCancelMrfRow     : '&',
        libraryTypeNameKey : '@'
    },
    template,
    controller,
    controllerAs : 'checklistItemMrfEditCtrl'
};

export default checklistItemMrfEditEnergyInfiltrationComponent;
