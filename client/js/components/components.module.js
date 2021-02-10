import navbarAdminComponent from './navbar-admin/navbar-admin.component';
import DocumentHandlerModule from './document-handler/document-handler.module';
import navbarSupportComponent from './navbar-support/navbar-support.component';
import photoCaptureComponent from './photo-capture/photo-capture.component';


let AdminComponentsModule
    = angular
        .module('epahomeratingapp.adminComponents', [
            DocumentHandlerModule.name
        ])
        .component('navbarAdmin', navbarAdminComponent)
        .component('photoCapture', photoCaptureComponent)
        .component('navbarSupport', navbarSupportComponent);

export default AdminComponentsModule;
