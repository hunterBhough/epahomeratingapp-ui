/* global File */

const ERROR_SERVER = {
    type        : 'error',
    text        : 'There was an error processing your request. Please try again.',
    dismissable : false
};

const SUCCESS = {
    type        : 'success',
    text        : 'Job Created.',
    dismissable : false
};

const HOUSE_PLAN_REQUIRED = {
    type        : 'error',
    text        : 'Please add a Rating File to all samples.',
    dismissable : false
};

class JobsNewPageController {
    constructor ($q, $log, $state, AnalyticsService, FileUtilityService, JobsService, HousePlansService, S3Service, S3_CONFIG) {
        'ngInject';

        this.$q                = $q;
        this.$log              = $log;
        this.$state            = $state;

        this.AnalyticsService   = AnalyticsService;
        this.FileUtilityService = FileUtilityService;
        this.JobsService        = JobsService;
        this.HousePlansService  = HousePlansService;
        this.S3Service          = S3Service;
        this.PDF_FILE_PATH      = S3_CONFIG.PATH_PDF;
    }

    $onInit () {
        this.message = {};
    }

    /**
     * Validates that house plan is selected for every sample in job on save
     *
     * @param {object} job job blob
     */
    housePlansAreValid (job) {
        let housePlansValid = true;

        if (job.Primary.HousePlan.length < 1) {
            housePlansValid = false;
        }

        job
            .Secondary
            .forEach((location) => {
                if (location.HousePlan.length < 1) {
                    housePlansValid = false;
                }
            });

        return housePlansValid;
    }

    //TODO This only works properly if not a sample set.
    submitJob (job) {
        this.message = {};

        if (this.isBusy) {
            return;
        }

        if (this.housePlansAreValid(job)) {
            this.isBusy = true;

            if (job.Primary.HousePlan[0] instanceof File) {
                this.sumbitJobWithLocalHousePlan(job);
            } else {
                this.submitJobWithLibrarayHousePlan(job);
            }

            this
                .AnalyticsService
                .trackEvent({
                    Category : 'job',
                    Action   : 'new',
                    Label    : '',
                    Value    : ''
                });
        } else {
            this.message = Object.assign({}, HOUSE_PLAN_REQUIRED);
        }
    }

    updateJobFileData (results, job) {
        results.forEach((result) => {
            if (this.jobFileMap[result.data.request.token]) {
                const map      = this.jobFileMap[result.data.request.token];

                const fileName = result.data.request.fileName;
                const key      = result.data.s3Response.key;

                if (map.type === 'Primary') {
                    job[map.type][map.fileType][map.fileIndex] = {
                        Name : fileName,
                        Key  : key
                    };
                } else {
                    job[map.type][map.index][map.fileType][map.fileIndex] = {
                        Name : fileName,
                        Key  : key
                    };
                }
            }
        });
    }

    submitJobWithLibrarayHousePlan (job) {
        const jobFileMeta = this.FileUtilityService.gatherJobFiles(job);

        let jobFiles    = jobFileMeta.jobFiles;
        this.jobFileMap = jobFileMeta.jobFileMap;
        let fileUploads = [];

        jobFiles.forEach((file) => {
            fileUploads.push(this.S3Service.upload(this.PDF_FILE_PATH, file.file, file.token));
        });

        this
            .$q
            .all(fileUploads)
            .then((results) => {
                this.updateJobFileData(results, job);

                return this.JobsService.post(job);
            })
            .then(response => {
                this.message = Object.assign({}, SUCCESS);
                this.$state.go('jobs');
            })
            .catch(error => {
                this.message = Object.assign({}, ERROR_SERVER);
            })
            .finally(() => {
                this.isBusy = false;
            });
    }

    sumbitJobWithLocalHousePlan (job) {
        this.$log.log('Uploading Rating File');

        const jobFileMeta = this.FileUtilityService.gatherJobFiles(job);

        let jobFiles    = jobFileMeta.jobFiles;
        this.jobFileMap = jobFileMeta.jobFileMap;
        let fileUploads = [];

        jobFiles.forEach((file) => {
            fileUploads.push(this.S3Service.upload(this.PDF_FILE_PATH, file.file, file.token));
        });

        this
            .$q
            .all(fileUploads)
            .then((results) => {
                this.updateJobFileData(results, job);

                return this.uploadLocalHousePlans(job.Primary.HousePlan);
            })
            .then(response => {
                let HousePlan = [];
                for (let index in response) {
                    HousePlan.push({
                        _id  : response[index].data.docID,
                        Name : response[index].data.buildingName
                    });
                }

                job.Primary.HousePlan = HousePlan;
                this.$log.log('Posting Job');

                return this.JobsService.post(job);
            })
            .then(response => {
                this.message = Object.assign({}, SUCCESS);
                this.$state.go('jobs');
            })
            .catch(error => {
                this.$log.log('Create job with local rating file error');
                this.$log.log(error);
                this.message = Object.assign({}, ERROR_SERVER);

                if (error.message) {
                    this.message.text = error.message;
                }

                if (error.reason) {
                    this.message.text += '. ' + error.reason;
                }
                this.deleteLocalHousePlans(job.Primary.HousePlan);
            })
            .finally(() => {
                this.isBusy = false;
            });
    }

    // upload house plan as temp use
    uploadLocalHousePlans (files) {
        const uploadLocalHousePlanPromises = files.map((file) => {
            let formData = new window.FormData();
            formData.append('filedata', file, file.name);
            return this.HousePlansService.post(formData, 'temporary');
        });
        return this.$q.all(uploadLocalHousePlanPromises);
    }

    deleteLocalHousePlans (files) {
        const deleteLocalHousePlanPromises = files.map((file) => {
            return this.HousePlansService.delete(file);
        });
        return this.$q.all(deleteLocalHousePlanPromises);
    }
}

export default JobsNewPageController;
