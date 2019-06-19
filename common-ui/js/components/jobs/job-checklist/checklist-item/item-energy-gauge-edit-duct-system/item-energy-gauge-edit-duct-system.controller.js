import _assign from 'lodash/assign';

class MrfEditController {
    constructor (DialogService, JobChecklistStateService, UI_ENUMS) {
        'ngInject';

        this.isReview      = JobChecklistStateService.isReview;
        this.PLACEHOLDER   = {
          STRING : 'PLACEHOLDER',
          BOOLEAN : true,
          DECIMAL : 1.2,
        }
    }

    $onInit () {
      this.mrfDigest = [
        { Name: 'HVAC_ID' },
        { Name: 'Floor Area Served (sq ft)'},
        { Name: 'Htg. System Served'},
        { Name: 'Clg. System Served'},
        { Name: 'Tested CFM25 Out'},
        { Name: '# Return Grilles'},
      ]
    }
}

export default MrfEditController;
