import angular from 'angular';

import checklistNavComponent from './checklist-nav/checklist-nav.component';
import checklistHouseSelectionComponent from './checklist-house-selection/checklist-house-selection.component';
import houseSelectionItemComponent from './checklist-house-selection/house-selection-item/house-selection-item.component';
import checklistCategoryComponent from './checklist-category/checklist-category.component';
import checklistFilterComponent from './checklist-filter/checklist-filter.component';
import checklistItemComponent from './checklist-item/checklist-item.component';
import checklistItemCommentsComponent from './checklist-item/item-comments/item-comments.component';
import checklistItemDefaultComponent from './checklist-item/item-default/item-default.component';
import checklistItemMrfComponent from './checklist-item/item-mrf/item-mrf.component';
import checklistItemMrfEditComponent from './checklist-item/item-mrf-edit/item-mrf-edit.component';
import checklistItemMrfStaticPressureComponent from './checklist-item/item-static-pressure/item-static-pressure.component';

let jobsModule
    = angular
        .module('epahomeratingapp.components.jobs.checklist', [])
        .component('checklistNav', checklistNavComponent)
        .component('checklistHouseSelection', checklistHouseSelectionComponent)
        .component('houseSelectionItem', houseSelectionItemComponent)
        .component('checklistCategory', checklistCategoryComponent)
        .component('checklistFilter', checklistFilterComponent)
        .component('checklistItem', checklistItemComponent)
        .component('checklistItemComments', checklistItemCommentsComponent)
        .component('checklistItemDefault', checklistItemDefaultComponent)
        .component('checklistItemMrf', checklistItemMrfComponent)
        .component('mrfEdit', checklistItemMrfEditComponent)
        .component('checklistItemStaticPressure', checklistItemMrfStaticPressureComponent);

export default jobsModule;
