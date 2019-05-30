let operation = require('./src/db.operation');
let common = require('./src/common');
//fun
const AddDataSQL = require('./src/libs/getSQL/AddDataSQL');
const CreateDatabaseSQL = require('./src/libs/getSQL/CreateDatabaseSQL');
const CreateDBTable = require('./src/libs/getSQL/CreateDBTable');
const DeleteRowsSQL = require('./src/libs/getSQL/DeleteRowsSQL');
const GetAllRowsSQL = require('./src/libs/getSQL/GetAllRowsSQL.js')
const GetRowsByPageSQL = require('./src/libs/getSQL/GetRowsByPageSQL.js')
const GetRowsByIdsSQL = require('./src/libs/getSQL/GetRowsByIdsSQL.js')
const GetRowsByWhereSQL = require('./src/libs/getSQL/GetRowsByWhereSQL.js')
const IsExistDBSQL = require('./src/libs/getSQL/IsExistDBSQL.js')
const UpdateRowSQL = require('./src/libs/getSQL/UpdateRowSQL.js')
const UpdateRowsSQL = require('./src/libs/getSQL/UpdateRowsSQL.js')
let { sqlConfig } = require('./src/libs/sqlConfig.js')

/**
 * 通用接口入口函数
 * @param {*} dbName     数据库名称
 * @param {*} tableName  表名称
 */
function mysql_help(tableName) {
  let mysql_help_config = JSON.parse(process.env.mysql_help)
  dbName = mysql_help_config.dbName;
  config = mysql_help_config.config;
  if (tableName) {
    this.db_name = dbName;                            // 数据库名称
    this.table_name = tableName;                      // 表名称
    this.msconfig = config.config.mysql;
    this.dbConstruct = common.deepClone(config.dbEnum[tableName])       // 表头字段
    this.id_name = Object.keys(this.dbConstruct)[0]   // 表头 id 字段名
    this.db_operation = new operation(dbName, config.config.mysql)          // 查询数据库接口
    this.textTip = this._getTextTip(tableName, config.dbEnum.textTip)        // 提示文字
    this.config = config
  }
}

// 引入
mysql_help.config = sqlConfig

const saveDataInDB = function (rowDatas) {
  let sqlResult = AddDataSQL(this.id_name, this.table_name, rowDatas, this.dbConstruct)
  return this.db_operation.insert(sqlResult, this.textTip.create);
}
// 新增单条/多条数据(参数:对象/数组)
mysql_help.prototype.addRow = saveDataInDB;

mysql_help.prototype.addRows = saveDataInDB;

// 获取所有
mysql_help.prototype.getAllRows = function () {
  let sql = GetAllRowsSQL(this.table_name)
  return this.db_operation.select(sql, this.textTip.find);
}

// 分页查询
mysql_help.prototype.getRowsByPageCount = function (pageNum, everyPageNum, wherefield) {
  let sql = GetRowsByPageSQL(this.table_name, pageNum, everyPageNum, wherefield)
  return this.db_operation.select(sql, this.textTip.find);
}

// 根据索引获取数据
mysql_help.prototype.getRowsByIds = function (ids, otherField) {
  let sql = GetRowsByIdsSQL(this.table_name, this.id_name, ids, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 同查询ids一样, 查询单个id
 */
mysql_help.prototype.getRowsById = function (id, otherField) {
  let sql = GetRowsByIdsSQL(this.table_name, this.id_name, id, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 同查询id一样, 只是名称不同
 * @param {*} indexs 
 * @param {*} name 
 */
mysql_help.prototype.getRowsByIndexs = function (indexs, otherField) {
  let sql = GetRowsByIdsSQL(this.table_name, this.id_name, indexs, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 根据任意字段获取相关数据
 * @param {*} field <object> 需要查询的相关字段
 * @param {*} orAnd <string> 默认为 "or" 只要满足一个及可以匹配, "and" 为需要满足所有传递的参数 
 */
mysql_help.prototype.getRowsByWhere = function (field, orAnd) {
  let sql = GetRowsByWhereSQL(this.table_name, field, orAnd);
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 根据任意字段更新相关数据
 * @param {*} rowData <object> 需要更新的数据
 */
mysql_help.prototype.updateRow = function (rowData) {
  let sql = UpdateRowSQL(this.table_name,this.id_name,this.dbConstruct, rowData)
  return this.db_operation.update(sql, this.textTip.update)
}

/**
 * 根据任意字段更新相关数据
 * @param {*} rowDatas <object> 需要更新的数据集 必须要存在id字段
 */
mysql_help.prototype.updateRows = function (rowDatas) {
  let sql = UpdateRowsSQL(this.table_name,this.id_name,this.dbConstruct,rowDatas)
  return this.db_operation.client(sql)
}

/**
 * 根据任意字段删除相关数据
 * @param {*} ids 需要删除的 id 字段
 * @param {*} name 
 */
mysql_help.prototype.deleteRows = function (ids, name) {
  let sql = UpdateRowsSQL(this.table_name,this.id_name,ids, name)
  return this.db_operation.delete(sql, this.textTip.delete);
}

mysql_help.prototype.getSQL = {
  AddDataSQL,
  GetAllRowsSQL,
  GetRowsByPageSQL,
  GetRowsByIdsSQL,
  GetRowsByWhereSQL,
  UpdateRowSQL,
  CreateDatabaseSQL,
  CreateDBTable,
  DeleteRowsSQL,
  IsExistDBSQL
}

mysql_help.prototype._getTextTip = function (name, textTip) {
  let text = ""
  if (textTip) {
    text = textTip[name] || ""
  }
  return {
    create: "添加" + text,
    update: "更新" + text,
    delete: "删除" + text,
    find: "查询" + text
  }
}

module.exports = mysql_help