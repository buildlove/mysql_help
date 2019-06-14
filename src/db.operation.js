let mysql = require('mysql');
let logger = require('./logger');
let pools = {};               // 所有数据库连接进程池

/**
 * sql 查询数据库
 * @param {*} dbName 数据库名称
 */
function db_operation(msconfig) {
  let dbName = msconfig.database
  if (dbName && !pools[dbName]){ // 只有在没有进程连接时创建
    pools[dbName] = mysql.createPool(msconfig)
  }else{
    pools["default"] = mysql.createPool({
      host: msconfig.host,
      user: msconfig.user,
      password: msconfig.password
    })
  }

  this.pool = dbName?pools[dbName]:pools["default"];
}

/**
 * 新增数据
 * @param {*} sql               mysql语句
 * @param {*} text              提示文字 
 */
db_operation.prototype.insert = function (sql, text) {
  let me = this

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.insertId > -1) {
          resolve({ status: 1, msg: text + "成功" });
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
db_operation.prototype.delete = function (sql, text) {
  let me = this;

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
db_operation.prototype.update = function (sql, text) {
  let me = this;

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.affectedRows > 0) {
          let r = []
          for(let i=0;i< result.affectedRows;i++){
            r.push("1")
          }
          resolve({ status: 1, result: r});
        } else {
          resolve({ status: 0, msg: text + '失败' });
        }
      }
    })
  })
}

/**
 * 查询数据库数据
 */
db_operation.prototype.select = function (sql, text) {
  let me = this;

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

db_operation.prototype.client = function (sql) {
  let me = this;

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      // console.log(reuslt, fields)
      if (err) {
        reject(err);
      } else {
        if (result && result.affectedRows > 0) {
          let r = []
          for(let i=0;i< result.affectedRows;i++){
            r.push("1")
          }
          resolve({ status: 1, result: r});
        } else {
          resolve({ status: 0, msg: '连接失败' });
        }
      }
    })
  })
}

// 简单 sql 连接 promise 返回、释放
db_operation.prototype.query = function(sql) {
  let me = this;
  return new Promise(function(resolve, reject){
    me._getConnetion(sql, function (err, results) {
      if(err){console.log(err)}
      resolve(results)
    })
  })
}

/**
 * 直接放入 sql 连接数据库进程池
 */
db_operation.prototype._getConnetion = function (sql, cb) {
  this.pool.getConnection(function (err, connection) {
    if (err) {
      logger.error(err);
      console.log("连接数据库失败")
    } else {
      connection.query(sql, function (error, results, fields) {
        cb(error, results, fields);
        connection.release();
        if (error) {
          logger.error(error);
        }
      })
    }
  })
}

/**
 * 调试打印
 * @private
 */
db_operation.prototype._debug = function (sql) {
  if (process && process.env && process.env.npm_lifecycle_event && process.env.npm_lifecycle_event === 'start') {
    console.log('-----------------------')
    console.log(sql)
  }
}

module.exports = db_operation