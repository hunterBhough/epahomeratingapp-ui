import _assign from 'lodash/assign';

class MrfEditController {
    constructor (DialogService, JobChecklistStateService, UI_ENUMS) {
        'ngInject';

        this.JobChecklistStateService = JobChecklistStateService;
        this.isReview      = JobChecklistStateService.isReview;
        this.PLACEHOLDER   = {
          STRING : 'PLACEHOLDER',
          BOOLEAN : true,
          DECIMAL : 1.2,
        }

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
      const ACHITECTURAL_CHARACTERISTICS_ID = 'BE 1';

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

      this.editMrfData = {
        "TestDate": "1/3/2018",
				"SinglePointFlow": "774",
				"SinglePointPressure": "50",
				"SiteAmbientTemp": "null",
				"IndoorTemp": "null",
				"SiteElevation": "null",
				"BasePressure": "null",
				"PressureDepressure": "null",
				"BuildingPressure": "774",
				"AltitudeTempAdjustment": "null",
				"TenPercentSinglePointPenalty": "null"
      }

      //TODO: get this from JobChecklistStateService
      this.BuildingVolume = "33206";

      let heatingSeasonValue = this.editMrfData['SinglePointFlow'];

      this.infiltrationValue = heatingSeasonValue;
      this.ACH50  = this.calculateAch50();
    }

    calculateAch50 () {
        let ach50 = (this.infiltrationValue / this.BuildingVolume) * 60;

        return Math.round(ach50 * this.PRECISION.ACH50) / this.PRECISION.ACH50;
    }

    calculateInfiltrationValue () {
        this.ACH50 = this.calculateAch50();

        this.editMrfData.HeatingSeasonValue = this.infiltrationValue;
        this.editMrfData.CoolingSeasonValue = this.infiltrationValue;
        this.editMrfData.AnnualValue        = this.infiltrationValue;
    }
}

export default MrfEditController;
