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
        // this.PRECISION = {
        //     CFM25     : 100,
        //     CFM25_CFA : 10000
        // };
    }

    $onInit () {
        this.showMrfEditModal = false;

        this.editMrfData = _assign({}, this.mrfData);

        this.leakageToOutside    = this.initLeakageToOutside();
        this.leakageTotal        = this.initLeakageTotal();

        this.calculateLeakageOutside();
        this.calculateLeakageTotal();
    }

    initLeakageToOutside () {
        let total         = parseFloat(this.editMrfData.TestedCFM25Out);
        let cfm25ofCFA    = this.calculateLeakageCfm25ofCFA(total);

        return {
            total,
            cfm25ofCFA
        };
    }

    initLeakageTotal () {
        let total             = parseFloat(this.editMrfData.TestedCFM25Total);
        let cfm25ofCFA        = this.calculateLeakageCfm25ofCFA(total);

        return {
            total,
            cfm25ofCFA
        };
    }

    calculateLeakageCfm25ofCFA (total) {
        let cfm25ofCFA = total / this.editMrfData.FloorAreaServed;

        return cfm25ofCFA;
    }

    calculateLeakageOutside () {
        this.leakageToOutside.cfm25ofCFA = this.calculateLeakageCfm25ofCFA(this.leakageToOutside.total);

        this.editMrfData.TestedCFM25Out = this.leakageToOutside.total;
    }

    calculateLeakageTotal () {
        this.leakageTotal.cfm25ofCFA = this.calculateLeakageCfm25ofCFA(this.leakageTotal.total);

        this.editMrfData.TestedCFM25Total = this.leakageTotal.total;
    }

    calculateLeakages () {
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
