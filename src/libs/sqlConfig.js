// 配置 mysql_help 数据库和数据表结构
let operation = require('../db.operation');
let CreateDatabaseSQL = require('./getSQL/CreateDatabaseSQL');
let CreateDBTable = require('./getSQL/CreateDBTable');

const sqlConfig = function(dbName, config){
  // 缓存全局配置(这个地方是否需要设置多个数据库操作?需要的情况下不能)
  process.env.mysql_help = JSON.stringify({
    dbName: dbName,
    config: config
  })
  // 如果数据库不存在创建数据库
  let db_operation = new operation('', config.config.mysql)
  let createDBSQL = CreateDatabaseSQL(dbName)
  db_operation.insert(createDBSQL).then(function(result){

    db_operation = new operation(dbName, config.config.mysql)
    // 如果表不存在创建表
    let dbEnum = Object.keys(config.dbEnum)
    let dbPromise = []
    dbEnum.forEach(function(tableName){
      let createDBTableSQL = CreateDBTable(dbName, tableName, config.dbEnum[tableName])
      let tab = db_operation.insert(createDBTableSQL)
      dbPromise.push(tab)
    })
    Promise.all(dbPromise).then(function(result){
      console.log('Init Databases success')
    })
  })
}

module.exports = {
  config,
  dbName,
  sqlConfig
}