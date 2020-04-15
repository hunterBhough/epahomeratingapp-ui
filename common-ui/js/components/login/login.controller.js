import moment from 'moment';

const downForMaintenance = true; //set to false to turn off
const TIMESTAMP = moment(new Date()).format('MMM Do YYYY h:mm a');

const STATUS_MESSAGE = {
  SYSTEM_ERROR: 'There was a system error. Please contact RaterPRO support.',
  AUTHORIZATION_ERROR: 'You are not authorized to use this system.',
  MAINTENANCE_ERROR: `Service is down for maintenance; please check back at ${TIMESTAMP}.`
}

class LoginController {
    constructor (
        $log,
        $rootScope,
        $state,
        $stateParams,
        $transitions,
        $q,
        AuthenticationService,
        AuthorizationService,
        UI_ENUMS,
        VALIDATION_PATTERN
    ) {
        'ngInject';

        this.$log         = $log;
        this.$rootScope   = $rootScope;
        this.$state       = $state;
        this.$stateParams = $stateParams;
        this.$transitions = $transitions;
        this.$q           = $q;

        this.AuthenticationService = AuthenticationService;
        this.AuthorizationService  = AuthorizationService;

        this.userIdPattern = VALIDATION_PATTERN.USER_NAME;
        this.STATE_NAME    = UI_ENUMS.STATE_NAME;
        this.JOB_PAGE_TAB  = UI_ENUMS.JOB_PAGE_TAB;
    }

    $onInit () {
        this.user   = {
            'userId'   : '',
            'password' : ''
        };

        this
            .reset();

        this
            .AuthenticationService
            .checkLogin()
            .then((userData) => {
                let userInfo       = angular.fromJson(userData);

                this.user.userId   = userInfo.userId;
                this.user.password = userInfo.password;

                this.isBusy = {busy : true};
                return (this.login(this.user));
            })
            .catch((error) => {
                this.$log.error(`[login.controller.js $onInit login] ${JSON.stringify(error)}`);
                this.isBusy = {busy : false};
                this.statusMessage = STATUS_MESSAGE.SYSTEM_ERROR;
                return;
            });

        this.rootscopeSubscription = this.$transitions.onError({from : 'login'}, (transition) => {
            try {
                this.$log.error(`[login.controller.js $onInit $transition onError try] ${JSON.stringify(transition._error.detail)}`);
                this.statusMessage = transition._error.detail.message || STATUS_MESSAGE.SYSTEM_ERROR;

            } catch (error) {
                if(downForMaintenance) {
                    this.statusMessage = STATUS_MESSAGE.MAINTENANCE_ERROR;
                    return;
                }
                this.$log.error(`[login.controller.js $onInit $transition onError catch] ${JSON.stringify(error)}`);
                this.statusMessage = STATUS_MESSAGE.SYSTEM_ERROR;
            }

            this.isBusy = {busy : false};
            this.notAuthorized = true;
            this.AuthorizationService.clearState();
            this.AuthenticationService.logout();
        });

        document.body.classList.add('login-page');
    }

    $onDestroy () {
        this.rootscopeSubscription();
        document.body.classList.remove('login-page');
    }

    setAction (action) {
        this.action = action;
    }

    returnToOriginalState () {
        const returnState      = this.AuthenticationService.getReturnState();
        const authorizedState  = this.AuthorizationService.getAuthorizedRedirect();
        let authorizedRedirect = {
            name   : authorizedState,
            params : {
                'status' : authorizedState === this.STATE_NAME.JOBS_SEARCH ? this.JOB_PAGE_TAB.ACTIVE : this.JOB_PAGE_TAB.SUBMITTED_TO_PROVIDER
            }
        };

        if (Object.keys(returnState).length > 0 && this.AuthorizationService.userIsAuthorizedForRoute(returnState)) {
            authorizedRedirect = returnState;
        }

        this.AuthenticationService.clearReturnState();

        this.isBusy = {busy : false};
        this.$state.go(authorizedRedirect.name, authorizedRedirect.params, {reload : true});
    }

    userIsAuthorized (userCompanies) {
        let isUserAuthorized = false;
        let userCompaniesIndex = userCompanies.length - 1;

        while ((userCompaniesIndex + 1) && !isUserAuthorized) {
            let userCompany = userCompanies[userCompaniesIndex];

            if (userCompany.Admin || userCompany.Rater || userCompany.Provider) {
                isUserAuthorized = true;
            }

            userCompaniesIndex -= 1;
        }

        return isUserAuthorized;
    }

    loginMethod (user) {
        if (this.$stateParams.loginMethod === 'https') {
            return this.AuthenticationService.loginViaHttps(user);
        } else {
            return this.AuthenticationService.login(user);
        }
    }

    login (user) {
        return this.$q((resolve, reject) => {
            this
                .loginMethod(user)
                .then((user) => {
                    if(downForMaintenance) {
                        this.statusMessage = STATUS_MESSAGE.MAINTENANCE_ERROR;
                        this.AuthenticationService.logout();
                        reject();
                    }
                    this.notAuthorized = false;
                    this.setAction('authorization');
                    return this.AuthorizationService.setUserAuthorization(user.userId);
                })
                .then((user) => {
                    if (this.userIsAuthorized(user.userCompany)) {
                        this.returnToOriginalState();
                    } else {
                        this.notAuthorized = true;
                        this.statusMessage = STATUS_MESSAGE.AUTHORIZATION_ERROR;
                        this.AuthenticationService.logout();
                        reject({status : 'not authorized'});
                    }
                })
                .catch((error) => {
                    this.$log.error(`[login.controller.js login] ${JSON.stringify(error)}`);

                    this.notAuthorized = true;
                    this.AuthenticationService.logout();
                    reject(error);
                });
        });
    }

    reset () {
        this.notAuthorized = false;
        this.action        = 'login';

        this.isBusy = {busy : false};

        // this.statusMessage = '';
    }

    resetPassword (user) {
        return this.$q((resolve, reject) => {
            this
                .AuthenticationService
                .resetPassword(user)
                .then((data) => {
                    resolve('yes');
                })
                .catch((error) => {
                    this.$log.error(`[login.controller.js resetPassword] ${JSON.stringify(error)}`);
                    reject(error);
                });
        });
    }
}

export default LoginController;
