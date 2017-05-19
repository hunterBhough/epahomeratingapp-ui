import _findIndex from 'lodash/findIndex';

class JobsPageController {
    constructor ($log, $rootScope, JobsService, CONTEXT, UI_ENUMS) {
        'ngInject';

        this.$log           = $log;
        this.$rootScope     = $rootScope;

        this.JobsService    = JobsService;

        this.CONTEXT_IS_APP = CONTEXT === UI_ENUMS.CONTEXT.APP;
        this.MESSAGING      = UI_ENUMS.MESSAGING;

        this.QUANTITY = {
            'ALL'      : 'All',
            'SELECTED' : 'Selected'
        };
    }

    $onInit () {
        this.filterCriteria = 'Jobs';

        this.availableOfflineListener
            = this
                .$rootScope
                .$on(this.MESSAGING.JOB_AVAILABLE_OFFLINE, (event, offline) => {
                    let jobIndex = _findIndex(this.jobs, {_id : offline.job});
                    if (offline.offlineAvailable) {
                        this.$log.log(`[jobs-page.controller.js] Enable offline job: ${offline.job}`);
                        this.JobsService.makeAvailableOffline(offline.job);
                    } else {
                        this.$log.log(`[jobs-page.controller.js] Disable offline job: ${offline.job}`);
                        this.JobsService.cancelAvailableOffline(offline.job);
                    }

                    if (jobIndex >= 0) {
                        this.jobs[jobIndex].offlineAvailable = offline.offlineAvailable;
                    }
                });

        this.refreshJobsListener
            = this
                .$rootScope
                .$on(this.MESSAGING.REFRESH_JOBS_LIST, (event) => {
                    this.jobs = {};
                    this.JobsService
                        .get()
                        .then((jobs) => {
                            this.jobs = jobs;
                        });
                });
    }

    $onDestroy () {
        this.availableOfflineListener();
        this.refreshJobsListener();
    }
}

export default JobsPageController;
