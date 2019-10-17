import _assign from 'lodash/assign';

class MrfEditController {
    constructor (DialogService, JobChecklistStateService, UI_ENUMS) {
        'ngInject';

        this.DialogService = DialogService;

        this.isReview      = JobChecklistStateService.isReview;
        this.UNITS         = {
            CFM25 : {
                Abbr  : 'CFM25',
                Title : 'cubic feet per minute needed to create a 25 Pascal pressure change'
            }
        };
        this.PRECISION = {
            CFM25     : 100,
            CFM25_CFA : 10000
        };
    }

    $onInit () {
    //   this.mrfDigest = [
    //     { Name: 'HVAC_ID' },
    //     { Name: 'Floor Area Served (sq ft)'},
    //     { Name: 'Htg. System Served'},
    //     { Name: 'Clg. System Served'},
    //     { Name: 'Tested CFM25 Out'},
    //     { Name: '# Return Grilles'},
    //     { Name: 'Tested CFM25 Total'},
    //   ];
    //   this.editMrfData = {
    //     "HvacID": "1",
	// 			"CoolingSystemServed": "1 - Central Unit",
	// 			"HeatingSystemServed": "1 - Natural Gas Furnace",
	// 			"TestedCFM25Out": "73.5",
	// 			"TestedCFM25Total": "73.5",
	// 			"AHUInstalledAtTest": "Yes",
	// 			"NumberOfReturns": "4",
	// 			"FactorySealedAHU": "Y",
	// 			"AirHandlerLocation": "2nd Floor",
	// 			"SupplyDuctRValue": "8",
	// 			"ReturnDuctRValue": "8",
	// 			"SupplyDuctArea": "206.2",
	// 			"ReturnDuctArea": "90.05",
	// 			"SupplyDuctLocation": "2nd Floor",
	// 			"ReturnDuctLocation": "2nd Floor",
	// 			"Comment": "null",
	// 			"CombinedHVACSystem": "False",
    //     "CondFloorArea": "8"
    //   }

        this.showMrfEditModal = false;

      this.editMrfData = _assign({}, this.mrfData);

      this.leakageToOutside    = this.initLeakageToOutside();
      this.leakageTotal        = this.initLeakageTotal();

      this.calculateLeakageOutside();
      this.calculateLeakageTotal();
    }

    initLeakageToOutside () {
        let ductLeakTotal = parseFloat(this.editMrfData.TestedCFM25Out);

        let total         = this.calculateInitialLeakageTotal(ductLeakTotal, this.PRECISION.CFM25);
        let cfm25ofCFA    = this.calculateLeakageCfm25ofCFA(ductLeakTotal, this.PRECISION.CFM25_CFA);

        return {
            total,
            cfm25ofCFA
        };
    }

    initLeakageTotal () {
        let ductLeakRealTotal = parseFloat(this.editMrfData.TestedCFM25Total);

        let total             = this.calculateInitialLeakageTotal(ductLeakRealTotal, this.PRECISION.CFM25);
        let cfm25ofCFA        = this.calculateLeakageCfm25ofCFA(ductLeakRealTotal, this.PRECISION.CFM25_CFA);

            console.warn('initLeakageTotal', this.editMrfData, total, cfm25ofCFA);
        return {
            total,
            cfm25ofCFA
        };
    }

    calculateInitialLeakageTotal (cfm25ofCFA, PRECISION_MULTIPLIER) {
        let total = cfm25ofCFA * this.editMrfData.FloorAreaServed;

        return Math.round(total * PRECISION_MULTIPLIER) / PRECISION_MULTIPLIER;
    }

    calculateLeakageCfm25ofCFA (total, PRECISION_MULTIPLIER) {
        console.warn('lskjfdsd',this.editMrfData.FloorAreaServed);
        let cfm25ofCFA = total / this.editMrfData.FloorAreaServed;

        return Math.round(cfm25ofCFA * PRECISION_MULTIPLIER) / PRECISION_MULTIPLIER;
    }

    calculateLeakageOutside () {
        this.leakageToOutside.cfm25ofCFA = this.calculateLeakageCfm25ofCFA(this.leakageToOutside.total, this.PRECISION.CFM25_CFA);
    }

    calculateLeakageTotal () {
        this.leakageTotal.cfm25ofCFA = this.calculateLeakageCfm25ofCFA(this.leakageTotal.total, this.PRECISION.CFM25_CFA);
    }

    calculateLeakages () {
        console.warn('fklajdsfajslllllllll');
        this.calculateLeakageOutside();
        this.calculateLeakageTotal();
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
