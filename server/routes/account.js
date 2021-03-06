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


//  PROCEDURE createCompany(v_userName nvarchar2, v_password nvarchar2
//, v_email nvarchar2, v_companyName nvarchar2
//, v_phoneNumber nvarchar2, v_firstName nvarchar2
//, v_lastName nvarchar2, cur_result out t_cursor)



router.get('/testdb', function(req, res) {
    var params = [
        {param: 'v_userName', value: 'test1'},
        {param: 'v_password', value: 'UPONE8WHIC1Ko8GEV6YZGQ=='},
        {param: 'v_email', value: 'mazda@ignitemedia.com'},
        {param: 'v_companyName', value: 'ignitetest1'},
        {param: 'v_phoneNumber', value: '1234567890'},
        {param: 'v_firstName', value: 'mazda'},
        {param: 'v_lastName', value: 'ebrahimi'}
    ];
    var cursors = [
        {cursor: 'cur_result'},
        {cursor: 'cur_result2'}
    ];

    db.execProc('SIVR.createCompany',
    params,
    cursors,
    function(j) {
        console.log('got back from execdb', j);
        res.json(j);
        return;
    });

});
module.exports = router;
