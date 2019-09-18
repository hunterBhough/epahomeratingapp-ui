import template from './item-energy-gauge-edit-infiltration.html';
import controller from './item-energy-gauge-edit-infiltration.controller';

let checklistItemEnergyGaugeEditInfiltrationComponent = {
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

export default checklistItemEnergyGaugeEditInfiltrationComponent;
