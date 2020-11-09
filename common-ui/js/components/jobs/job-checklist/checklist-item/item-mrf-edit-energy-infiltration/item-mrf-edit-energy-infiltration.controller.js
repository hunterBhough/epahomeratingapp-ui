import _assign from 'lodash/assign';

class MrfEditController {
    constructor (DialogService, JobChecklistStateService, UI_ENUMS) {
        'ngInject';

        this.JobChecklistStateService = JobChecklistStateService;
        this.isReview      = JobChecklistStateService.isReview;
        this.PLACEHOLDER   = {
            STRING  : 'PLACEHOLDER',
            BOOLEAN : true,
            DECIMAL : 1.2,
        };

        this.infiltrationDisplayData = {
            'Name'               : 'Infiltration Value',
            'ConnectedAttribute' : true,
            'DataType'           : {
                'Type' : 'Integer',
                'Name' : 'int_99999'
            },
            'Key'                : 'InfiltrationValue',
            'Locked'             : false,
            'IsLibraryAttribute' : false,
            'Unit'               : {
                'Abbr'  : 'CFM50',
                'Title' : 'cubic feet per minute needed needed to create a change in building pressure of 50 Pascals'
            }
        };

        this.PRECISION = {
            ACH50     : 100
        };
    }

    $onInit () {
        this.editMrfData       = _assign({}, this.mrfData);

        this.showMrfEditModal  = false;

        this
            .JobChecklistStateService
            .getChecklistItemHomePerformance('BE 1a')
            .then((mrfData) => {
                this.BuildingVolume = mrfData.projectRecord[0].condVolume;
                // eslint-disable-next-line radix
                this.infiltrationValue = parseInt(this.editMrfData['SinglePointFlow']);
                this.ACH50 = this.calculateAch50();

            });

    }

    $postLink () {
        this.showMrfEditModal = true;

        //TODO: put this somewhere better;
        angular
            .element(document)
            .find('body')
            .addClass('overlay-open');
    }

    calculateAch50 () {
        let ach50 = (this.infiltrationValue / this.BuildingVolume) * 60;

        return Math.round(ach50 * this.PRECISION.ACH50) / this.PRECISION.ACH50;
    }

    calculateInfiltrationValue () {
        this.ACH50 = this.calculateAch50();
        this.editMrfData.SinglePointFlow = this.infiltrationValue;
    }

    $postLink () {
        this.showMrfEditModal = true;

        //TODO: put this somewhere better;
        angular
            .element(document)
            .find('body')
            .addClass('overlay-open');
    }

    cancel () {
        this.showMrfEditModal = false;
        this.onCancelMrfRow();

        //TODO: put this somewhere better;
        angular
            .element(document)
            .find('body')
            .removeClass('overlay-open');
    }

    save () {
        if (!this.mrfEditForm.$invalid) {
            this.showMrfEditModal = false;

            this.onSaveMrfRow({
                mrfRowEditData : this.editMrfData
            });

            //TODO: put this somewhere better;
            angular
                .element(document)
                .find('body')
                .removeClass('overlay-open');
        }
    }
}

export default MrfEditController;
