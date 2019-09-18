import template from './item-energy-gauge-edit-duct-system.html';
import controller from './item-energy-gauge-edit-duct-system.controller';

let checklistItemEnergyGaugeEditDuctSystemComponent = {
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

export default checklistItemEnergyGaugeEditDuctSystemComponent;
