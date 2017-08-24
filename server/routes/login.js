/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

var express = require('express');
var router = express.Router();
var Encryption = require('../service/encryption');
var oracledb = require('oracledb');

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
router.get('/decryptPassword', function(req, res) {
  console.log('decrypt is:', Encryption.Decrypt(req.query['password']));
  res.sendStatus(200);

});
router.post('/loginUser', function(req, res) {
  var usr = {};
  console.log(inspect(req.body));
  var user = req.body.params.user;
  var password = req.body.params.password;

  password = Encryption.Encrypt(password);
  console.log('Encrypted password:' + password);
  console.log('password: ' + password + ', userName: ' + user);


  oracledb.getConnection(
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var bindVars = {
        v_x: 'joe',
        v_y: 'john doe',
        ret: {
          type: oracledb.CURSOR,
          dir: oracledb.BIND_OUT,
        }
      };
      connection.execute(
        // The statement to execute
        'select * from SIVR_USERS where USER_NAME=:un and USER_PASS=:p', [user, password],
        function(err, result) {
          if (err || result.rows.length==0) {
            console.error(err.message);
            connection.close(
              function(err) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(401).json({
                error: err.message,
                message: 'login failed'
              });
            return;
          }
          if (result.rows.length > 0) {
            usr.email = 'test@1.com';
            usr.userName = result.rows[0][2];
            usr.accountName = 'test account';
            usr.accountId = 1;
            usr.userId = 1;
            usr.categorizationAttribute = null;
            usr.categorizationDisplayName = null;
            usr.userAttribute = null;
            usr.userDisplayName = null;
            usr.defaultDateRange = null;
            usr.categorizationJson = null;
            usr.statusJson = null;
            usr.permissionJson = null;
            usr.assignmentAttr = null;
            usr.accountOptions = null;
            usr.commentJSON = null;
            usr.ratingJSON = null;
            usr.homeFolder = null;

            var new_token = uuid.v4();
            cacheEngine.addApiToken(new_token, usr.userId);
            res.json({
              success: true,
              token: new_token,
              user: usr
            });

          }
          return;
          /*      result.outBinds.ret.getRows(10, function(err, rows) {
                  if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                  }
                  if (rows.length) {
                    console.log(rows);
                    getRows(result);
                    return;
                  }*/
        });
    });
});
router.post('/changePassword', function(req, res) {
  var userid = req.body.params.userid;
  var password = Encryption.Encrypt(req.body.params.password);
  var err;

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

router.post('/logoutUser', function(req, res) {
  var userid = req.query.userid;
  var err;
  //cacheEngine.removeApiToken(token, userid);
  var response=1;
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

module.exports = router;
