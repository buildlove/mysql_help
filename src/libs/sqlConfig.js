'use strict';

// Configure mysql_help database and data table structure
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

const sqlConfig = async function(config, cb) {
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  if (!config || !config.mysql) {
    logger.error('Parameter error: No configuration database parameters');
    return;
  }
  if (!config.mysql.database) {
    logger.error('Parameter error: database name is not passed in');
    return;
  }

  const [ empty, p=[] ] = dbValidEmpty(config.mysql);

  if (!empty) {
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql), 'a');
    } else {
      await fsWriteFile(fileDir, 'config.json', JSON.stringify(config.mysql));
    }
  } else {
    // @ts-ignore
    logger.error(`Parameter error: database configuration: ${p && p.length ? p + 'Is null' : 'Missing or missing field'}`);
    return;
  }
  if(config.mysql.env === 'dev'){
    logger.debug(config.mysql)
  }
  const dbEnum = await getDbStruction(config.mysql);

  // Use the mix of incoming table data and read data table data
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
  cb(mysql_config);
};

// If the database does not exist, create a database and create a table by field
async function initDataBase(dbEnum, config) {
  let db_operation = new operation(config.mysql);
  const isExistSql = IsExistDBSQL(config.mysql);
  const exist = await db_operation.select(isExistSql, '');
  if (!exist.status) {
    const createDBSQL = CreateDatabaseSQL(config.mysql);
    await db_operation.select(createDBSQL, ''); // Create database

    // Instantiate to connect to the database
    db_operation = new operation(config.mysql);
    const dbEnumKeys = Object.keys(dbEnum);
    const dbPromise = [];
    if (dbEnumKeys && dbEnumKeys.length) {
      // Create a table according to the table fields when the table structure exists
      dbEnumKeys.forEach(function(tableName) {
        const createDBTableSQL = CreateDBTable(config.mysql, tableName, dbEnum[tableName]);
        const tab = db_operation.insert(createDBTableSQL, '');
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

// Get the table name in the database and the field name in the table according to the database name
async function getDbStruction(mysql) {
  const tablesSQL = GetAllTableNameSQL(mysql);
  const db_operation = new operation(mysql);
  const results = await db_operation.query(tablesSQL);
  // console.log("Get all database table names", results)
  const db_struction = {};
  results.forEach(function(RowDataPacket) {
    // mac -> TABLE_NAME  linux -> table_name
    const columnSQL = GetAllColumnName(mysql, RowDataPacket.TABLE_NAME || RowDataPacket.table_name);
    db_struction[RowDataPacket.TABLE_NAME || RowDataPacket.table_name] = db_operation.query(columnSQL);
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
          db_struction[keys[i]][R.COLUMN_NAME || R.column_name] = '';
        }
        // query primary key
        const kSQL = GetPrimaryKeySQL(keys[i]);
        const k = await db_operation.query(kSQL);
        if (k && k.length) {

          // When there is more than one unique key in the data structure, 
          // match the value existing in the current data structure
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
      // Structured table structure is written into column.json table
      fsWriteFile('./config', 'column.json', JSON.stringify(db_struction)).then(function(r) {
        resolve(db_struction);
      });
    });
  });
}

module.exports = sqlConfig;
