/*eslint-env node*/
/* eslint-disable  no-console */

'use strict';

var inspect = require('eyes').inspector({
    stream: null,
    colors: false
});


require('dotenv').load({
    path: '.env'
});


process.env.TZ = 'GMT';

var fs = require('fs');
var Q = require('q');
var _ = require('underscore');
var request = require('request');

var oldLog = console.log;
console.log = function(message) {
    if (typeof message !== 'string') {
        oldLog.apply(console, arguments);
        return;
    }
    message = message.replace(/\\n/gm, '\n');
    arguments[0] = '[' + new Date().toLocaleTimeString() + '] : ' + arguments[0];
    oldLog.apply(console, arguments);
};
console.log(inspect(process.env));

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').load();


var oracledb = require('oracledb');

oracledb.createPool({
    user: 'TEST_S603090DC3ORA03',
    password: '1Kapets#',
    connectString: '(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=stats.ctw71eo2joww.us-east-1.rds.amazonaws.com)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=ORCL)))'
  },
  function(err, pool) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Oracle Pool Created');
  });

/*   cache Engine*/
var cacheEngine = require('./service/cacheEngine');

/**
 * Route Imports
 */

var login = require('./routes/login');
var account = require('./routes/account');
var catalog = require('./routes/catalog');
var logging = require('./routes/logging');


var app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',
    extended: false
}));
app.use(cookieParser());

/**
 * Development Settings
 */

app.use(express.static(path.join(__dirname, '../client/app')));

// Error Handling
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.disable('etag');

app.use(function(req, res, next) {
    var oneof = false;
    //&& req.headers.origin.match(/hercle.com/g))
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
app.use('/api/login', login);
app.use('/api/account', account);
app.use('/api/catalog', catalog);
app.use('/api/logging', logging);

app.use(function(req, res, next) {
    if (req.path.indexOf('/api') !== 0) {
        next();
        return;
    }
    if (!cacheEngine.checkApiToken(req.headers['x-session-token']) && req.path.indexOf('/api/audio/webhooktest')!==0 && req.path.indexOf('/api/audio/getRedactionSegments')!==0 && req.path.indexOf('/api/audio/getKeywordAudio')!==0 && req.path.indexOf('/api/audio/decrypt')!==0) {
        console.log('bad token for ', req.path);
        res.status(401).json({
            error: 'failed'
        });
    } else {
        next();
    }
});

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {
        root: path.join(__dirname, '../client/app/')
    });
});



app.set('port', process.env.API_NODE_PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});




function restartServer(event, filename) {
    console.log('event is: ' + event);
    process.kill(process.pid);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
}

fs.watchFile('api_server.js', function(curr, prev) {
    console.log(inspect(curr));
    console.log(inspect(prev));
    if (curr.mtime !== prev.mtime) {
        restartServer('change', 'server');
    }
});


var keypress = require('keypress');
keypress(process.stdin);
process.stdin.on('keypress', function(ch, key) {

    if (key && key.name === 'q') {
        process.kill(process.pid);
    }

});
if (process.stdin.setRawMode !== undefined) {
    process.stdin.setRawMode(true);
}

process.stdin.resume();
