import template from './item-select-thermal-strategy.html';
import controller from './item-select-thermal-strategy.controller';

let checklistItemSelectThermalStrategyComponent = {
    bindings : {
        itemId               : '@',
        itemCategory         : '@',
        itemCategoryProgress : '@'
    },
    template,
    controller,
    controllerAs : 'checklistItemSelectThermalStrategyController'
};

export default checklistItemSelectThermalStrategyComponent;
