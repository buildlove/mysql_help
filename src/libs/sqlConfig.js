// 配置 mysql_help 数据库和数据表结构
let operation = require('../db.operation');
let path = require('path');
let fs = require('fs');
let {
  CreateDatabaseSQL,
  CreateDBTable,
  GetPrimaryKeySQL,
  GetAllTableNameSQL,
  GetAllColumnName,
  IsExistDBSQL
} = require('./getSQL/index.js');
let {fsWriteFile, dbValidEmpty} = require('../common.js')
let fileDir = path.join(__dirname,'../', 'config')
let mysql_config = null

const sqlConfig = async function(dbName, config){
  if(!dbName){
    console.log('参数错误: 数据库名称未传入')
    return
  }
  await fsWriteFile(fileDir, 'dbName.json', JSON.stringify({dbName: dbName}))

  if(!config || !config.mysql){
    console.log('参数错误: 没有配置数据库参数')
    return
  }

  let [empty, p] = dbValidEmpty(config.mysql)
  if(!empty){
    console.log(fileDir)
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql), 'a')
    }else{
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql))
    }
    
  }else{
    console.log(`参数错误: 数据库配置:${p.length? p+ '为空': '不存在或缺少字段'}`)
    return
  }

  let dbEnum = await get_db_struction(dbName, config.mysql)

  // 使用传入表数据和读取数据表数据混合
  if(config.tables){
    Object.keys(config.tables).forEach(function(key){
      if(!dbEnum[key]){
        dbEnum[key] = config.tables[key]
      }
    })
  }
  mysql_config = {
    dbName: dbName,
    config: {
      mysql: config.mysql,
      dbEnum: dbEnum
    }
  }
  initDataBase(dbName, dbEnum, config)
  return mysql_config
}

// 如果数据库不存在 创建数据库和按字段创建表
async function initDataBase(dbName, dbEnum, config){
  let db_operation = new operation('', config.mysql)
  let isExistSql = IsExistDBSQL(dbName)
  let exist = await db_operation.select(isExistSql)
  if(!exist.status){
    let createDBSQL = CreateDatabaseSQL(dbName)
    await db_operation.select(createDBSQL) // 创建数据库

    // 实例化连接数据库
    db_operation = new operation(dbName, config.mysql)
    let dbEnumKeys = Object.keys(dbEnum)
    let dbPromise = []
    if(dbEnumKeys && dbEnumKeys.length){
      // 表结构存在的情况下按照表字段创建表
      dbEnumKeys.forEach(function(tableName){
        let createDBTableSQL = CreateDBTable(dbName, tableName, dbEnum[tableName])
        let tab = db_operation.insert(createDBTableSQL)
        dbPromise.push(tab)
      })
      Promise.all(dbPromise).then(function(result){
        console.log('create db success')
      })
    }
  }else{
    console.log('Init Databases success')
  }
}

// 根据数据库名称 获取数据库内的表名称和表里面的字段名称
async function get_db_struction(dbName, config){
  let tablesSQL = GetAllTableNameSQL(dbName)
  let db_operation = new operation(dbName, config)
  let results = await db_operation.query(tablesSQL)
  let db_struction = {}
  results.forEach(function(RowDataPacket){
    let columnSQL = GetAllColumnName(dbName, RowDataPacket.TABLE_NAME)
    db_struction[RowDataPacket.TABLE_NAME] = db_operation.query(columnSQL)
  })
  let keys = Object.keys(db_struction)
  let values = Object.values(db_struction)
  return new Promise(function(resolve){
    Promise.all(values).then(async function(proR){
      for (let i = 0; i < proR.length; i++) {
        const allR = proR[i];
        // 查找primary key
        let kSQL = GetPrimaryKeySQL(keys[i])
        let k = await db_operation.query(kSQL)
        db_struction[keys[i]] = {}
        for (let j = 0; j < allR.length; j++) {
          const R = allR[j];
          db_struction[keys[i]][R.COLUMN_NAME] = ""
        }
        if(k && k[0] && k[0].column_name){
          db_struction[keys[i]][k[0].column_name] = "primary"
        }
      }
      // 结构化表结构写入 column.json表中
      fsWriteFile('./config', 'column.json', JSON.stringify(db_struction)).then(function(r){
        resolve(db_struction)
      })
    })
  })
}

module.exports = sqlConfig