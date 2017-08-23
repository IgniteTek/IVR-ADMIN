var oracledb = require('oracledb');

oracledb.createPool({
    user: 'TEST_S603090DC3ORA03',
    password: '1Kapets#',
    connectString: '(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=stats.ctw71eo2joww.us-east-1.rds.amazonaws.com)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=ORCL)))'
  },
  function(err, pool) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Oracle Pool Created');
  });

setTimeout(runQuery, 100);

function runQuery() {
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
        'call SIVR.sivr_test (:v_x, :v_y,:ret)',

        // The "bind value" 180 for the "bind variable" :id
        bindVars,

        // Optional execute options argument, such as the query result format
        // or whether to get extra metadata
        // { outFormat: oracledb.OBJECT, extendedMetaData: true },

        // The callback function handles the SQL execution results
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          //console.log(result.outBinds.ret);
          getRows(result);

          //console.log(result); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
          //doRelease(connection);
        });

    });
}

function getRows(result) {
  result.outBinds.ret.getRows(10, function(err, rows) {
    if (err) {
      console.error(err.message);
      doRelease(connection);
      return;
    }
    if (rows.length) {
      console.log(rows);
      getRows(result);
      return;
    }
    console.log('finished');
  });
}


// Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
