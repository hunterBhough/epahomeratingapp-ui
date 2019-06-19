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
        { Name: 'Single Point Flow (CFM)' },
        { Name: 'Shelter Class' },
        { Name: 'Test Date'},
        { Name: 'Single Point Pressure (pa)'},
        { Name: 'Site Ambient Temp (F)'},
        { Name: 'Indoor Temp (F)'},
        { Name: 'Site Elevation (ft)'},
        { Name: 'Base Pressure (pa)'},
        { Name: 'Pressure/Depressure'},
        { Name: 'Building Pressure'},
        { Name: 'Altitude and Temp adjustment made by:'},
        { Name: '10% single-point penalty was added by:'},
      ]
    }
}

export default MrfEditController;
