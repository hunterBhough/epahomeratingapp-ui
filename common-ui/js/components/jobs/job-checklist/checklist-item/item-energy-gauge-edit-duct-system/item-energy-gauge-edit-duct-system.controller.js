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
      ];
      this.editMrfData = {
        "HvacID": "1",
				"CoolingSystemServed": "1 - Central Unit",
				"HeatingSystemServed": "1 - Natural Gas Furnace",
				"TestedCFM25Out": "73.5",
				"TestedCFM25Total": "73.5",
				"AHUInstalledAtTest": "Yes",
				"NumberOfReturns": "4",
				"FactorySealedAHU": "Y",
				"AirHandlerLocation": "2nd Floor",
				"SupplyDuctRValue": "8",
				"ReturnDuctRValue": "8",
				"SupplyDuctArea": "206.2",
				"ReturnDuctArea": "90.05",
				"SupplyDuctLocation": "2nd Floor",
				"ReturnDuctLocation": "2nd Floor",
				"Comment": "null",
				"CombinedHVACSystem": "False"
      }
    }
}

export default MrfEditController;
