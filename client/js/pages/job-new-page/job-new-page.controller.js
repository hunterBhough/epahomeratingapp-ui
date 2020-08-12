/* global File */

import xmlToJSON from 'xmltojson';
import _find from 'lodash/find';


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

const HOUSE_PLAN_ERROR = {
    type        : 'error',
    text        : 'Please make sure Rating Files are the same type as the House Plan Type.',
    dismissable : false
};

class JobsNewPageController {
    constructor ($q, $log, $state, AnalyticsService, FileUtilityService, JobsService, HousePlansService, S3Service, S3_CONFIG, $timeout) {
        'ngInject';

        this.$q                = $q;
        this.$log              = $log;
        this.$state            = $state;
        this.$timeout          = $timeout;

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
      return this.$q((resolve, reject) => {
        const jobVendor = this.job.HousePlanVendor.Vendor;

        const checkHousePlanIsValid = (housePlan) => {
          if('xmlType' in housePlan) {
            switch(housePlan.xmlType) {
              case "rem":
                return jobVendor == 'REMRATE';
              case "energy":
                return jobVendor == 'ENERGYGAUGE';
            }
          } else {
            return jobVendor == 'REMRATE';
          }
        }
        const checkJsonIsValid = (json) => {
          if('ENERGYGAUGE' in json) {
            return jobVendor == 'ENERGYGAUGE';
          } else {
            return jobVendor == 'REMRATE';
          }
        }

        const iterator = (housePlans) => {
          if(housePlans.length < 1) {
            reject();
          }
          housePlans.forEach((housePlan) => {
            if('_id' in housePlan) {
              if (!checkHousePlanIsValid(_find(this.housePlans.housePlan, (o) => {
                  return o._id === housePlan._id;
              }))) {
                reject();
              }
            } else {
              let self = this;

              this.$timeout(() => {
                if(housePlan instanceof File) {
                  let reader = new FileReader();
                  reader.readAsText(housePlan);
                  reader.onloadend = () => {
                    if(!checkJsonIsValid(xmlToJSON.parseString(reader.result, {childrenAsArray : false}))) {
                      reject()
                    }
                  }
                }
              })
            }
          })
        }

        iterator(job.Primary.HousePlan);
        job.Secondary.forEach((location) => {
          iterator(location.HousePlan);
        })
        resolve();
      })

    }

    //TODO This only works properly if not a sample set.
    submitJob (job) {
        this.message = {};

        if (this.isBusy) {
            return;
        }

        this.housePlansAreValid(job)
          .then(() => {
            console.warn('[JobNewPageController] house plans are valid');
            this.isBusy = true;

            if (job.Primary.HousePlan[0] instanceof File) {
                this.sumbitJobWithLocalHousePlan(job);
            } else {
                console.warn('[JobNewPageController] submit library job');
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
          })
          .catch(() => {
            this.message = Object.assign({}, HOUSE_PLAN_ERROR);
          })
    }

    /**
     * After job files have been uploaded to s3, remap the File objects in the HvacDesignReport and RaterDesignReviewChecklist arrays
     * to the S3 key and filename
     *
     * @param {array} results of s3 uploads. includes the map to which file is being updated
     * @param {object} job object
     * @memberof JobsNewPageController
     */
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

    /**
     * If a
     *
     * @param {*} job
     * @memberof JobsNewPageController
     */
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
                window.scrollTo(0, 0);
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
                if (results.length === 0) {
                    throw 'error uploading house-plan';
                }
                this.updateJobFileData(results, job);

                return this.$q.all([
                    this.uploadLocalHousePlans(job.Primary.HousePlan),
                    ...job.Secondary.map(job => {
                        return this.uploadLocalHousePlans(job.HousePlan);
                    })
                ]);
            })
            .then(response => {
                let JobPlans = [];

                response.map((house) => {
                    let HousePlan = [];
                    for (let index in house) {
                        HousePlan.push({
                            _id  : house[index].data.docID,
                            Name : house[index].data.buildingName
                        });
                    }
                    JobPlans.push(HousePlan);
                });

                for (let index in JobPlans) {
                    if (index === 0) {
                        job.Primary.HousePlan = JobPlans[index];
                    } else {
                        job.Secondary[index - 1].HousePlan = JobPlans[index];
                    }
                }

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
                window.scrollTo(0, 0);
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
