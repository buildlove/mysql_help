'use strict';

// 配置 mysql_help 数据库和数据表结构
const operation = require('../db.operation');
const logger = require('../logger');
const path = require('path');
const fs = require('fs');
const {
  CreateDatabaseSQL,
  CreateDBTable,
  GetPrimaryKeySQL,
  GetAllTableNameSQL,
  GetAllColumnName,
  IsExistDBSQL,
} = require('./getSQL/index.js');
const { fsWriteFile, dbValidEmpty } = require('../common.js');
const fileDir = path.join(__dirname, '../', 'config');
let mysql_config = null;

const sqlConfig = async function(config) {
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  if (!config || !config.mysql) {
    logger.error('参数错误: 没有配置数据库参数');
    return;
  }
  if (!config.mysql.database) {
    logger.error('参数错误: 数据库名称未传入');
    return;
  }

  const [ empty, p ] = dbValidEmpty(config.mysql);
  if (!empty) {
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql), 'a');
    } else {
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql));
    }
  } else {
    logger.error(`参数错误: 数据库配置:${p.length ? p + '为空' : '不存在或缺少字段'}`);
    return;
  }
  if(config.mysql.env === 'dev'){
    logger.debug(config.mysql)
  }
  const dbEnum = await get_db_struction(config.mysql);

  // 使用传入表数据和读取数据表数据混合
  if (config.tables) {
    Object.keys(config.tables).forEach(function(key) {
      if (!dbEnum[key]) {
        dbEnum[key] = config.tables[key];
      }
    });
  }
  mysql_config = {
    database: config.mysql.database,
    config: {
      mysql: config.mysql,
      dbEnum,
    },
  };
  initDataBase(dbEnum, config);
  return mysql_config;
};

// 如果数据库不存在 创建数据库和按字段创建表
async function initDataBase(dbEnum, config) {
  let db_operation = new operation(config.mysql);
  const isExistSql = IsExistDBSQL(config.mysql);
  const exist = await db_operation.select(isExistSql);
  if (!exist.status) {
    const createDBSQL = CreateDatabaseSQL(config.mysql);
    await db_operation.select(createDBSQL); // 创建数据库

    // 实例化连接数据库
    db_operation = new operation(config.mysql);
    const dbEnumKeys = Object.keys(dbEnum);
    const dbPromise = [];
    if (dbEnumKeys && dbEnumKeys.length) {
      // 表结构存在的情况下按照表字段创建表
      dbEnumKeys.forEach(function(tableName) {
        const createDBTableSQL = CreateDBTable(config.mysql, tableName, dbEnum[tableName]);
        const tab = db_operation.insert(createDBTableSQL);
        dbPromise.push(tab);
      });
      Promise.all(dbPromise).then(function(result) {
        logger.debug('create db success');
      });
    }
  } else {
    logger.debug('Init Databases success');
  }
}

// 根据数据库名称 获取数据库内的表名称和表里面的字段名称
async function get_db_struction(mysql) {
  const tablesSQL = GetAllTableNameSQL(mysql);
  const db_operation = new operation(mysql);
  const results = await db_operation.query(tablesSQL);
  const db_struction = {};
  results.forEach(async function(RowDataPacket) {
    const columnSQL = GetAllColumnName(mysql, RowDataPacket.TABLE_NAME);
    db_struction[RowDataPacket.TABLE_NAME] = db_operation.query(columnSQL);
  });
  const keys = Object.keys(db_struction);
  const values = Object.values(db_struction);
  return new Promise(function(resolve) {
    Promise.all(values).then(async function(proR) {
      for (let i = 0; i < proR.length; i++) {
        const allR = proR[i];
        db_struction[keys[i]] = {};
        for (let j = 0; j < allR.length; j++) {
          const R = allR[j];
          db_struction[keys[i]][R.COLUMN_NAME] = '';
        }
        // 查找primary key
        const kSQL = GetPrimaryKeySQL(keys[i]);
        const k = await db_operation.query(kSQL);
        if (k && k.length) {

          // 数据结构内的唯一键不止一个时, 匹配当前数据结构存在的值
          let columns = Object.keys(db_struction[keys[i]])
          let primary = false
          k.forEach(function(item){
            if(columns.includes(item.column_name) && !primary){
              db_struction[keys[i]][item.column_name] = 'primary';
              primary = true;
            }
          })
          if(!primary){
            logger.debug(`没有查询到 ${keys[i]} 数据表的 primary 值`)
          }
        } else {
          logger.debug(kSQL)
          logger.debug(keys[i] + ' 表没有查询到 primary 值')
        }
      }
      // 结构化表结构写入 column.json表中
      fsWriteFile('./config', 'column.json', JSON.stringify(db_struction)).then(function(r) {
        resolve(db_struction);
      });
    });
  });
}

module.exports = sqlConfig;
