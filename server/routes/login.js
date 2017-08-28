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

  oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var bindVars = {
        v_userName: user,
        v_password: password,
        cur_result: {
          type: oracledb.CURSOR,
          dir: oracledb.BIND_OUT,
        }
      };
      connection.execute(
        // The statement to execute
        'call SIVR.login(:v_userName, :v_password,:cur_result)', bindVars,
        function(err, result) {
          console.error(err);
          if (err) {
            res.status(401).json({
              error: 'DB error',
              message: 'login failed'
            });
            connection.close();
            return;
          }
          result.outBinds.cur_result.getRows(100, function(err, rows) {
            if (err || rows.length == 0) {
              if (err == undefined) {
                err = {
                  message: 'Invalid Login'
                };
              }
              console.error(inspect(err));
              result.outBinds.cur_result.close(function(err) {
                connection.close();
              });
              res.status(401).json({
                error: err.message,
                message: 'login failed'
              });
              return;
            }
            if (rows.length > 0) {
              console.log('rows : ' + inspect(rows));
              usr.email = rows[0].EMAIL;
              usr.userName = rows[0].USER_NAME;
              usr.accountName = rows[0].COMPANY_NAME;
              usr.accountId = rows[0].COMPANY_ID;
              usr.userId = rows[0].ID;
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
              result.outBinds.cur_result.close(function(err) {
                connection.close();
              });
              return;
            }

          });
          return;
        });
    });
});


router.post('/createAccount', function(req, res) {
  console.log(req.body);
  if (!req.body.user_name || !req.body.password) {
    res.json({
      error: 'Must provide user name and password'
    });
    res.end();
    return;
  }
  var password = Encryption.Encrypt(req.body.password);

  var params = [{
      param: 'v_userName',
      value: req.body.user_name
    },
    {
      param: 'v_password',
      value: password
    },
    {
      param: 'v_email',
      value: req.body.email
    },
    {
      param: 'v_companyName',
      value: req.body.company_name
    },
    {
      param: 'v_phoneNumber',
      value: req.body.phone
    },
    {
      param: 'v_firstName',
      value: req.body.first_name
    },
    {
      param: 'v_lastName',
      value: req.body.last_name
    }
  ];
  var cursors = [{
      cursor: 'cur_result'
    },
    {
      cursor: 'cur_result2'
    }
  ];
  oracledb.execProc('SIVR.createCompany',
    params,
    cursors,
    function(err, j) {
      console.log(err);
      if (err || j.cur_result2.length == 0) {
        res.json({
          success: false,
          error: 'Error Getting Data'
        });
        return;
      }
      console.log('got back from execdb ' + inspect(j));
      if (!j.cur_result[0].SUCCESS) {
        res.json({
          success: false,
          MSG_CODE: j.cur_result[0].MSG_CODE,
          MSG: j.cur_result[0].MSG
        });
        return;
      }
      res.json({
        success: true
      });
      return;
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
  var response = 1;
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
