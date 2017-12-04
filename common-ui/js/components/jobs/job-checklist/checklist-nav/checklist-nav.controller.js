class jobChecklistNavController {
    constructor ($rootScope, $state, $transitions, JobChecklistStateService, UI_ENUMS) {
        'ngInject';

        this.$state       = $state;
        this.$transitions = $transitions;
        this.STATE_NAME   = UI_ENUMS.STATE_NAME;

        this.CATEGORIES   = UI_ENUMS.CATEGORIES;
        this.MESSAGING    = UI_ENUMS.MESSAGING;

        this.JobChecklistStateService = JobChecklistStateService;

        this.updateChecklistResponseTotalsListener = $rootScope.$on(this.MESSAGING.UPDATE_CHECKLIST_RESPONSE_TOTALS, () => {
            this
                .JobChecklistStateService
                .getJobProgress()
                .then((progress)=> {
                    this.progress = progress;
                });
        });
    }

    $onInit () {
        this.setHidden();

        this
            .JobChecklistStateService
            .getJobProgress()
            .then((progress)=> {
                this.progress   = progress;
                this.categories = this.CATEGORIES;
            });

        this.deregisterOnFinish = this.$transitions.onSuccess(
            {to : 'job-checklist.*'}, () => {
                this.setHidden();
            }
        );
    }

    setHidden () {
        if (this.$state.current.name === this.STATE_NAME.JOB_CHECKLIST_STAGE) {
            this.hide = true;
        } else {
            this.hide = false;
        }
    }

    $onDestroy () {
        this.updateChecklistResponseTotalsListener();
        this.deregisterOnFinish();
    }
}

export default jobChecklistNavController;
