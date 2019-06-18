'use strict';

const operation = require('./src/db.operation');
const common = require('./src/common');
// 获取 SQL 语句
const SQL = require('./src/libs/getSQL/index.js');
const getSQLStr = require('./src/libs/getSQLStr.js');
const sqlConfig = require('./src/libs/sqlConfig.js');
const fs = require('fs');
const path = require('path');
const logger = require('./src/logger.js')

/**
 * 通用接口入口函数
 * @param {*} tableName     数据库名称
 * @param {*} cf  表名称
 */
class mysql_help extends getSQLStr{
  constructor(tableName, cf){
    const config = cf ? cf : mysql_help.getCacheConfig();
    const dbConstruct = config.dbConstruct;
    if (!dbConstruct[tableName]) {
      logger.error('数据库中不存在' + tableName + '表');
      return;
    }
    let allConfig = {
      db_name: config.mysql.database,  // 数据库名称
      table_name: tableName, // 表名称
      dbConstruct: common.deepClone(dbConstruct[tableName]),// 表头字段
      id_name:  common.getPrimaryKey(dbConstruct[tableName])// 表头 id 字段名
    }
    super(allConfig)
    this.db_name = config.mysql.database; // 数据库名称
    this.table_name = tableName; // 表名称
    this.dbConstruct = common.deepClone(dbConstruct[tableName]); // 表头字段
    this.id_name = common.getPrimaryKey(this.dbConstruct); // 表头 id 字段名
    this.db_operation = new operation(config.mysql); // 查询数据库接口
    this.textTip = this._getTextTip(tableName, dbConstruct.textTip); // 提示文字
  }

  // 新增单条
  addRow(rowDatas) {
    const sqlResult = SQL.AddDataSQL(this, rowDatas);
    return this.db_operation.insert(sqlResult, this.textTip.create);
  }

  // 新增多条数据
  addRows(rowDatas) {
    const sqlResult = SQL.AddDataSQL(this, rowDatas);
    return this.db_operation.insert(sqlResult, this.textTip.create);
  }

  // 获取所有
  getAllRows() {
    console.log(this)
    const sql = SQL.GetAllRowsSQL(this);
    return this.db_operation.select(sql, this.textTip.find);
  };

  // 分页查询
  getRowsByPage(pageNum, everyPageNum, orderfield, wherefield) {
    const sql = SQL.GetRowsByPageSQL(this, pageNum, everyPageNum, orderfield, wherefield);
    return this.db_operation.select(sql, this.textTip.find);
  };

  // 根据索引获取数据
  getRowsByIds(ids, otherField) {
    const sql = SQL.GetRowsByIdsSQL(this, ids, otherField);
    return this.db_operation.select(sql, this.textTip.find);
  };

  // 同查询ids一样, 查询单个id
  getRowsById(id, otherField) {
    const sql = SQL.GetRowsByIdsSQL(this, id, otherField);
    return this.db_operation.select(sql, this.textTip.find);
  };

  // 获取整张表的条数
  getCount() {
    const sql = SQL.GetCountSQL(this);
    return this.db_operation.select(sql, this.textTip.find);
  };

  /**
   * 同查询id一样, 只是名称不同
   * @param {*} indexs
   * @param {*} otherField
   */
  getRowsByIndexs(indexs, otherField) {
    const sql = SQL.GetRowsByIdsSQL(this, indexs, otherField);
    return this.db_operation.select(sql, this.textTip.find);
  };

  /**
   * 根据任意字段获取相关数据
   * @param {*} field <object> 需要查询的相关字段
   * @param {*} orAnd <string> 默认为 "or" 只要满足一个及可以匹配, "and" 为需要满足所有传递的参数
   */

  getRowsByWhere(field, orAnd) {
    const sql = SQL.GetRowsByWhereSQL(this, field, orAnd);
    return this.db_operation.select(sql, this.textTip.find);
  };

  /**
   * 根据任意字段更新相关数据
   * @param {*} rowData <object> 需要更新的数据
   */
  updateRow(rowData) {
    const sql = SQL.UpdateRowSQL(this, rowData);
    return this.db_operation.update(sql, this.textTip.update);
  };

  /**
   * 根据任意字段更新相关数据
   * @param {*} rowDatas <object> 需要更新的数据集 必须要存在id字段
   */
  updateRows(rowDatas) {
    const sql = SQL.UpdateRowsSQL(this, rowDatas);
    return this.db_operation.client(sql);
  };

  // 按照 id 删除单条数据
  deleteRow (id) {
    const sql = SQL.DeleteRowsSQL(this.self, id);
    return this.db_operation.delete(sql, this.textTip.delete);
  }

  // 按照 ids 删除多条数据
  deleteRows(ids, field) {
    const sql = SQL.DeleteRowsSQL(this, ids, field);
    return this.db_operation.delete(sql, this.textTip.delete);
  };

  // 按照字段名和字段数据删除多条数据
  deleteRowsByIndex (indexs, field) {
    const sql = SQL.DeleteRowsSQL(this.self, indexs, field);
    return this.db_operation.delete(sql, this.textTip.delete);
  }

  _getTextTip(name, textTip) {
    let text = '';
    if (textTip) {
      text = textTip[name] || '';
    }
    return {
      create: 'add ' + text,
      update: 'update ' + text,
      delete: 'delete ' + text,
      find: 'query ' + text,
    };
  };

}

mysql_help.getCacheConfig = function() {
  const dbConstruct = fs.readFileSync(path.resolve(__dirname, 'src/config/column.json'));
  const mysql = fs.readFileSync(path.resolve(__dirname, 'src/config/config.json'));
  let mConfig = JSON.parse(mysql.toString())
  return {
    database: mConfig.db,
    dbConstruct: JSON.parse(dbConstruct.toString()),
    mysql: mConfig,
  };
};

// 引入
mysql_help.config = function(config, cb) {
  sqlConfig(config).then(function(r) {
    const newCf = {
      database: r.database,
      mysql: r.config.mysql,
      dbConstruct: r.config.dbConstruct,
    };
    if (cb) {
      cb(newCf);
    }
  });
};

module.exports = mysql_help;
