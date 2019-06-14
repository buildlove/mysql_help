'use strict';

// 配置 mysql_help 数据库和数据表结构
const operation = require('../db.operation');
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
  let dbName = config.mysql.db
  if (!dbName) {
    console.log('参数错误: 数据库名称未传入');
    return;
  }

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }

  if (!config || !config.mysql) {
    console.log('参数错误: 没有配置数据库参数');
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
    console.log(`参数错误: 数据库配置:${p.length ? p + '为空' : '不存在或缺少字段'}`);
    return;
  }

  const dbEnum = await get_db_struction(dbName, config.mysql);

  // 使用传入表数据和读取数据表数据混合
  if (config.tables) {
    Object.keys(config.tables).forEach(function(key) {
      if (!dbEnum[key]) {
        dbEnum[key] = config.tables[key];
      }
    });
  }
  mysql_config = {
    dbName,
    config: {
      mysql: config.mysql,
      dbEnum,
    },
  };
  initDataBase(dbName, dbEnum, config);
  return mysql_config;
};

// 如果数据库不存在 创建数据库和按字段创建表
async function initDataBase(dbName, dbEnum, config) {
  let db_operation = new operation('', config.mysql);
  const isExistSql = IsExistDBSQL(dbName);
  const exist = await db_operation.select(isExistSql);
  if (!exist.status) {
    const createDBSQL = CreateDatabaseSQL(dbName);
    await db_operation.select(createDBSQL); // 创建数据库

    // 实例化连接数据库
    db_operation = new operation(dbName, config.mysql);
    const dbEnumKeys = Object.keys(dbEnum);
    const dbPromise = [];
    if (dbEnumKeys && dbEnumKeys.length) {
      // 表结构存在的情况下按照表字段创建表
      dbEnumKeys.forEach(function(tableName) {
        const createDBTableSQL = CreateDBTable(dbName, tableName, dbEnum[tableName]);
        const tab = db_operation.insert(createDBTableSQL);
        dbPromise.push(tab);
      });
      Promise.all(dbPromise).then(function(result) {
        console.log('create db success');
      });
    }
  } else {
    console.log('Init Databases success');
  }
}

// 根据数据库名称 获取数据库内的表名称和表里面的字段名称
async function get_db_struction(dbName, config) {
  const tablesSQL = GetAllTableNameSQL(dbName);
  const db_operation = new operation(dbName, config);
  const results = await db_operation.query(tablesSQL);
  const db_struction = {};
  results.forEach(function(RowDataPacket) {
    const columnSQL = GetAllColumnName(dbName, RowDataPacket.TABLE_NAME);
    db_struction[RowDataPacket.TABLE_NAME] = db_operation.query(columnSQL);
  });
  const keys = Object.keys(db_struction);
  const values = Object.values(db_struction);
  return new Promise(function(resolve) {
    Promise.all(values).then(async function(proR) {
      for (let i = 0; i < proR.length; i++) {
        const allR = proR[i];
        // 查找primary key
        const kSQL = GetPrimaryKeySQL(keys[i]);
        const k = await db_operation.query(kSQL);
        db_struction[keys[i]] = {};
        for (let j = 0; j < allR.length; j++) {
          const R = allR[j];
          db_struction[keys[i]][R.COLUMN_NAME] = '';
        }
        if (k && k[0] && k[0].column_name) {
          db_struction[keys[i]][k[0].column_name] = 'primary';
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
