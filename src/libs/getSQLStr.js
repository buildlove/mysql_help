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
      logger.error('数据库中不存在' + tableName + '表');
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

  // 聚合单个字段
  AggregSQL (field) {
    return SQL.AggregSQL(this, field)
  }

  // 添加数据
  addDataSQL (rowDatas) {
    return SQL.AddDataSQL(this, rowDatas);
  }

  // 创建数据库
  createDBSQL (db_name) {
    return SQL.CreateDatabaseSQL(db_name);
  }

  // 创建数据表
  createTableSQL (table_name, db_construct) {
    return SQL.CreateDBTable(this, table_name, db_construct);
  }

  // 按照字段名和字段数据删除多条数据
  deleteRowsByIndexSQL (index, field) {
    return SQL.DeleteRowsSQL(this, index, field);
  }

  // 按照 id 删除单条数据
  deleteRowByIdSQL (id, field) {
    return SQL.DeleteRowsSQL(this, id, field);
  }

  // 按照 ids 删除多条数据
  deleteRowsByIdsSQL (ids, field) {
    return SQL.DeleteRowsSQL(this, ids, field);
  }

  // 获取所有(数据库, 表)的字段名称
  getAllColumnNameSQL () {
    return SQL.GetAllColumnName(this);
  }

  // 获取表内所有数据
  getAllRowsSQL (where) {
    return SQL.GetAllRowsSQL(this, where);
  }
  // 获取数据库内所有表名称
  getAllTableNameSQL () {
    return SQL.GetAllTableNameSQL(this);
  }

  // 通过 id 获取数据
  getRowByIdSQL (id) {
    return SQL.GetRowsByIdsSQL(this, id);
  }

  // 通过 ids 获取数据
  getRowsByIdsSQL (ids) {
    return SQL.GetRowsByIdsSQL(this, ids);
  }

  // 通过 字段名称如name:zhangsan 获取数据
  getRowByIndexSQL (name, fieldname) {
    return SQL.GetRowsByIdsSQL(this, name, fieldname);
  }

  // 通过 name:['张三', '李四'] 获取数据
  getRowsByIndexSQL (names, fieldname) {
    return SQL.GetRowsByIdsSQL(this, names, fieldname);
  }

  // 分页获取数据('usre','5','10') 第五页每页10条
  getRowsByPageSQL (pageNum, everyPageNum) {
    return SQL.GetRowsByPageSQL(this, pageNum, everyPageNum);
  }

  // wherefield:{userid: 123}
  getRowsByPageWSQL (pageNum, everyPageNum, wherefield) {
    return SQL.GetRowsByPageSQL(this, pageNum, everyPageNum, wherefield);
  }

  // 通过条件获取数据('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))
  getRowsByWhereSQL (field, orAnd) {
    return SQL.GetRowsByWhereSQL(this, field, orAnd);
  }

  // 获取表的总条数
  getCountSQL (whereField){
    // console.log(whereField)
    return SQL.GetCountSQL(this, whereField);
  }

  // 查询是否存在数据库
  isExistDBSQL () {
    return SQL.IsExistDBSQL(this);
  }

  // 更新数据表
  updateRowSQL (rowData) {
    return SQL.UpdateRowSQL(this, rowData);
  }

  // 更新多行
  updateRowsSQL (rowDatas) {
    return SQL.UpdateRowsSQL(this, rowDatas);
  }

  // 更新同一字段为同一值
  UpdateSameField (field, whereField) {
    return SQL.UpdateSameField(this, field, whereField);
  }

  // 模糊匹配整张表或传入的单个字段
  getRowsByLikeSQL (fields, key) {
    return SQL.GetRowsByLikeSQL(this, key, fields )
  }
}

module.exports = getSQLStr