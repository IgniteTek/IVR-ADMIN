/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

var express = require('express');
var router = express.Router();
var Encryption = require('../service/encryption');
var db = require('../service/dbExtension');

require('dotenv').load();

var uuid = require('node-uuid');

var inspect = require('eyes').inspector({
  stream: null,
  colors: false
});

var cacheEngine = require('../service/cacheEngine');
router.get('/testdb', function(req, res) {
    var params = [
        {param: 'v_userName', value: 'jimmy'},
        {param: 'v_password', value: 'UPONE8WHIC1Ko8GEV6YZGQ=='},
    ];
    var cursors = [
        {cursor: 'cur_result'},
        {cursor: 'cur_result2'}
    ];

    db.execProc('SIVR.login2',
    params,
    cursors, 
    function(j) {
        console.log("got back from execdb", j);
        res.json(j);
        return;
    });

});
module.exports = router;
  