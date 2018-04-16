import _cloneDeep from 'lodash/cloneDeep';
import _filter from 'lodash/filter';
import _orderBy from 'lodash/orderBy';
import _omitBy from 'lodash/omitBy';
import _pickBy from 'lodash/pickBy';
import _map from 'lodash/map';
import _forOwn from 'lodash/forOwn';

/**
 * JobsService is the interface for all job data.
 */
class JobsService {
    /**
     * Instantiate JobsService with necessary providers.
     *
     * @param  {function} $q        angular.$q promise providers
     * @param  {function} $http     angular.$http ajax requests
     * @param  {function} $sanitize angular.$sanitize html injection
     * @param  {object}   API_URL   epahomeratingapp constants - contains paths to API
     */
    constructor ($q, $http, $stateParams, $sanitize, UI_ENUMS, API_URL, AuthorizationService, jobTitleFilter) {
        'ngInject';

        this.$q                   = $q;
        this.$http                = $http;
        this.$sanitize            = $sanitize;
        this.$stateParams         = $stateParams;

        this.SEARCH_PARAMS        = UI_ENUMS.SEARCH_PARAMS;
        this.JOB_STATUS           = UI_ENUMS.JOB_STATUS;
        this.JOB_TYPES            = UI_ENUMS.JOB_TYPES;

        this.AuthorizationService = AuthorizationService;

        this.API_URL              = API_URL;
        this.jobTitleFilter       = jobTitleFilter;
    }

    /**
     * Gets list of jobs.
     *
     * @return {promise}    resolves to array of jobs
     */
    get () {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'GET',
                    url     : this.API_URL.JOB
                })
                .then((response) => {
                    if (response.status === 200) {
                        let jobs = response.data;

                        jobs = _orderBy(
                            jobs,
                            [(job) => {
                                return new Date(job.History[job.History.length - 1].DateTime);
                            }],
                            ['desc']
                        );

                        resolve(jobs);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    /**
     * Gets list of jobs.
     *
     * @return {promise}    resolves to array of jobs
     */
    getProviderJobs (ratingCompanyID) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method          : 'GET',
                    url             : this.API_URL.JOB,
                    ratingCompanyID
                })
                .then((response) => {
                    if (response.status === 200) {
                        let jobs = _filter(response.data, {
                            ProviderCompany : this.AuthorizationService.getCurrentOrganizationId()
                        });

                        jobs = _orderBy(
                            jobs,
                            [(job) => {
                                return new Date(job.History[job.History.length - 1].DateTime);
                            }],
                            ['desc']
                        );

                        resolve(jobs);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    reduceHousePlans (samples) {
        let housePlans = [];

        samples.forEach((sample) => {
            let sampleHousePlans = _map(sample.HousePlan, 'Name');

            housePlans = housePlans.concat(housePlans, sampleHousePlans);
        });

        return housePlans.join(' ');
    }

    reduceBuilders (samples) {
        return samples.reduce((jobBuilderList, sample) => {
            return jobBuilderList + ` ${sample.Builder}`;
        }, '');
    }

    //TODO : move some of this server side
    search (stateParams) {
        let promise = this.$q((resolve, reject) => {
            let url = this.API_URL.JOB;

            if (stateParams.status === this.JOB_STATUS.ARCHIVED) {
                url = `${url}?type=archive`;
            } else if (stateParams.status === this.JOB_STATUS.DELETED) {
                url = `${url}?type=delete`;
            }

            this
                .$http({
                    method  : 'GET',
                    url     : url
                })
                .then((response) => {
                    if (response.status === 200) {
                        let allJobs = response.data;
                        let filteredJobs;

                        let searchParams = Object.assign({}, stateParams);

                        searchParams = _omitBy(searchParams, (param) => {
                            return param === undefined || param === null;
                        });

                        filteredJobs = _pickBy(allJobs, (job) => {
                            let pick          = true;
                            let progressLevel = stateParams[this.SEARCH_PARAMS.PROGRESS_LEVEL];

                            _forOwn(searchParams, (value, key) => {
                                switch (key) {
                                case this.SEARCH_PARAMS.BUILDER :
                                    if (job.searchMeta.builders.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.HOUSE_PLAN :
                                    if (job.searchMeta.ratingFiles.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.KEYWORDS :
                                    if (job.searchMeta.addressInformation.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.JOB_TYPE :
                                    if (value === this.JOB_TYPES.SampleSet.Key && job.Secondary.length === 0) {
                                        pick = false;
                                    } else if (value === this.JOB_TYPES.IndividualHouse.Key && job.Secondary.length > 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.RATING_TYPE :
                                    if (job.RatingType !== searchParams[this.SEARCH_PARAMS.RATING_TYPE]) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.MUST_CORRECT :
                                    pick = job.BuilderMustCorrect;
                                    break;
                                case this.SEARCH_PARAMS.STATUS :
                                    if (stateParams.status === this.JOB_STATUS.ARCHIVED || stateParams.status === this.JOB_STATUS.DELETED) {
                                        pick = true;
                                    } else if (progressLevel !== undefined && progressLevel !== job.ProgressLevel) {
                                        pick = false;
                                    } else if (searchParams[this.SEARCH_PARAMS.STATUS] !== job.Status) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.INTERNAL_REVIEW :
                                    if (!job.InternalReview) {
                                        pick = false;
                                    }
                                }

                            });

                            return pick;
                        });

                        filteredJobs = _orderBy(
                            filteredJobs,
                            [(job) => {
                                return new Date(job.History[job.History.length - 1].DateTime);
                            }],
                            ['desc']
                        );

                        resolve(filteredJobs);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    searchProviderJobs (stateParams) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method          : 'GET',
                    url             : this.API_URL.JOB,
                    ratingCompanyID : stateParams.rater
                })
                .then((response) => {
                    if (response.status === 200) {
                        let allJobs = response.data;
                        let filteredJobs;

                        let searchParams = Object.assign({}, stateParams);

                        searchParams = _omitBy(searchParams, (param) => {
                            return param === undefined || param === null;
                        });

                        // debugger;

                        filteredJobs = _pickBy(allJobs, (job) => {
                            // debugger;
                            let pick          = true;
                            let progressLevel = stateParams[this.SEARCH_PARAMS.PROGRESS_LEVEL];

                            _forOwn(searchParams, (value, key) => {
                                switch (key) {
                                case this.SEARCH_PARAMS.BUILDER :
                                    if (job.searchMeta.builders.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.HOUSE_PLAN :
                                    if (job.searchMeta.ratingFiles.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.KEYWORDS :
                                    if (job.searchMeta.addressInformation.indexOf(decodeURIComponent(value).toLowerCase()) < 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.JOB_TYPE :
                                    if (value === this.JOB_TYPES.SampleSet.Key && job.Secondary.length === 0) {
                                        pick = false;
                                    } else if (value === this.JOB_TYPES.IndividualHouse.Key && job.Secondary.length > 0) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.RATING_TYPE :
                                    if (job.RatingType !== searchParams[this.SEARCH_PARAMS.RATING_TYPE]) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.MUST_CORRECT :
                                    pick = job.BuilderMustCorrect;
                                    break;
                                case this.SEARCH_PARAMS.RETURNED_FROM_INTERNAL_REVIEW :
                                    if (!job.ReturnedFromInternal) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.RETURNED_FROM_PROVIDER_REVIEW :
                                    if (!job.ReturnedFromProvider) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.STATUS :
                                    if (progressLevel !== undefined && progressLevel !== job.ProgressLevel) {
                                        pick = false;
                                    } else if (searchParams[this.SEARCH_PARAMS.STATUS] !== job.Status) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.INTERNAL_REVIEW :
                                    if (!job.InternalReview) {
                                        pick = false;
                                    }
                                    break;
                                case this.SEARCH_PARAMS.RATER :
                                    if (job.ProviderCompany !== this.AuthorizationService.getCurrentOrganizationId()) {
                                        pick = false;
                                    }
                                    break;
                                }
                            });

                            return pick;
                        });

                        filteredJobs = _orderBy(
                            filteredJobs,
                            [(job) => {
                                return new Date(job.History[job.History.length - 1].DateTime);
                            }],
                            ['desc']
                        );

                        resolve(filteredJobs);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    /**
     * Get job by id.
     *
     * @param  {string} _id     UID of job
     * @return {promise}        resolves to
     */
    getById (_id, ratingCompanyID) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'GET',
                    url     : `${this.API_URL.JOB}/${_id}`,
                    ratingCompanyID
                })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(response.data);
                    } else {
                        //TODO: handle this all proper like
                        reject('something is amiss');
                    }

                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    getNewSample () {
        let sampleGuid     = Date.now();
        let sampleTemplate = {
            'HouseId'                    : sampleGuid,
            'BuilderId'                  : '',
            'HousePlan'                  : [],
            'AddressInformation'         : {},
            'Photo'                      : [],
            'HvacDesignReport'           : [],
            'RaterDesignReviewChecklist' : []
        };

        return _cloneDeep(sampleTemplate);
    }

    /**
     * Get a new job data object.
     *
     * @return {object} default job object.
     */
    getNewJob () {
        let jobTemplate = {
            'ProgressLevel'        : 'PreDrywall',
            'RatingType'           : 'energy-star',
            'Primary'              : this.getNewSample(),
            'Secondary'            : []
        };

        return _cloneDeep(jobTemplate);
    }

    post (job) {
        // @todo consider applying logic for req. fields (if this group is partly filled - return rejection, etc)
        let jobToPost = this.sanitize(job);
        jobToPost.searchMeta = this.createSearchMeta(jobToPost);
        jobToPost.SampleSize = job.Secondary.length + 1;

        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'POST',
                    url     : this.API_URL.JOB,
                    data    : jobToPost
                })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(response);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    getExportSignedUrl (_id) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'GET',
                    url     : `${this.API_URL.JOB}/rem_xml/${_id}`
                })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(response.data.data.url);
                    } else {
                        //TODO: make this less bad
                        reject('somethings amiss');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    /**
     * Saves updated job data.
     *
     * @param  {object} job job data
     * @return {promis}     resolves to successful save.
     */
    put (job, ratingCompanyID) {
        let jobToPost = this.sanitize(job);
        jobToPost.searchMeta = this.createSearchMeta(jobToPost);
        jobToPost.SampleSize = job.Secondary.length + 1;

        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'PUT',
                    url     : `${this.API_URL.JOB}/${job._id}`,
                    data    : jobToPost,
                    ratingCompanyID
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    delete (job) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'DELETE',
                    url     : `${this.API_URL.JOB}/${job._id}?type=delete`,
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    archive (job) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'DELETE',
                    url     : `${this.API_URL.JOB}/${job._id}?type=archive`,
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    putback (job, type) {
        let promise = this.$q((resolve, reject) => {
            this
                .$http({
                    method  : 'PUT',
                    url     : `${this.API_URL.JOB}/${job._id}?type=${type}`,
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    createSearchMeta (job) {
        const samples = job.Secondary.concat([job.Primary]);

        return {
            addressInformation : this.jobTitleFilter(job.Primary.AddressInformation, true).toLowerCase(),
            ratingFiles        : this.reduceHousePlans(samples).toLowerCase(),
            builders           : this.reduceBuilders(samples).toLowerCase()
        };
    }

    sanitize (job) {
        job.Primary.Builder                             = this.$sanitize(job.Primary.Builder);
        job.Primary.AddressInformation.Address1         = this.$sanitize(job.Primary.AddressInformation.Address1);
        job.Primary.AddressInformation.CityMunicipality = this.$sanitize(job.Primary.AddressInformation.CityMunicipality);
        job.Primary.AddressInformation.CommunityName    = this.$sanitize(job.Primary.AddressInformation.CommunityName);
        job.Primary.AddressInformation.LotNo            = this.$sanitize(job.Primary.AddressInformation.LotNo);
        job.Primary.AddressInformation.ManualId         = this.$sanitize(job.Primary.AddressInformation.ManualId);
        job.Primary.AddressInformation.StateCode        = this.$sanitize(job.Primary.AddressInformation.StateCode);
        job.Primary.AddressInformation.ZipCode          = this.$sanitize(job.Primary.AddressInformation.ZipCode);
        job.Primary.ExportFilename                      = this.$sanitize(job.Primary.ExportFilename);

        job.Secondary.forEach((secondary, index) => {
            job.Secondary[index].Builder                             = this.$sanitize(job.Secondary[index].Builder);
            job.Secondary[index].AddressInformation.Address1         = this.$sanitize(job.Secondary[index].AddressInformation.Address1);
            job.Secondary[index].AddressInformation.CityMunicipality = this.$sanitize(job.Secondary[index].AddressInformation.CityMunicipality);
            job.Secondary[index].AddressInformation.CommunityName    = this.$sanitize(job.Secondary[index].AddressInformation.CommunityName);
            job.Secondary[index].AddressInformation.LotNo            = this.$sanitize(job.Secondary[index].AddressInformation.LotNo);
            job.Secondary[index].AddressInformation.ManualId         = this.$sanitize(job.Secondary[index].AddressInformation.ManualId);
            job.Secondary[index].AddressInformation.StateCode        = this.$sanitize(job.Secondary[index].AddressInformation.StateCode);
            job.Secondary[index].AddressInformation.ZipCode          = this.$sanitize(job.Secondary[index].AddressInformation.ZipCode);
            job.Secondary[index].ExportFilename                      = this.$sanitize(job.Secondary[index].ExportFilename);
        });

        return job;
    }
}

export default JobsService;
