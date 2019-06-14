let mysql = require('mysql');

let pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'Lixiaoqi2468',
})

pool.getConnection(function (err, connection) {
  if (err) {
    logger.error(err);
    throw err
  }
  const AddDataSQL = require('./getSQL/AddDataSQL');
  const CreateDatabaseSQL = require('./getSQL/CreateDatabaseSQL');
  const CreateDBTable = require('./getSQL/CreateDBTable');
  const DeleteRowsSQL = require('./getSQL/DeleteRowsSQL');
  const GetAllRowsSQL = require('./getSQL/GetAllRowsSQL.js.js.js')
  const GetAllTableNameSQL = require('./getSQL/GetAllTableNameSQL.js.js.js')
  const GetAllColumnName = require('./getSQL/GetAllColumnName.js.js.js')
  const GetRowsByPageSQL = require('./getSQL/GetRowsByPageSQL.js.js.js')
  const GetRowsByIdsSQL = require('./getSQL/GetRowsByIdsSQL.js.js.js')
  const GetRowsByWhereSQL = require('./getSQL/GetRowsByWhereSQL.js.js.js')
  const IsExistDBSQL = require('./getSQL/IsExistDBSQL.js.js.js')
  const UpdateRowSQL = require('./getSQL/UpdateRowSQL.js.js.js')
  const UpdateRowsSQL = require('./getSQL/UpdateRowsSQL.js.js.js')
  let tablesSQL = GetAllTableNameSQL('jobs')

  function query(sql){
    return new Promise(function(resolve, reject){
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err)
        }
        connection.query(sql, function (error, results, fields) {
          resolve(results)
          connection.release();
        })
      })
    })
  }
})





// # npm 包发布

// https://www.npmjs.com/

// $ npm version 0.1.1

// $ npm publish