/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

// Include Express
var express = require('express');
// Initialize the Router
var router = express.Router();
require('dotenv').load();

var Q = require('q');

var uuid = require('node-uuid');
var inspect = require('eyes').inspector({
    stream: null,
    colors: false
});
var _ = require('underscore');
var cacheEngine = require('../service/cacheEngine');

router.get('/userTracking', function(req, res) {
  res.json('{}');
  /*
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
    res.json('{}');*/
});



module.exports = router;
