import JobsPage from './jobs-page.class.js';

class JobsPageController extends JobsPage {
    $onInit () {
        super.$onInit();

        if (this.company.RelatedProviderCompanys.length > 0) {
            this.hasRelatedProviderCompanies = true;
            this
                .selectedProviderToAdd = this.company.RelatedProviderCompanys[0];
        } else {
            this.hasRelatedProviderCompanies = false;
        }

        if (this.$stateParams.status) {
            this.currentState = this.$stateParams.status;
        }

        if (this.$stateParams.progressLevel) {
            this.currentState = `${this.$stateParams.status}.${this.$stateParams.progressLevel}`;
        }

        if (this.$stateParams.internalReview === 'true') {
            this.currentState = `${this.$stateParams.status}.internalReview`;
        }

        this.pageStart = 0,
        this.pageEnd   = this.PAGE_SIZE;

        this.viewJobs = this.jobs.slice(this.pageStart, this.pageEnd);
    }

    setPage (page) {
        this.pageStart = this.PAGE_SIZE * (page - 1);
        this.pageEnd   = this.pageStart + this.PAGE_SIZE;

        this.checkAll = false;
        this.toggleAllJobs();

        this.viewJobs = this.jobs.slice(this.pageStart, this.pageEnd);

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    flagForReview () {
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        let submitJobs   = [];

        markedJobs.forEach((index) => {
            let job = this.jobs[index];
            if (job.Status === this.JOB_STATUS.COMPLETED && job.InternalReview === false) {
                // TODO - Pop error message to user
                job.InternalReview = true;

                submitJobs.push(this.JobsService.put(job));
            }
        });

        this
            .$q
            .all(submitJobs)
            .then(() => {
                this.$state.transitionTo(this.$state.current, this.$stateParams, {reload : true, inherit : true, notify : true});
            });
    }

    submitToProvider () {
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        this.marked      = markedJobs.length;

        this
            .DialogService
            .openDialog(this.DIALOG.SUBMIT_TO_PROVIDER)
            .then((confirmation) => {
                let submitJobs = [];
                if (confirmation) {
                    markedJobs.forEach((index) => {
                        let job = this.jobs[index];
                        if (job.Status === this.JOB_STATUS.COMPLETED) {
                            // TODO - Pop error message to user
                            job.Status          = this.JOB_STATUS.SUBMITTED_TO_PROVIDER;
                            job.InternalReview  = false;
                            job.ProviderCompany = this.selectedProviderToAdd.ProviderRESNETId;

                            submitJobs.push(this.JobsService.put(job));
                        }
                    });

                    this
                        .$q
                        .all(submitJobs)
                        .then(() => {
                            this.$state.transitionTo(this.$state.current, this.$stateParams, {reload : true, inherit : true, notify : true});
                        });
                }
            });
    }

    delete () {
        let self         = this;
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        this.marked      = markedJobs.length;

        function canDeleteJob (job) {
            return (self.AuthorizationService.getUserRole().Admin === true
                && (job.Status === self.JOB_STATUS.ACTIVE || job.Status === self.JOB_STATUS.COMPLETED));
        }

        this
            .DialogService
            .openDialog(this.DIALOG.DELETE_JOB)
            .then((confirmation) => {
                if (confirmation) {
                    let deleteJobs   = [];

                    markedJobs.forEach((index) => {
                        let job = this.jobs[index];

                        if (canDeleteJob(job)) {
                            // TODO - Pop error message to user

                            deleteJobs.push(this.JobsService.delete(job));
                        }
                    });

                    this
                        .$q
                        .all(deleteJobs)
                        .then(() => {
                            this.$state.transitionTo(this.$state.current, this.$stateParams, {reload : true, inherit : true, notify : true});
                        });
                }
            });
    }

    archive () {
        let self         = this;
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        this.marked      = markedJobs.length;

        function canArchiveJob (job) {
            if (self.AuthorizationService.getUserRole().Admin === true) {
                if (job.Status === self.JOB_STATUS.ACTIVE || job.Status === self.JOB_STATUS.COMPLETED) {
                    return true;
                }
            } else if (self.AuthorizationService.getUserRole().Provider === true) {
                if (job.Status === self.JOB_STATUS.SUBMITTED_TO_PROVIDER) {
                    return true;
                }
            }

            return false;
        }

        this
            .DialogService
            .openDialog(this.DIALOG.ARCHIVE_JOB)
            .then((confirmation) => {
                if (confirmation) {
                    let archiveJobs   = [];

                    markedJobs.forEach((index) => {
                        let job = this.jobs[index];

                        if (canArchiveJob(job)) {
                            // TODO - Pop error message to user

                            archiveJobs.push(this.JobsService.archive(job));
                        }
                    });

                    this
                        .$q
                        .all(archiveJobs)
                        .then(() => {
                            this.$state.transitionTo(this.$state.current, this.$stateParams, {reload : true, inherit : true, notify : true});
                        });
                }
            });
    }


    putback () {
        let self = this;

        function canPutbackJob (job) {
            return (self.AuthorizationService.getUserRole().Provider === true || self.AuthorizationService.getUserRole().Admin === true);
        }

        const markedJobs    = this.jobsHandlers.getSelectedJobs();

        let putbackJobs   = [];

        markedJobs.forEach((index) => {
            let job = this.jobs[index];

            if (canPutbackJob(job)) {
                // TODO - Pop error message to user

                let type;

                switch (this.$stateParams.status) {
                case 'Deleted':
                    type = 'putbackDelete';
                    break;
                case 'Archived':
                    type = 'putbackArchive';
                    break;
                default:
                    type = '';
                }

                putbackJobs.push(this.JobsService.putback(job, type));
            }
        });

        this
            .$q
            .all(putbackJobs)
            .then(() => {
                this.$state.transitionTo(this.$state.current, this.$stateParams, {reload : true, inherit : true, notify : true});
            });
    }

    showPutBack () {
        if (this.userRole.Admin !== true && this.userRole.Provider !== true) {
            return false;
        }

        return (this.$stateParams.status === this.JOB_STATUS.DELETED || this.$stateParams.status === this.JOB_STATUS.ARCHIVED);
    }

    showArchive () {
        if (this.userRole.Admin !== true) {
            return false;
        }

        return (this.$stateParams.status === undefined || this.$stateParams.status === this.JOB_STATUS.ACTIVE || this.$stateParams.status === this.JOB_STATUS.COMPLETED);
    }

    /**
     * Can only be done by Admin, and only for jobs that have not yet been submitted to the Provider
     * @return {boolean} flag that determines whether to show delete button
     */
    showDelete () {
        if (this.userRole.Admin !== true) {
            return false;
        }

        return this.$stateParams.status === undefined || this.$stateParams.status === this.JOB_STATUS.ACTIVE || this.$stateParams.status === this.JOB_STATUS.COMPLETED;
    }

    enableEdit () {
        return (this.$stateParams.status !== 'Archived' && this.$stateParams.status !== 'Deleted');
    }

    enableWorkflow () {
        return (this.$stateParams.status !== this.JOB_STATUS.SUBMITTED_TO_PROVIDER && this.$stateParams.status !== this.JOB_STATUS.REGISTERED);
    }
}

export default JobsPageController;
