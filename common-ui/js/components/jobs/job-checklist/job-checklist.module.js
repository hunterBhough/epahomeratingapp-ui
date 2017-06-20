import angular from 'angular';

import checklistNavComponent from './checklist-nav/checklist-nav.component';
import checklistHouseSelectionComponent from './checklist-house-selection/checklist-house-selection.component';
import houseSelectionItemComponent from './checklist-house-selection/house-selection-item/house-selection-item.component';
import checklistCategoryComponent from './checklist-category/checklist-category.component';
import checklistStageComponent from './checklist-stage/checklist-stage.component';
import checklistFilterComponent from './checklist-filter/checklist-filter.component';
import checklistItemComponent from './checklist-item/checklist-item.component';
import checklistItemCommentsComponent from './checklist-item/item-comments/item-comments.component';
import checklistItemDefaultComponent from './checklist-item/item-default/item-default.component';
import checklistItemMrfComponent from './checklist-item/item-mrf/item-mrf.component';
import checklistItemMrfEditComponent from './checklist-item/item-mrf-edit/item-mrf-edit.component';
import checklistItemMrfEditFieldBooleanComponent from './checklist-item/item-mrf-edit/field-boolean/field-boolean.component';
import checklistItemMrfEditFieldDecimalComponent from './checklist-item/item-mrf-edit/field-decimal/field-decimal.component';
import checklistItemMrfEditFieldEnumComponent from './checklist-item/item-mrf-edit/field-enum/field-enum.component';
import checklistItemNotApplicableComponent from './checklist-item/item-not-applicable/item-not-applicable.component';
import checklistItemStaticPressureComponent from './checklist-item/item-static-pressure/item-static-pressure.component';
import checklistItemHvacCommissioningComponent from './checklist-item/item-hvac-commissioning/item-hvac-commissioning.component';
import checklistItemHvacEquipmentComponent from './checklist-item/item-hvac-equipment/item-hvac-equipment.component';
import hvacEquipmentComponent from './checklist-item/item-hvac-equipment/hvac-equipment/hvac-equipment.component';
import checklistItemMeasuredVentilationComponent from './checklist-item/item-measured-ventilation/item-measured-ventilation.component';

let jobsModule
    = angular
        .module('epahomeratingapp.components.jobs.checklist', [])
        .component('checklistNav', checklistNavComponent)
        .component('checklistHouseSelection', checklistHouseSelectionComponent)
        .component('houseSelectionItem', houseSelectionItemComponent)
        .component('checklistCategory', checklistCategoryComponent)
        .component('checklistStage', checklistStageComponent)
        .component('checklistFilter', checklistFilterComponent)
        .component('checklistItem', checklistItemComponent)
        .component('checklistItemComments', checklistItemCommentsComponent)
        .component('checklistItemDefault', checklistItemDefaultComponent)
        .component('checklistItemMrf', checklistItemMrfComponent)
        .component('mrfEdit', checklistItemMrfEditComponent)
        .component('mrfEditFieldBoolean', checklistItemMrfEditFieldBooleanComponent)
        .component('mrfEditFieldDecimal', checklistItemMrfEditFieldDecimalComponent)
        .component('mrfEditFieldEnum', checklistItemMrfEditFieldEnumComponent)
        .component('checklistItemNotApplicable', checklistItemNotApplicableComponent)
        .component('checklistItemStaticPressure', checklistItemStaticPressureComponent)
        .component('checklistItemHvacCommissioning', checklistItemHvacCommissioningComponent)
        .component('checklistItemHvacEquipment', checklistItemHvacEquipmentComponent)
        .component('hvacEquipment', hvacEquipmentComponent)
        .component('checklistItemMeasuredVentilation', checklistItemMeasuredVentilationComponent);

export default jobsModule;
