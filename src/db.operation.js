let mysql = require('mysql');
let logger = require('./logger')();
let pools = {};               // 所有数据库连接进程池

/**
 * sql 查询数据库
 * @param {*} dbName 数据库名称
 */
function db_operation(dbName, msconfig) {
  if (!pools[dbName]){ // 只有在没有进程连接时创建
    pools[dbName] = mysql.createPool({
      host: msconfig.host,
      user: msconfig.user,
      password: msconfig.password,
      database: dbName
    })
  }

  this.pool = pools[dbName];
}

/**
 * 新增数据
 * @param {*} tableName         表名称
 * @param {*} data <array>    需要添加的数据
 * @param {*} text              提示文字 
 */
db_operation.prototype.insert = function (tableName, data, text) {
  let args = data && Array.isArray(data) ? data:[data]
  let me = this;
  let v = ""
  for(let i=0;i<args.length;i++){
    let newVal = []
    let values = args[i]
    values.forEach(function (value) {
      newVal.push('"' + value + '"')
    })
    let b = ','
    if(args.length === i+1){
      b = ';'
    }
    v += ' (' + newVal.join(",") + ')' + b;
  }
  let sql = `INSERT INTO ${tableName} VALUES${v}`;

  this._debug(sql)

  return new Promise(function (resolve, reject) {
    me._getConnetion(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        if (result && result.insertId > -1) {
          resolve({ status: 1, msg: text + "成功", result: args });
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
 * 按照页码查询数据
 * @param {number} pageNum 当前第N页
 * @param {number} everyPageNum 每页N页
 */
db_operation.prototype.selectByPageCount = function (tableName, pageNum, everyPageNum, where) {
  let me = this;//where userid = 0
  let sql = ""
  if(where) {
    sql = `select * from ${tableName} `+ where +` order by create_time limit ${pageNum},${everyPageNum}`;
  }else{
    sql = `select * from ${tableName} order by create_time limit ${pageNum},${everyPageNum}`;
  }
  

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
          resolve({ status: 0, msg: '连接失败' });
        }
      }
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
      throw err
    }
    connection.query(sql, function (error, results, fields) {
      cb(error, results, fields);
      connection.release();
      if (error) {
        logger.error(error);
      }
    })
  })
}

/**
 * 调试打印
 * @private
 */
db_operation.prototype._debug = function (sql) {
  // if (process.env.DEBUG === 'dev') {
    console.log('-----------------------')
    console.log(sql)
  // }
}

module.exports = db_operation