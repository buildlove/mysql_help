let mysql = require('mysql');
let logger = require('./logger')();
let pools = {};               // 所有数据库连接进程池

/**
 * sql 查询数据库
 * @param {*} dbName 数据库名称
 */
function db_operation(dbName, msconfig) {
  // msconfig.allDbName.forEach(function (db) {
  pools[dbName] = mysql.createPool({
    host: msconfig.host,
    user: msconfig.user,
    password: msconfig.password,
    database: dbName
  })
  // });
  this.pool = pools[dbName];
}

/**
 * 新增数据
 * @param {*} tableName         表名称
 * @param {*} values <array>    需要添加的数据
 * @param {*} text              提示文字 
 */
db_operation.prototype.insert = function (tableName, values, text) {
  let me = this;
  let newVal = []
  values.forEach(function (value) {
    newVal.push('"' + value + '"')
  })
  let v = newVal.join(",");
  let sql = `INSERT INTO ${tableName} VALUES (${v})`;

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.insertId > -1) {
          resolve({ status: 1, msg: text + "成功", result: values });
        } else {
          resolve({ status: 0, msg: text + '失败' });
        }
      }
    })
  })
}

/**
 * 删除数据库数据
 * @param {*} tableName 表名称
 * @param {*} where     条件判断
 * @param {*} text      提示文字
 */
db_operation.prototype.delete = function (tableName, where, text) {
  let me = this;
  let sql = `delete from ${tableName} where ${where}`

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.affectedRows > 0) {
          resolve({ status: 1, msg: text + '成功' });
        } else {
          resolve({ status: 0, msg: text + '失败' });
        }
      }
    })
  })
}

/**
 * 更新数据库数据
 * @param {*} tableName 表的名称
 * @param {*} args      查询条件
 * @param {*} text      提示文字
 */
db_operation.prototype.update = function (tableName, args, text) {
  let me = this;
  delete tableName.userid
  let sql = `update ${tableName} set ${args.keys.join(",")} where ${args.where}`

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.affectedRows > 0) {
          resolve({ status: 1, msg: text + '成功' });
        } else {
          resolve({ status: 0, msg: text + '失败' });
        }
      }
    })
  })
}

/**
 * 查询数据库所有数据
 * @param {*} tableName 
 */
db_operation.prototype.selectAll = function (tableName) {
  let me = this;
  let sql = `select * from ${tableName}`;
  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.length) {
          resolve({ status: 1, result: result });
        } else {
          resolve({ status: 0, msg: '没有查询到任何数据' });
        }
      }
    })
  })
}

/**
 * 查询数据库数据
 */
db_operation.prototype.select = function (tableName, where, text) {
  let me = this;
  let sql = `select * from ${tableName} where ${where}`;

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.length) {
          resolve({ status: 1, result: result });
        } else {
          resolve({ status: 0, msg: text + '失败' });
        }
      }
    })
  })
}

/**
 * 连接数据库进程池
 * @private
 */
db_operation.prototype._getConnetion = function (sql, cb) {
  this.pool.getConnection(function (err, connection) {
    if (err) {
      logger.error(err);
      throw err
    }
    connection.query(sql, function (error, results, fields) {
      if (error) {
        logger.error(error);
      }
      cb(error, results, fields);
      connection.release();
    })
  })
}

/**
 * 调试打印
 * @private
 */
db_operation.prototype._debug = function (sql) {
  if (process.env == 'development') {
    console.log('-----------------------')
    console.log(sql)
  }
}

module.exports = function (dbName, msconfig){
  return new db_operation(dbName, msconfig);
};
