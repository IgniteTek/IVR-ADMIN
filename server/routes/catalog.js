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


router.get('/addCatalogItem', function(req, res) {
    var params = [
        {param: 'v_companyId', value: req.query.companyId},
        {param: 'v_productName', value: req.query.productName},
        {param: 'v_productCode', value: req.query.productCode},
        {param: 'v_sku', value: req.query.sku},
    ];
    var cursors = [
        {cursor: 'cur_result'},
        {cursor: 'cur_result2'}
    ];

    db.execProc('SIVR.addCatalogItem',
    params,
    cursors,
    function(j) {
        console.log('got back from execdb', j);
        res.json(j);
        return;
    });

});
router.get('/getCatalog', function(req, res) {
    var params = [
        {param: 'v_companyId', value: req.query.companyId}
    ];
    var cursors = [
        {cursor: 'cur_result'}
    ];

    db.execProc('SIVR.getCompanyCatalog',
    params,
    cursors,
    function(j) {
        console.log('got back from execdb', j);
        res.json(j);
        return;
    });

});
module.exports = router;
