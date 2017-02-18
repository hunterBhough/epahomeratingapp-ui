import _findIndex from 'lodash/findIndex';
import _forEach from 'lodash/forEach';

class JobsChecklistPageController {
    constructor ($rootScope, JobsService, JobDataResponseService, UI_ENUMS) {
        'ngInject';

        this.$rootScope             = $rootScope;

        this.JobsService            = JobsService;
        this.JobDataResponseService = JobDataResponseService;
        this.MESSAGING              = UI_ENUMS.MESSAGING;
        this.JOB_STATUS             = UI_ENUMS.JOB_STATUS;
        this.RESPONSES              = UI_ENUMS.RESPONSES;

        this.responseListener = this.$rootScope.$on(this.MESSAGING.UPDATE_CHECKLIST_RESPONSE, (event, response) => {
            this.updateChecklistResponse(response);
        });

        this.postCommentListener = this.$rootScope.$on(this.MESSAGING.POST_COMMENT, (event, comment) => {
            this.postComment(comment);
        });

        this.housePhotoListener = this.$rootScope.$on(this.MESSAGING.UPDATE_HOUSE_PHOTO, (event, photoData) => {
            this.updateHousePhoto(photoData);
        });
    }

    $onInit () {
        //TODO: make this better
        this.RatingTypeLabel = (this.job.RatingType === 'energy-star') ? 'Energy Star' : 'HERS Rating';

        this.houses              = {
            Primary   : this.job.Primary,
            Secondary : this.job.Secondary
        };

        this.jobIsActive = (this.job.Status === this.JOB_STATUS.ACTIVE);

        //TODO: this belongs in a directive
        this.showActionsDropDown = false;
        this.showCompleteModal   = false;
        this.showDownloadModal   = false;

        this.checklistItemsQuantity = this.job.Progress.PreDrywall.Total + this.job.Progress.Final.Total;
        this.setProgressStatus();
    }

    $onDestroy () {
        // unregister listeners
        this.responseListener();
        this.postCommentListener();
        this.housePhotoListener();
    }

    putJobData () {
        this
            .JobsService
            .put(this.job);
    }

    putJobDataResponse () {
        this
            .JobDataResponseService
            .put(this.jobDataResponse);
    }

    getRatingTypeClass () {
        //TODO: make this better
        return (this.job.RatingType === 'energy-star') ? 'label-energy-star' : 'label-hers-rating';
    }

    updateHousePhoto (photoData) {
        let secondaryIndex;

        if (this.job.Primary.HouseId === photoData.HouseId) {
            this.job.Primary.Photo = [photoData.photo];
        } else {
            secondaryIndex = _findIndex(this.job.Secondary, {HouseId : photoData.HouseId});

            this.job.Secondary[secondaryIndex].Photo = [photoData.photo];
        }

        this.putJobData();
    }

    updateChecklistResponse (response) {
        let updateResponse = (response.Response.length === 0) ? undefined : response.Response;

        this.updateChecklistResponseTotals(response);
        this.updateJobResponseTotals();
        this.setProgressStatus();

        this.jobDataResponse.ChecklistItems[response.Category][response.CategoryProgress][response.ItemId].Response = updateResponse;

        this.putJobDataResponse();

        this.putJobData();
    }

    postComment (comment) {
        this.jobDataResponse.ChecklistItems[comment.Category][comment.CategoryProgress][comment.ItemId].Comments.push(comment.Comment);

        this.putJobDataResponse();
    }

    //TODO: all dropdown stuff belongs in a directive
    toggleDropDown () {
        this.showActionsDropDown = !this.showActionsDropDown;
    }

    //TODO: all dropdown stuff belongs in a directive
    hideDropDown () {
        this.showActionsDropDown = false;
    }

    //TODO: all modal stuff belongs in a directive
    toggleModal () {
        this.showCompleteModal = !this.showCompleteModal;
    }

    //TODO: all modal stuff belongs in a directive
    hideModal () {
        this.showCompleteModal = false;
    }

    //TODO: all modal stuff belongs in a directive
    toggleModalDownload () {
        this.showDownloadModal = !this.showDownloadModal;
    }

    //TODO: all modal stuff belongs in a directive
    hideModalDownload () {
        this.showDownloadModal = false;
    }

    completeJob () {
        if (this.totalRemaining === 0 && this.mustCorrectItems === 0) {
            this.job.Status = this.JOB_STATUS.INTERNAL_REVIEW;
            this.jobIsActive = false;

            this.putJobData();
        } else {
            this.showCompleteModal = true;
        }
    }

    setProgressStatus () {
        let jobProgress = this.job.Progress;

        let totalChecklistItems   = jobProgress.PreDrywall.Total + jobProgress.Final.Total;
        let verifiedItems         = jobProgress.PreDrywall.Verified + jobProgress.Final.Verified;
        let mustCorrectItems      = jobProgress.PreDrywall.MustCorrect + jobProgress.Final.MustCorrect;

        this.mustCorrectItems = mustCorrectItems;
        this.totalRemaining   = (totalChecklistItems) - (verifiedItems + mustCorrectItems);
    }

    updateChecklistResponseTotals (response) {
        let currentResponse = this.jobDataResponse.ChecklistItems[response.Category][response.CategoryProgress][response.ItemId].Response;
        let currentResponseValue = (currentResponse === undefined) ? currentResponse : currentResponse[0];

        let updateResponse = response.Response[0];

        if (currentResponseValue === undefined && updateResponse === this.RESPONSES.MustCorrect.Key) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].MustCorrect += 1;
        } else if (currentResponseValue === undefined) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].Verified += 1;
        } else if (currentResponseValue === this.RESPONSES.MustCorrect.Key && updateResponse !== this.RESPONSES.MustCorrect.Key) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].MustCorrect -= 1;
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].Verified += 1;
        } else if (currentResponseValue !== this.RESPONSES.MustCorrect.Key && updateResponse === this.RESPONSES.MustCorrect.Key) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].Verified -= 1;
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].MustCorrect += 1;
        } else if (currentResponseValue === this.RESPONSES.MustCorrect.Key && updateResponse === undefined) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].MustCorrect -= 1;
        } else if (currentResponseValue !== this.RESPONSES.MustCorrect.Key && updateResponse === undefined) {
            this.jobDataResponse.Progress[response.Category][response.CategoryProgress].Verified -= 1;
        }

        this.$rootScope.$broadcast(this.MESSAGING.UPDATE_CHECKLIST_RESPONSE_TOTALS, this.jobDataResponse.Progress);
    }

    onDownloadRequest () {
        this.hideDropDown();

        this.JobsService
            .getExportSignedUrl(this.job._id)
            .then((response) => {
                this.downloadUrl = response;
                this.toggleModalDownload();
            });
    }

    updateJobResponseTotals (response) {
        let jobProgress = this.job.Progress;
        let jobChecklistResponseProgress = this.jobDataResponse.Progress;

        jobProgress.PreDrywall.Verified = 0;
        _forEach(jobChecklistResponseProgress, function sumPreDrywallVerified (value) {
            jobProgress.PreDrywall.Verified += value.PreDrywall.Verified;
        });

        jobProgress.PreDrywall.MustCorrect = 0;
        _forEach(jobChecklistResponseProgress, function sumFinalVerified (value) {
            jobProgress.PreDrywall.MustCorrect += value.PreDrywall.MustCorrect;
        });

        jobProgress.Final.Verified = 0;
        _forEach(jobChecklistResponseProgress, function sumMustCorrectVerified (value) {
            jobProgress.Final.Verified += value.Final.Verified;
        });

        jobProgress.Final.MustCorrect = 0;
        _forEach(jobChecklistResponseProgress, function sumFinalVerified (value) {
            jobProgress.Final.MustCorrect += value.Final.MustCorrect;
        });
    }

    //TODO: determine if we need user friendly ID in addition to DB id.
    get id () {
        return this.job._id.substring(0, 8).toUpperCase();
    }
}

export default JobsChecklistPageController;
