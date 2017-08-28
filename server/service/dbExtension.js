/*eslint-env node*/
/* eslint-disable  no-console */

'use strict';

var oracledb = require('oracledb');
var async = require('async');
var inspect = require('eyes').inspector({
  stream: null,
  colors: false
});

oracledb.execProc = function(procName, inputParams, cursors, cb) {

  console.log(procName, inputParams, cursors);
  oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }

    var bindVars = {};
    var cmd = 'call ' + procName;
    if (inputParams.length + cursors.length > 0) {
      cmd += '(';
      for (var i = 0; i < inputParams.length; i++) {
        if (cmd.slice(-1) != '(') {
          cmd += ',';
        }
        console.log('adding', inputParams[i].param, inputParams[i].value);
        bindVars[inputParams[i].param] = inputParams[i].value;
        cmd += ':' + inputParams[i].param;
      }
      for (i = 0; i < cursors.length; i++) {
        if (cmd.slice(-1) != '(') {
          cmd += ',';
        }
        console.log('adding', cursors[i]);
        bindVars[cursors[i].cursor] = {
          type: oracledb.CURSOR,
          dir: oracledb.BIND_OUT,
        };
        cmd += ':' + [cursors[i].cursor];

      }
      cmd += ')';
    }

    connection.execute(
      // The statement to execute
      cmd, bindVars,
      function(err, result) {
        console.log(result);
        console.log(err);
        console.log('cursors:', cursors);
        var outp = {};
        if (err) {
          connection.close();
          cb(err,outp);
          return;
        }
        async.eachSeries(cursors, function iteratee(c, scb) {
            var x = c.cursor;
            result.outBinds[x].getRows(10000, function(err, rows) {
              if (err) {
                connection.close();
                cb(err,outp);
                return;
              }
              outp[x] = rows;
              result.outBinds[x].close(function(err) {
                scb();
              });
            });

          },
          function(err) {
            connection.close();
            cb(err,outp);
            return;
          });
      });

  });




};
module.exports = oracledb;
