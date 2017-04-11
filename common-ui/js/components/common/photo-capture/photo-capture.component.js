import template from './photo-capture.html';
import controller from './photo-capture.controller';

let photoCaptureComponent = {
    bindings : {
        'photo'          : '<',
        'onPhotoCapture' : '&'
    },
    template,
    controller,
    controllerAs : 'photoCaptureCtrl'
};

export default photoCaptureComponent;
