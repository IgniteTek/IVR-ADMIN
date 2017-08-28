'use strict';

// Include Express
var express = require('express');
// Initialize the Router
var router = express.Router();
var Encryption = require('../service/encryption');

//Initialize SQL, and load envrionment settings
var sql = require('mssql');
require('dotenv').load();

var Q = require('q');

var uuid = require('node-uuid');
var eyes = require('eyes').inspector({
    maxLength: 102048
});
var inspect = require('eyes').inspector({
    stream: null,
    colors: false
});
var _ = require("underscore");
var cacheEngine = require('../service/cacheEngine');


router.get('/getConfig', function(req, res) {
    var request = new sql.Request(sql.db1);
    var qs = req.query;
    console.log('getConfig params', qs);
    request.input('dt', new Date());
    request.input('ip', qs.ip);
    request.input('serverName', qs.server);
    request.execute("usp_getServerConfig", function(err, recordset) {
        if (err) {
            console.error('usp_getServerConfig', err);
            res.end('failure');

        }
        var row = recordset[0][0];
        console.log('usp_getServerConfig', row);
        var outp = {
            isPCI: row['isPCI'],
            isDev: row['isDev'],
            isEnabled: row['isEnabled'],
            doASR: row['doASR'],
            doAudioConversion: row['doAudioConversion'],
            checkForLatestCode: row['checkForLatestCode'],
            runInstallationScript: row['runInstallationScript'],
            targetRelease: row['targetRelease']
        };
        res.json(outp);

    });


});



router.get('/logServer', function(req, res) {
    //return;
    var qs = req.query;
    if (qs.message.indexOf('Got no work') != -1 || qs.message.indexOf('Queue is empty') != -1) {
        res.end();
        return;
    }
    if (qs.error == undefined && qs.message.toLowerCase().indexOf('error') != -1) {
        qs.error = 1;
    }
    if (qs.error == undefined) qs.error = 0;
    var request = new sql.Request(sql.db1);
    request.input('dt', new Date());
    request.input('ip_address', qs.ip);
    request.input('server_name', qs.server);
    request.input('message', qs.message);
    request.input('error', qs.error);
    request.input('codeVersion', qs.codeVersion);
    request.execute("usp_insertLog", function(err, recordset) {
        if (err) {
            console.error(err);
            res.end('failure');
            return;
        }
    });
    res.end();
});



router.get('/userTracking', function(req, res) {
    var qs = req.query;
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    if (!qs.userid) return;
    var request = new sql.Request(sql.db1);
    request.input('apiToken', qs.apitoken ? qs.apitoken : '');
    request.input('userId', qs.userid);
    request.input('audioId', qs.audioid);
    request.input('action', qs.action);
    request.input('value', qs.value);
    request.input('isUpdate', qs.isupdate);
    request.input('ip', ip);
    request.execute("usp_userTracking", function(err, recordset) {
        if (err) {
            console.error(err);
            res.end('failure');
            return;
        }
    });
    res.json('{}');
});



module.exports = router;