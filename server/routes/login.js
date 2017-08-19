/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

var express = require('express');
var router = express.Router();
var Encryption = require('../service/encryption');

//Initialize SQL, and load envrionment settings
var sql = require('mssql');
require('dotenv').load();

var uuid = require('node-uuid');

var inspect = require('eyes').inspector({
    stream: null,
    colors: false
});

var cacheEngine = require('../service/cacheEngine');

router.get('/loginDetail', function(req, res) {
    res.json(JSON.stringify({}));
});

router.get('/validSession', function(req, res) {
    var new_token = req.query.token;
    if (cacheEngine.validApiToken(new_token)) {
        res.json({});
    } else {
        res.status(419).json({
            error: 'failed'
        });
    }
});
router.get('/decryptPassword', function(req,res) {
    console.log('decrypt is:',Encryption.Decrypt(req.query['password']));
    res.sendStatus(200);

});
router.post('/loginUser', function(req, res) {
    var currentRs = 0; //used for keeping track of recordsets
    var usr = {};
    console.log(inspect(req.body));
    var user = req.body.params.user;
    var password = req.body.params.password;

    password = Encryption.Encrypt(password);
    console.log('Encrypted password:' + password);
    console.log('password: ' + password + ', userName: ' + user);
    var request = new sql.Request(sql.db1);

    request.input('Password', password);
    request.input('Username', user);
    request.stream = true;

    request.execute('usp_authUser');
    request.on('recordset', function(columns) {
        currentRs += 1;
    });
    request.on('row', function(row) {

        switch (currentRs) {
        case 1:
            console.log(inspect(row));
            usr.email = row.email;
            usr.userName = row.username;
            usr.accountName = row.accountName;
            usr.accountId = row.accountId;
            usr.userId = row.userId;
            usr.categorizationAttribute = row.categorizationAttribute;
            usr.categorizationDisplayName = row.categorizationDisplayName;
            usr.userAttribute = row.userAttribute;
            usr.userDisplayName = row.userDisplayName;
            usr.defaultDateRange = row.defaultDateRange;
            usr.categorizationJson = row.categorizationJson;
            usr.statusJson = row.statusJson;
            usr.permissionJson = row.permissionJson;
            usr.assignmentAttr = row.assignmentAttr;
            usr.accountOptions=row.accountOptions;
            usr.commentJSON=row.commentJSON;
            usr.ratingJSON=row.ratingJSON;
            usr.homeFolder=row.homeFolder;
            break;
        case 2:

            break;
        case 3:

        }

    });

    request.on('error', function(err) {
        console.log(err);
        res.status(401).json({
            error: err.message
        });
    });

    request.on('done', function(response) {
        //checks for no response if there is an error in running
        //the stored procedure
        console.log('response : ' + response);
        if (response != undefined && response != -1) {
            var new_token = uuid.v4();
            cacheEngine.addApiToken(new_token, usr.userId);
            res.json({
                success: true,
                token: new_token,
                user: usr
            });
        }
    });

});
router.post('/changePassword', function(req, res) {
    var userid = req.body.params.userid;
    var password = Encryption.Encrypt(req.body.params.password);

    var request = new sql.Request(sql.db1);
    request.input('UserId', userid);
    request.input('password', password);
    request.execute('usp_changePassword', function(err, response) {
        if (err) {
            console.error(err);
            res.status(401).json({
                error: err.message
            });
            res.end();
        } else if (response != -1) {
            res.json({
                success: true,
            });
        }
    });
});

router.post('/logoutUser', function(req, res) {
    var userid = req.query.userid;

    //cacheEngine.removeApiToken(token, userid);

    var request1 = new sql.Request(sql.db1);
    request1.input('UserId', userid);
    request1.input('dt', new Date());
    request1.execute('usp_UserLogOut', function(err, response) {
        if (err) {
            console.error(err);
            res.status(401).json({
                error: err.message
            });
            res.end();
        } else if (response != -1) {
            res.json({
                success: true,
            });
        }
    });
});

module.exports = router;
