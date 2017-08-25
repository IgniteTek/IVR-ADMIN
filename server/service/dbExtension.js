var oracledb = require('oracledb');
var async = require('async');

oracledb.execProc = function(procName, inputParams, cursors, cb) {

    console.log(procName, inputParams, cursors);
    oracledb.outFormat = oracledb.OBJECT;
    oracledb.getConnection( function(err, connection) {
        if (err) {
        console.error(err.message);
        return;
        }


        var bindVars = {};
        var cmd = 'call ' + procName;
        if (inputParams.length + cursors.length>0) {
            cmd += '(';
            for(var i=0; i<inputParams.length; i++) {
                if(cmd.slice(-1)!='(') {
                    cmd += ',';
                }
                console.log('adding', inputParams[i].param, inputParams[i].value);
                bindVars[inputParams[i].param] = inputParams[i].value;
                cmd += ':' + inputParams[i].param
            }
            for(var i=0; i<cursors.length; i++) {
                if(cmd.slice(-1)!='(') {
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
            //console.log(result);
            //console.log(err);
            console.log("cursors:", cursors);
            var outp = {};

            async.eachSeries(cursors, function iteratee(c, scb) {
                var x = c.cursor
                console.log("forming results for ", x);
                var rs = result.outBinds[x].getRows(100, function(err, rows) {
                    outp[x] = rows;
                    result.outBinds[x].close();
                    scb();
                });

            }, 
            function(err){
                connection.close();
                cb(outp);
                return;
            });
        });
        
    });

    


}
module.exports = oracledb;