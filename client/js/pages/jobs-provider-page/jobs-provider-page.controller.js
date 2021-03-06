import _findIndex from 'lodash/findIndex';

import JobsPage from '../jobs-page/jobs-page.class.js';

class JobsProviderPageController extends JobsPage {
    $onInit () {
        super.$onInit();

        let raterCompanyIndex = 0;

        const related = this.relatedRaterCompanies.related.map((company) => {
            return Object.assign({}, {relationship : 'Current Rater Companies'}, company);
        });
        const past = this.relatedRaterCompanies.past.map((company) => {
            return Object.assign({}, {relationship : 'Previous Rater Companies'}, company);
        });

        this.relatedCompanies = related.concat(past);

        if (this.$stateParams.rater) {
            raterCompanyIndex = _findIndex(this.relatedCompanies, {
                O_ID : this.$stateParams.rater
            });
        }

        this.selectedRater = this.relatedCompanies[raterCompanyIndex];

        if (this.$stateParams.status) {
            this.currentState = this.$stateParams.status;
        }

        this.pageStart = 0,
        this.pageEnd   = this.PAGE_SIZE;

        this.viewJobs = this.jobs.slice(this.pageStart, this.pageEnd);
    }

    markJobRegistered (jobId) {
        let markedJobIndex = _findIndex(this.jobs, {
            _id : jobId
        });

        let job    = this.jobs[markedJobIndex];
        job.Status = this.JOB_STATUS.REGISTERED;

        this
            .JobsService
            .put(job, this.selectedRater.O_ID);
    }

    showMarkAsRegistered () {
        return (this.$stateParams.status !== 'Registered');
    }

    declineJob () {
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        this.marked      = markedJobs.length;

        this
            .DialogService
            .openDialog(this.DIALOG.DECLINE_JOB)
            .then((confirmation) => {
                let submitJobs = [];
                if (confirmation) {
                    markedJobs.forEach((index) => {
                        let job = this.viewJobs[index];
                        if (job.Status === this.JOB_STATUS.SUBMITTED_TO_PROVIDER) {
                            job.Status          = this.JOB_STATUS.COMPLETED;
                            job.ProviderCompany = undefined;

                            job
                                .History
                                .push(this.formatHistoryRecord({
                                    Category    : this.HISTORY.CATEGORIES.STATUS,
                                    Subcategory : this.HISTORY.SUBCATEGORIES.STATUS.DECLINED_BY_PROVIDER,
                                    Data        : this.company.Name
                                }));

                            submitJobs.push(this.JobsService.put(job, this.selectedRater.O_ID));
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

    //TODO consider moving this to the jobs service since this is similar to the markAsRegistered method in job-checklist-state.service
    markAsRegistered () {
        const markedJobs = this.jobsHandlers.getSelectedJobs();
        let submitJobs   = [];

        markedJobs.forEach((index) => {
            let job = this.viewJobs[index];
            if (job.Status === this.JOB_STATUS.SUBMITTED_TO_PROVIDER) {
                // TODO - Pop error message to user
                job.Status = this.JOB_STATUS.REGISTERED;

                job
                    .History
                    .push(this.formatHistoryRecord({
                        Category    : this.HISTORY.CATEGORIES.STATUS,
                        Subcategory : this.HISTORY.SUBCATEGORIES.STATUS.REGISTERED,
                        Data        : this.company.Name
                    }));

                submitJobs.push(this.JobsService.put(job, this.selectedRater.O_ID));
            }
        });

        this
            .$q
            .all(submitJobs)
            .then(() => {
                this
                    .$state
                    .transitionTo(
                        this.$state.current,
                        this.$stateParams,
                        {reload : true, inherit : true, notify : true}
                    );
            });
    }

    handleRatingCompanyChange () {
        this.$timeout(() => {
            this
                .$state
                .go(this.STATE_NAME.JOBS_PROVIDER_SEARCH, {rater : this.selectedRater.O_ID});
        }, 0);
    }
}

export default JobsProviderPageController;
