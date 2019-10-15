import template from './item-mrf-edit-energy-duct-system.html';
import controller from './item-mrf-edit-energy-duct-system.controller';

let checklistItemMrfEditEnergyDuctSystemComponent = {
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

export default checklistItemMrfEditEnergyDuctSystemComponent;
