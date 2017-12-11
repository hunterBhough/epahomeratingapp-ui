import {UI_ENUMS} from '../../epahomeratingappUI.js';
import _forOwn from 'lodash/forOwn';

let searchParams = [];

_forOwn(UI_ENUMS.SEARCH_PARAMS, (value, key) => {
    searchParams.push(value);
});

const STATE_NAME = UI_ENUMS.STATE_NAME;

let epahomeratingappRoutes = function epahomeratingappRoutes ($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider
        .otherwise(STATE_NAME.LOGIN);

    $stateProvider
        .state(STATE_NAME.LOGIN, {
            url        : '/login',
            component  : 'loginPage',
            data       : {
                requiresAuth : false
            },
            resolve    : {
                returnTo : ($transition$) => {
                    if ($transition$.redirectedFrom() !== null) {
                        // The user was redirected to the login state (e.g., via the requiresAuth hook when trying to activate contacts)
                        // Return to the original attempted target state (e.g., contacts)
                        return $transition$.redirectedFrom().targetState();
                    }

                    let $state = $transition$.router.stateService;

                    // The user was not redirected to the login state; they directly activated the login state somehow.
                    // Return them to the state they came from.
                    if ($transition$.from().name !== '') {
                        return $state.target($transition$.from(), $transition$.params('from'));
                    }

                    // If the fromState's name is empty, then this was the initial transition. Just return them to the home state
                    return $state.target('jobs');
                }
            }
        })

        .state(STATE_NAME.REGISTER, {
            url        : '/register',
            component  : 'registerPage',
            data       : {
                requiresAuth : false
            }
        })

        .state(STATE_NAME.HOUSE_LIBRARY, {
            url        : '/house-library',
            component  : 'housePlansPage',
            resolve    : {
                housePlans : (HousePlansService) => {
                    let housePlansPromise
                        = HousePlansService
                            .get()
                            .then(housePlans => {
                                return housePlans;
                            });

                    return housePlansPromise;
                }
            }
        })

        .state(STATE_NAME.HOUSE_LIBRARY_NEW, {
            url       : '/new',
            component : 'housePlanNew'
        })

        .state(STATE_NAME.HOUSE_LIBRARY_EDIT, {
            url       : '/{id}',
            component : 'housePlanEdit',
            resolve   : {
                housePlan : (HousePlansService, $stateParams) => {
                    let housePlanPromise
                        = HousePlansService
                            .getById($stateParams.id)
                            .then(housePlan => {
                                return housePlan;
                            });

                    return housePlanPromise;
                }
            }
        })

        .state(STATE_NAME.HOUSE_LIBRARY_EDIT_BULK, {
            url       : '/edit-bulk',
            component : 'housePlanEditBulk',
            params    : {
                housePlanIDs : null
            }
        })

        .state(STATE_NAME.JOBS_PROVIDER, {
            url        : '/jobs/submitted',
            component  : 'jobsProviderPage',
            resolve    : {
                company : (AuthorizationService, UserCompanyService) => {
                    return UserCompanyService.getCompany(AuthorizationService.getCurrentOrganizationId());
                },
                jobs   : (company, JobsService, $stateParams) => {
                    let raterId;

                    if ($stateParams && $stateParams.rater) {
                        raterId = $stateParams.rater;
                    } else if (company.RelatedRaterCompanys.length) {
                        raterId = company.RelatedRaterCompanys[0]._id;
                    }

                    let jobPromise
                        = JobsService
                            .getProviderJobs(raterId)
                            .then(jobs => {
                                return jobs;
                            });

                    return jobPromise;
                }
            }
        })

        .state(STATE_NAME.JOBS_PROVIDER_SEARCH, {
            url        : `/jobs/submitted?${searchParams.join('&')}`,
            component  : 'jobsProviderPage',
            resolve    : {
                company : (AuthorizationService, UserCompanyService) => {
                    return UserCompanyService.getCompany(AuthorizationService.getCurrentOrganizationId());
                },
                jobs   : (JobsService, $stateParams) => {
                    let jobPromise
                        = JobsService
                            .searchProviderJobs($stateParams)
                            .then(jobs => {
                                return jobs;
                            });

                    return jobPromise;
                }
            }
        })


        .state(STATE_NAME.JOBS, {
            url        : '/jobs',
            component  : 'jobsPage',
            resolve    : {
                company : (AuthorizationService, UserCompanyService) => {
                    return UserCompanyService.getCompany(AuthorizationService.getCurrentOrganizationId());
                },
                jobs   : (JobsService) => {
                    let jobPromise
                        = JobsService
                            .get()
                            .then(jobs => {
                                return jobs;
                            });

                    return jobPromise;
                }
            }
        })

        .state(STATE_NAME.JOBS_SEARCH, {
            url        : `/jobs?${searchParams.join('&')}`,
            component  : 'jobsPage',
            resolve    : {
                company : (AuthorizationService, UserCompanyService) => {
                    return UserCompanyService.getCompany(AuthorizationService.getCurrentOrganizationId());
                },
                jobs   : (JobsService, $stateParams) => {
                    let jobPromise
                        = JobsService
                            .search($stateParams)
                            .then(jobs => {
                                return jobs;
                            });

                    return jobPromise;
                }
            }
        })

        .state(STATE_NAME.JOB_NEW, {
            url        : '/jobs/new/',
            component  : 'jobNewPage',
            resolve    : {
                job    : (JobsService) => {
                    return JobsService.getNewJob();
                },
                housePlans : (HousePlansService) => {
                    let housePlansPromise
                        = HousePlansService
                            .get()
                            .then(housePlans => {
                                return housePlans;
                            });

                    return housePlansPromise;
                }
            }
        })

        .state(STATE_NAME.JOB_EDIT, {
            url        : '/jobs/edit/{id}',
            component  : 'jobEditPage',
            resolve    : {
                job    : (JobsService, $stateParams) => {
                    let jobPromise
                        = JobsService
                            .getById($stateParams.id)
                            .then(job => {
                                return job;
                            });

                    return jobPromise;
                },
                housePlans : (HousePlansService) => {
                    let housePlansPromise
                        = HousePlansService
                            .get()
                            .then(housePlans => {
                                return housePlans;
                            });

                    return housePlansPromise;
                }
            }
        })

        .state(STATE_NAME.JOB_CHECKLIST, {
            url        : '/jobs/{id}',
            component  : 'jobChecklistPage',
            resolve    : {
                job : (JobChecklistStateService, $stateParams) => {
                    let jobChecklistStatePromise
                        = JobChecklistStateService
                            .setJobState($stateParams.id, $stateParams.houseId);

                    return jobChecklistStatePromise;
                }
            }
        })

        .state(STATE_NAME.JOB_CHECKLIST_CATEGORY, {
            url        : '/{houseId}/{categoryId}?status',
            component  : 'checklistCategory',
            resolve    : {
                jobChecklistState : (JobChecklistStateService, $stateParams) => {
                    let jobChecklistStatePromise
                        = JobChecklistStateService
                            .setJobHouseState($stateParams.id, $stateParams.houseId);

                    return jobChecklistStatePromise;
                }
            }
        })

        .state(STATE_NAME.JOB_CHECKLIST_STAGE, {
            url        : '/{houseId}/stage/{stageId}?status',
            component  : 'checklistStage',
            resolve    : {
                jobChecklistState : (JobChecklistStateService, $stateParams) => {
                    let jobChecklistStatePromise
                        = JobChecklistStateService
                            .setJobHouseState($stateParams.id, $stateParams.houseId);

                    return jobChecklistStatePromise;
                }
            }
        })

        .state(STATE_NAME.JOB_CHECKLIST_REVIEW, {
            url        : '/jobs/review/{id}?role',
            component  : 'jobChecklistPage',
            resolve    : {
                job : (JobChecklistStateService, $stateParams) => {
                    let jobChecklistStatePromise
                        = JobChecklistStateService
                            .setJobState($stateParams.id, $stateParams.houseId);

                    return jobChecklistStatePromise;
                }
            }
        })

        .state(STATE_NAME.JOB_CHECKLIST_REVIEW_CATEGORY, {
            url        : '/{houseId}/{categoryId}?status',
            component  : 'checklistCategory',
            resolve    : {
                jobChecklistState : (JobChecklistStateService, $stateParams) => {
                    let jobChecklistStatePromise
                        = JobChecklistStateService
                            .setJobHouseState($stateParams.id, $stateParams.houseId);

                    return jobChecklistStatePromise;
                }
            }
        })

        .state(STATE_NAME.USERS, {
            url        : '/users',
            component  : 'usersPage'
        })

        .state(STATE_NAME.DIAGNOSTICS, {
            url        : '/diagnostics',
            component  : 'diagnosticsPage'
        });
};

export default epahomeratingappRoutes;
