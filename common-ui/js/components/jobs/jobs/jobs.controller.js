class JobsController {
    constructor (
        $window,
        $scope,
        $state,
        $http,
        $rootScope,
        JobsService,
        jobTitleFilter,
        ModalService,
        CONTEXT,
        UI_ENUMS
    ) {
        'ngInject';

        this.CONTEXT_IS_ADMIN = CONTEXT === UI_ENUMS.CONTEXT.ADMIN;

        this.$http            = $http;
        this.$state           = $state;
        this.$scope           = $scope;
        this.$rootScope       = $rootScope;

        this.jobTitleFilter   = jobTitleFilter;
        this.JobsService      = JobsService;
        this.ModalService     = ModalService;

        this.JOB_STATUS       = UI_ENUMS.JOB_STATUS;
        this.MESSAGING        = UI_ENUMS.MESSAGING;
        this.MODAL_OPEN_JOB   = UI_ENUMS.MODAL.OPEN_JOB;

        this.markedJobs       = [];
        this.downloadingRem   = false;

        this.STATE_NAME       = UI_ENUMS.STATE_NAME;
        this.currentStateName = this.$state.current.name;

        this.jobToOpen        = {};
    }

    $onInit () {
        this.filterCriteria = 'Jobs';

        for (let i = 0; i < this.jobs.length; i++) {
            this.markedJobs.push(false);
        }

        this.registerHandlers({
            toggleAllJobs   : this.toggleAllJobs.bind(this),
            getSelectedJobs : this.getSelectedJobs.bind(this)
        });
    }

    $onChanges (changes) {
        this.jobs = changes.jobs.currentValue;
    }

    downloadXml (jobId) {
        this.onDownloadXml({
            jobId
        });
    }

    markJobRegisterd (jobId) {
        this.onMarkJobAsRegistered({
            jobId
        });
    }

    setBulkOperationStatus () {
        this.onSetBulkOperationStatus({
            status : this.jobsAreSelected()
        });
    }

    getSelectedJobs () {
        let filteredMarkedJobs = [];

        this.markedJobs.forEach((isMarked, index) => {
            if (isMarked) {
                filteredMarkedJobs.push(index);
            }
        });

        return filteredMarkedJobs;
    }

    jobsAreSelected () {
        let markedJobsIndex = this.markedJobs.length - 1;
        let markedJob       = false;

        while (!markedJob && (markedJobsIndex + 1)) {
            markedJob = this.markedJobs[markedJobsIndex];
            markedJobsIndex -= 1;
        }

        return markedJob;
    }

    toggleAllJobs (checkAll) {
        for (let i = 0; i < this.markedJobs.length; i++) {
            this.markedJobs[i] = checkAll;
        }

        this.onSetBulkOperationStatus({
            status : checkAll
        });
    }

    sampleTitle (sampleAddressInformation) {
        return this.jobTitleFilter(sampleAddressInformation);
    }

    openJob (job) {
        this.jobToOpen = job;

        this.jobToOpenSamples = [this.jobToOpen.Primary].concat(this.jobToOpen.Secondary);
        this.jobIndex = 1;

        this
            .ModalService
            .openModal(this.MODAL_OPEN_JOB);
    }

    modalOpenJobPrevious () {
        this.jobIndex = Math.max(this.jobIndex - 1, 1);
    }

    modalOpenJobNext () {
        this.jobIndex = Math.min(this.jobIndex + 1, this.jobToOpenSamples.length);
    }

    modalOpenJobFinish () {
        this
            .ModalService
            .closeModal(this.MODAL_OPEN_JOB);
    }
}

export default JobsController;
