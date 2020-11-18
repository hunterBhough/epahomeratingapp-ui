
class desktopPageController {
    constructor ($log, $q, ModalService, BASE_IMAGE_URL) {
        'ngInject';

        this.$log                 = $log;
        this.$q                   = $q;
        this.ModalService        = ModalService;
        this.BASE_IMAGE_URL       = BASE_IMAGE_URL;


    }

    $onInit () {

    }

    showOriginalImg (e) {
        const img = document.getElementsByClassName('modal-img-tag')[0];
        img.src = e.target.src;

        this
            .ModalService
            .openModal('modal-show-img');
    }
}

export default desktopPageController;
