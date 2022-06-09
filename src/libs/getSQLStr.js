const SQL = require('./getSQL/index.js');
const common = require('../common.js');
const logger = require('../logger.js')
const fs = require('fs');
const path = require('path');

class getSQLStr {
  constructor(tableName, cf){
    this.config = cf ? cf : this._getCacheConfig();
    const dbConstruct = this.config.dbConstruct;
    if (!dbConstruct[tableName]) {
      logger.error('Not exist in the database(' + tableName + ')');
      return;
    }
    this.db_name = this.config.mysql.database;
    this.table_name =tableName;
    this.dbConstruct = common.deepClone(dbConstruct[tableName]);
    this.id_name = common.getPrimaryKey(dbConstruct[tableName]);
  }
  _getCacheConfig() {
    const dbConstruct = fs.readFileSync(path.resolve(__dirname, '../config/column.json'));
    const mysql = fs.readFileSync(path.resolve(__dirname, '../config/config.json'));
    let mConfig = JSON.parse(mysql.toString())
    return {
      database: mConfig.db,
      dbConstruct: JSON.parse(dbConstruct.toString()),
      mysql: mConfig,
    };
  };

  commonFun() {
    return common
  }

  AggregSQL (field, where) {
    return SQL.AggregSQL(this, field, where)
  }

  addDataSQL (rowDatas) {
    return SQL.AddDataSQL(this, rowDatas);
  }

  createDBSQL (db_name) {
    return SQL.CreateDatabaseSQL(db_name);
  }

  createTableSQL (table_name, db_construct) {
    return SQL.CreateDBTable(this, table_name, db_construct);
  }

  deleteRowsByIndexSQL (index, field) {
    return SQL.DeleteRowsSQL(this, index, field);
  }

  deleteRowByIdSQL (id, field) {
    return SQL.DeleteRowsSQL(this, id, field);
  }

  deleteRowsByIdsSQL (ids, field) {
    return SQL.DeleteRowsSQL(this, ids, field);
  }

  getAllColumnNameSQL () {
    return SQL.GetAllColumnName(this);
  }

  getAllRowsSQL (where) {
    return SQL.GetAllRowsSQL(this, where);
  }

  getAllTableNameSQL () {
    return SQL.GetAllTableNameSQL(this);
  }

  getRowByIdSQL (id, where) {
    return SQL.GetRowsByIdsSQL(this, id, where);
  }

  getRowsByIdsSQL (ids, where) {
    return SQL.GetRowsByIdsSQL(this, ids, where);
  }

  getRowByIndexSQL (name, fieldname) {
    return SQL.GetRowsByIdsSQL(this, name, fieldname);
  }

  getRowsByIndexSQL (names, fieldname) {
    return SQL.GetRowsByIdsSQL(this, names, fieldname);
  }

  getRowsByPageSQL (current, size, order, where) {
    return SQL.GetRowsByPageSQL(this, current, size, order, where);
  }

  // wherefield:{userid: 123}
  getRowsByPageWSQL (current, size, order, where) {
    return SQL.GetRowsByPageSQL(this, current, size, order, where);
  }

  // ('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))
  getRowsByWhereSQL (field, orAnd) {
    return SQL.GetRowsByWhereSQL(this, field, orAnd);
  }

  getCountSQL (whereField){
    // console.log(whereField)
    return SQL.GetCountSQL(this, whereField);
  }

  isExistDBSQL () {
    return SQL.IsExistDBSQL(this);
  }

  updateRowSQL (rowData) {
    return SQL.UpdateRowSQL(this, rowData);
  }

  updateRowsSQL (rowDatas) {
    return SQL.UpdateRowsSQL(this, rowDatas);
  }

  UpdateSameField (field, whereField) {
    return SQL.UpdateSameField(this, field, whereField);
  }

  getRowsByLikeSQL (fields, key) {
    return SQL.GetRowsByLikeSQL(this, key, fields )
  }
}

module.exports = getSQLStr