import template from './item-air-inlet-locations.html';
import controller from './item-air-inlet-locations.controller';

import './item-air-inlet-locations.scss';

let checklistItemAirInletLocationsComponent = {
    bindings : {
        itemId               : '@',
        itemCategory         : '@',
        itemCategoryProgress : '@'
    },
    template,
    controller,
    controllerAs : 'checklistItemAirInletLocationsCtrl'
};

export default checklistItemAirInletLocationsComponent;
