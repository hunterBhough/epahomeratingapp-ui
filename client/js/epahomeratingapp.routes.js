let epahomeratingappRoutes = function epahomeratingappRoutes ($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider
        .otherwise('/login');

    $stateProvider
        .state('login', {
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

        .state('house-plans', {
            url        : '/house-plans',
            component  : 'housePlansPage'
        })

        .state('jobs', {
            url        : '/jobs',
            component  : 'jobsPage',
            resolve    : {
                jobs   : (JobsService) => {
                    let jobPromise
                        = JobsService
                            .get()
                            .then(jobs => {
                                return jobs.data;
                            });

                    return jobPromise;
                }
            }
        })

        .state('job-new', {
            url        : '/jobs/new/',
            component  : 'jobNewPage',
            resolve    : {
                job    : (JobsService) => {
                    let jobPromise
                        = JobsService
                            .getNewJob()
                            .then(job => {
                                return Object.assign({}, job);
                            });

                    return jobPromise;
                }
            }
        })

        .state('job-edit', {
            url        : '/jobs/edit/{id}',
            component  : 'jobEditPage',
            resolve    : {
                job    : (JobsService, $stateParams) => {
                    let jobPromise
                        = JobsService
                            .getById($stateParams.id)
                            .then(job => {
                                return job.data;
                            });

                    return jobPromise;
                }
            }
        })

        .state('job-checklist', {
            url        : '/jobs/{id}',
            component  : 'jobChecklistPage',
            resolve    : {
                job : (JobsService, $stateParams) => {
                    let jobPromise
                        = JobsService
                            .getById($stateParams.id)
                            .then(job => {
                                return job.data;
                            });

                    return jobPromise;
                },
                jobDisplayList : (JobDisplayListService, $stateParams) => {
                    let jobDisplayListPromise
                        = JobDisplayListService
                            .getById($stateParams.id)
                            .then(jobDisplayList => {
                                return jobDisplayList;
                            });

                    return jobDisplayListPromise;
                },
                jobDataResponse : (JobDataResponseService, $stateParams) => {
                    let jobDataResponsePromise
                        = JobDataResponseService
                            .getById($stateParams.id)
                            .then(jobDataResponse => {
                                return jobDataResponse;
                            });

                    return jobDataResponsePromise;
                }
            }
        })

        .state('job-checklist.category', {
            url        : '/{houseId}/{categoryId}',
            component  : 'checklistCategory'
        })

        .state('users', {
            url        : '/users',
            component  : 'usersPage'
        });
};

export default epahomeratingappRoutes;
