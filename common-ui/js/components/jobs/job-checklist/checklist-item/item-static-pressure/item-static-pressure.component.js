import template from './item-static-pressure.html';
import controller from './item-static-pressure.controller';

import './item-static-pressure.scss';

let checklistItemMrfStaticPressureComponent = {
    bindings : {
        itemId               : '@',
        itemCategory         : '@',
        itemCategoryProgress : '@'
    },
    template,
    controller,
    controllerAs : 'checklistItemCtrl'
};

export default checklistItemMrfStaticPressureComponent;
