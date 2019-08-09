import template from './file-manager.html';
import controller from './file-manager.controller';

let fileManagerComponent = {
    bindings : {
        accept                  : '@',
        label                   : '@',
        uploadOnly              : '@',
        downloadable            : '@',
        enabled                 : '=',
        inputId                 : '@',
        files                   : '=',
        showDetails             : '<',
        library                 : '<',
        librarySelectedCallback : '&',
        localSelectedCallback   : '&',
        checkHousePlanIsValid   : '&',
        checkXmlIsValid         : '&'
    },
    template,
    controller,
    controllerAs : 'fileManagerCtrl'
};

export default fileManagerComponent;
