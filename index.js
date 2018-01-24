'use strict';

let bunyan            = require('bunyan');
let express           = require('express');
let path              = require('path');
let config            = require('./config');
let app               = express();
let webpackMiddleware = require('webpack-dev-middleware');
let webpack           = require('webpack');
let webpackConfig     = require('./webpack.config');

let log = bunyan.createLogger({name : 'index.logger'});

let server;

app.use(express.static(path.resolve('client/')));

app.locals.pretty = true;
app.set('views', __dirname + '/server/views');
app.set('view engine', 'pug');

app.set('port', process.env.PORT || config.environment.port);
app.set('host', process.env.HOST || '0.0.0.0');

app.get('/', function onGet (req, res) {
    res.render('index-dev', {
        title    : config.environment.app.siteName
    });
});

require('./server/api/house-plan/house-plan.routes.js')(app);

if (app.get('env') === 'development') {
    app.use(webpackMiddleware(webpack(webpackConfig), {
        publicPath : '/dist',

        headers    : {'X-Custom-Webpack-Header' : 'yes'},

        stats      : {
            colors : true
        }
    }));
}

server = app.listen(app.get('port'), app.get('host'), function onListen () {
    log.info(`Express server listening on port ${app.get('port')}`);
});

module.exports.app    = app;
module.exports.server = server;
