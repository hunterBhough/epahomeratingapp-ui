/* global File */
let _findIndex = require('lodash/findIndex');

const ERROR_SERVER = {
    type        : 'error',
    text        : 'There was an error processing your request. Please try again.',
    dismissable : false
};

class HousePlanController {
    constructor ($log, $q, $rootScope, $state, HousePlansService, S3Service, UI_ENUMS) {
        'ngInject';

        this.$log                 = $log;
        this.$q                   = $q;
        this.$rootScope           = $rootScope;
        this.$state               = $state;

        this.HousePlansService    = HousePlansService;
        this.S3Service            = S3Service;
        this.MESSAGING            = UI_ENUMS.MESSAGING;
        this.isBusy               = false;
    }

    /**
     * Check if file is PDF and less than 2 MB
     * @param  {File}      file file to validify
     * @return {Boolean}   validity
     */
    isValidFile (file) {
        return file.type === 'application/pdf' && ((file.size / 1048576) < 2);
    }

    //TODO: Either move this to a house-plan-edit class or into the filemanager
    updateHvacDesignReports (files) {
        files.forEach((file) => {
            const fileName = file.data.request.fileName;
            const key      = file.data.s3Response.key;

            const hvacDesignReportIndex = _findIndex(this.housePlan.HvacDesignReport, {name : fileName});

            if (hvacDesignReportIndex >= 0) {
                this.housePlan.HvacDesignReport[hvacDesignReportIndex] = {
                    Key  : key,
                    Name : fileName
                };
            }
        });
    }

    //TODO: Either move this to a house-plan-edit class or into the filemanager
    updateRaterDesignReviewChecklist (files) {
        files.forEach((file) => {
            const fileName = file.data.request.fileName;
            const key      = file.data.s3Response.key;

            const hvacRaterDesignReviewChecklist = _findIndex(this.housePlan.RaterDesignReviewChecklist, {name : fileName});

            if (hvacRaterDesignReviewChecklist >= 0) {
                this.housePlan.RaterDesignReviewChecklist[hvacRaterDesignReviewChecklist] = {
                    Key  : key,
                    Name : fileName
                };
            }
        });
    }

    onSubmit () {
        this.message = {};
        this.isBusy  = true;

        let hvacDesignReportUploads            = [];
        let raterDesignReviewChecklistUploads  = [];
        const path                             = 'pdfs';

        this.housePlan.HvacDesignReport.forEach((hvacDesignReport) => {
            if (hvacDesignReport instanceof File && this.isValidFile(hvacDesignReport)) {
                hvacDesignReportUploads.push(this.S3Service.upload(path, hvacDesignReport));
            }
        });

        this.housePlan.RaterDesignReviewChecklist.forEach((raterDesignReviewChecklist) => {
            if (raterDesignReviewChecklist instanceof File && this.isValidFile(raterDesignReviewChecklist)) {
                raterDesignReviewChecklistUploads.push(this.S3Service.upload(path, raterDesignReviewChecklist));
            }
        });

        this
            .$q
            .all(hvacDesignReportUploads)
            .then((result) => {
                this.updateHvacDesignReports(result);

                return this.$q.all(raterDesignReviewChecklistUploads);
            })
            .then((result) => {
                this.updateRaterDesignReviewChecklist(result);

                return this.HousePlansService.put(this.housePlan);
            })
            .then((response) => {
                this.$rootScope.$emit(this.MESSAGING.HOUSE_PLAN_UPDATE, this.housePlan);

                this.$state.go('^');
            })
            .catch((error) => {
                this.message = Object.assign({}, ERROR_SERVER);
            })
            .finally(() => {
                this.isBusy = false;
            });
    }

    deleteHousePlan () {
        this.message = {};
        this.isBusy  = true;

        this.HousePlansService
            .delete(this.housePlan)
            .then((response) => {
                this.$rootScope.$emit(this.MESSAGING.HOUSE_PLAN_DELETE, this.housePlan);

                this.$state.go('^');
            })
            .catch((error) => {
                this.message = Object.assign({}, ERROR_SERVER);
            })
            .finally(() => {
                this.isBusy = false;
            });
    }
}

export default HousePlanController;
