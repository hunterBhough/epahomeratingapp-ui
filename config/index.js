var assets      = require('./assets');
var environment = require('./environment');
var config = {
    maintenance : {
        status  : false,
        message : {
            SYSTEM_ERROR        : 'There was a system error. Please contact RaterPRO support.',
            AUTHORIZATION_ERROR : 'You are not authorized to use this system.',
            MAINTENANCE_ERROR   : 'Service is down for maintenance; please check back Friday, May 20 at 9:00am.'
        },
    }
};
module.exports = {
    assets      : assets,
    environment : environment,
    config      : config,
};
