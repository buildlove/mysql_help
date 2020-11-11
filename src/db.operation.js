let mysql = require('mysql');
let logger = require('./logger');
let pools = {};               // 所有数据库连接进程池
let env = 'dev'
/**
 * sql 查询数据库
 * @param {*} database 数据库名称
 */
function db_operation(msconfig) {
  let database = msconfig.database
  env = msconfig.env
  if (database && !pools[database]){ // 只有在没有进程连接时创建
    pools[database] = mysql.createPool(msconfig)
  }else{
    pools["default"] = mysql.createPool({
      host: msconfig.host,
      user: msconfig.user,
      password: msconfig.password
    })
  }

  this.pool = database?pools[database]:pools["default"];
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
      // console.log(result, 'ppppp')
      if (err) {
        reject(err);
      } else {
        if (result && result.insertId > -1) {
          resolve({ status: 1, msg: text + "success", insertId: result.insertId });
        } else {
          resolve({ status: 0, msg: text + 'failed' });
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
          resolve({ status: 1, msg: text + 'success' });
        } else {
          resolve({ status: 0, msg: text + 'failed' });
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
          resolve({ status: 1, result: r.length});
        } else {
          resolve({ status: 0, msg: text + 'failed' });
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
          resolve({ status: 0, msg: text + 'select failed' });
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
          resolve({ status: 0, msg: 'client connetion failed' });
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
      if(err){logger.error(err)}
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
      // logger.error(err);
      logger.debug("db connetion failed")
    } else {
      connection.query(sql, function (error, results, fields) {
        cb(error, results, fields);
        connection.release();
        if (error) {
          // logger.error(error);
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
  if (env === 'dev' && !sql.includes('count(*)') && !sql.includes('COUNT(*)')) {
    logger.debug(sql)
  }
}

db_operation.prototype._pools = pools

module.exports = db_operation