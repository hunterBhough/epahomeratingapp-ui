import angular from 'angular';
import buttonGroupComponenet from './button-group/button-group.component';
import listFilterComponenet from './list-filter/list-filter.component';
import linearProgressComponenet from './linear-progress/linear-progress.component';
import radialProgressComponenet from './radial-progress/radial-progress.component';

let elementsModule
    = angular
        .module('epahomeratingapp.elements', [])
        .component('buttonGroup', buttonGroupComponenet)
        .component('linearProgress', linearProgressComponenet)
        .component('listFilter', listFilterComponenet)
        .component('radialProgress', radialProgressComponenet);

export default elementsModule;
