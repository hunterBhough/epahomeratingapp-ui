import _defer from 'lodash/defer';

let _forEach   = require('lodash/forEach');
let JSZip      = require('jszip');
let FileSaver  = require('file-saver');

let xmlDownloadMessage = {
    notDownloading : 'Download XML',
    downloading    : 'Generating XML'
};

class JobsPage {
    constructor (
        $http,
        $q,
        $state,
        $stateParams,
        $scope,
        $timeout,
        $window,
        AuthenticationService,
        AuthorizationService,
        DialogService,
        JobHistoryService,
        JobsService,
        UserCompanyService,
        UI_ENUMS,
        PAGINATION,
        jobTitleFilter
    ) {
        'ngInject';

        this.$http                 = $http;
        this.$q                    = $q;
        this.$state                = $state;
        this.$stateParams          = $stateParams;
        this.$scope                = $scope;
        this.$timeout              = $timeout;
        this.$window               = $window;
        this.AuthenticationService = AuthenticationService;
        this.AuthorizationService  = AuthorizationService;
        this.DialogService         = DialogService;
        this.JobHistoryService     = JobHistoryService;
        this.JobsService           = JobsService;
        this.UserCompanyService    = UserCompanyService;
        this.jobTitleFilter        = jobTitleFilter;

        this.DIALOG               = UI_ENUMS.DIALOG;
        this.JOB_STATUS           = UI_ENUMS.JOB_STATUS;
        this.STATE_NAME           = UI_ENUMS.STATE_NAME;
        this.PAGE_SIZE            = PAGINATION.PAGE_SIZE;
        this.HISTORY              = {
            CATEGORIES    : UI_ENUMS.HISTORY_CATEGORIES,
            SUBCATEGORIES : UI_ENUMS.HISTORY_SUBCATEGORIES
        };

        this.xmlDownloadButtonMessage = xmlDownloadMessage.notDownloading;
    }

    $onInit () {
        this.checkAll              = false;
        this.bulkOperationsEnabled = false;

        this.userRole              = this.AuthorizationService.getUserRole();

        this.$window.sessionStorage.setItem('filter.param', JSON.stringify(this.$stateParams));
    }

    setPage (page) {
        this.pageStart = this.PAGE_SIZE * (page - 1);
        this.pageEnd   = this.pageStart + this.PAGE_SIZE;

        this.checkAll = false;
        this.toggleAllJobs();
        this.$timeout(this.viewJobs = this.jobs.slice(this.pageStart, this.pageEnd));

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    appendFilterParams (jobSearchParams) {
        if (!jobSearchParams) {
            jobSearchParams = {};
        }

        // persist filter across job tabs
        jobSearchParams.builder     = this.$stateParams.builder;
        jobSearchParams.housePlan   = this.$stateParams.housePlan;
        jobSearchParams.jobType     = this.$stateParams.jobType;
        jobSearchParams.keywords    = this.$stateParams.keywords;
        jobSearchParams.mustCorrect = this.$stateParams.mustCorrect;
        jobSearchParams.ratingType  = this.$stateParams.ratingType;

        return jobSearchParams;
    }

    generateFileName (job) {
        let housePlanName = job.Primary.HousePlan[0].Name;
        let addressObj    = job.Primary.AddressInformation;
        let address       = `${addressObj.Address1}${addressObj.CityMunicipality}${addressObj.StateCode}${addressObj.ZipCode}`;

        housePlanName     = housePlanName.replace(/[^\w\s]/gi, '-');
        address           = address.replace(/[^\w\s]/gi, '-');

        return `${housePlanName}${address}`;
    }

    getExportFileName (index) {
        let exportFileName = this.viewJobs[index].Primary.ExportFilename;
        if (exportFileName === '' || exportFileName === undefined) {
            exportFileName = this.generateFileName(this.viewJobs[index]);
        }
        return exportFileName;
    }

    downloadSingleXML (markedJobIndex) {
        this.failedDownloads = [];
        let downloadJob = this.viewJobs[markedJobIndex];

        let downloadTask = {
            jobID           : downloadJob._id,
            ratingCompanyID : this.selectedRater ? this.selectedRater.O_ID : undefined
        };

        this.JobsService
            .getExportSignedUrl(downloadTask)
            .then((downloadUrl) => {
                if (!downloadUrl) {
                    this.failedDownloads.push(this.getExportFileName(markedJobIndex));
                    this.showFailedDownloadsDialog();
                    return;
                }

                const link    = document.createElement('a');
                link.href     = downloadUrl;
                link.download = this.getExportFileName(markedJobIndex);

                link.click();
            })
            .finally(() => {
                this.downloadingRem = false;
                this.xmlDownloadButtonMessage = xmlDownloadMessage.notDownloading;
            });
    }

    bulkDownload () {
        const markedJobs     = this.jobsHandlers.getSelectedJobs();
        let downloadJobs     = [];
        const self           = this;
        let zip              = new JSZip();
        let zipFilename      = 'ExportedXML.zip';
        this.failedDownloads = [];

        this.downloadingRem           = true;
        this.downloadProgress         = 0;
        this.downloadTotal            = markedJobs.length;
        this.xmlDownloadButtonMessage = `${xmlDownloadMessage.downloading} ${this.downloadProgress}/${this.downloadTotal}`;

        // if only one selected
        if (markedJobs.length === 1) {
            this.downloadSingleXML(markedJobs[0]);
            return;
        }

        // if multiple selected
        function getNumOfDupFiles (exportFileName) {
            let numOfDup = 0;
            _forEach(downloadJobs, (job) => {
                if (job.fileName === exportFileName) {
                    numOfDup++;
                }
            });
            return numOfDup;
        }

        markedJobs.forEach((index) => {
            let exportFileName = this.getExportFileName(index);
            downloadJobs.push({
                id          : this.viewJobs[index]._id,
                fileName    : exportFileName,
                fileNameDup : getNumOfDupFiles(exportFileName)
            });
        });

        // download the files async to get rid of the same export-file-name issue
        // rem-xml-outbound service save the exported name to S3, same file name will overwrite
        // TODO - This might need server change?
        let sequence = Promise.resolve();

        downloadJobs.forEach(function downloadJob (downloadJob) {
            sequence = sequence
                .then(() => {
                    let downloadTask = {
                        jobID           : downloadJob.id,
                        ratingCompanyID : self.selectedRater ? self.selectedRater.O_ID : undefined
                    };

                    return self.JobsService.getExportSignedUrl(downloadTask);
                })
                .then((url) => {
                    if (!url) {
                        return;
                    }

                    let config = {
                        method  : 'GET',
                        url     : url,
                        headers : {
                            Authorization : 'Remove in Interceptor'
                        }
                    };

                    return self.$http(config);
                })
                .then((response) => {
                    if (!response) {
                        self.failedDownloads.push(downloadJob.fileName);
                        return;
                    }

                    if (downloadJob.fileNameDup !== 0) {
                        downloadJob.fileName = `${downloadJob.fileName} (${downloadJob.fileNameDup})`;
                    }

                    zip.file(downloadJob.fileName + '.xml', response.data, {binary : false});

                    self.downloadProgress++;
                    self.xmlDownloadButtonMessage = `${xmlDownloadMessage.downloading} ${self.downloadProgress}/${self.downloadTotal}`;
                });
        });

        sequence
            .then(() => {
                return zip.generateAsync({type : 'Blob'});
            })
            .then((base64) => {
                if (downloadJobs.length !== this.failedDownloads.length) {
                    FileSaver.saveAs(base64, zipFilename);
                }
            })
            .finally(() => {
                self.downloadingRem = false;
                self.xmlDownloadButtonMessage = xmlDownloadMessage.notDownloading;

                if (this.failedDownloads.length) {
                    this.showFailedDownloadsDialog();
                }

                _defer(function afterDigest () {
                    self.$scope.$apply();
                });
            });

    }

    showFailedDownloadsDialog () {
        this
            .DialogService
            .openDialog(this.DIALOG.DOWNLOAD_ERROR)
            .finally(() => {
                this.failedDownloads = [];
            });
    }

    setBulkOperationStatus (status) {
        this.bulkOperationsEnabled = status;

        if (this.checkAll && !this.bulkOperationsEnabled) {
            this.checkAll = false;
        }
    }

    toggleAllJobs () {
        this
            .jobsHandlers
            .toggleAllJobs(this.checkAll);
    }

    registerHandlers (toggleAllJobs, getSelectedJobs) {
        this.jobsHandlers = {
            toggleAllJobs,
            getSelectedJobs
        };
    }

    formatHistoryRecord (data) {
        const now  = new Date();
        const user = this.AuthenticationService.getUserInfo();

        const historyRecord = Object.assign(
            {
                DateTime        : now.toUTCString(),
                UserId          : user.userId,
                UserName        : `${user.firstName} ${user.lastName}`,
                LatLongAccuracy : undefined
            },
            data
        );

        return this.JobHistoryService.serializeHistoryRecord(historyRecord);
    }
}

export default JobsPage;
