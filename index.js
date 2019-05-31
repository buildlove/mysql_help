let operation = require('./src/db.operation');
let common = require('./src/common');
// 获取 SQL 语句
let getSQL = require('./src/libs/getSQL/index.js');
let sqlConfig = require('./src/libs/sqlConfig.js');
let mysql_help_config = {}
/**
 * 通用接口入口函数
 * @param {*} dbName     数据库名称
 * @param {*} tableName  表名称
 */
function mysql_help(tableName, c) {
  dbName = c ? c.dbName : mysql_help_config.dbName;
  config = c ? c.config : mysql_help_config.config;

  if (!tableName || !dbName || !config) {
    if(!tableName){console.log("缺少参数:表名称")}
    if(!dbName){console.log("缺少参数:数据库名称")}
    if(!config){console.log("缺少参数:数据库配置")}
    mysql_help.getCacheConfig()
  }

  this.db_name = dbName;                            // 数据库名称
  this.table_name = tableName;                      // 表名称
  this.msconfig = config.mysql;
  this.dbConstruct = common.deepClone(config.dbEnum[tableName])       // 表头字段
  this.id_name = Object.keys(this.dbConstruct)[0]   // 表头 id 字段名
  this.db_operation = new operation(dbName, config.mysql)          // 查询数据库接口
  this.textTip = this._getTextTip(tableName, config.dbEnum.textTip)        // 提示文字
}

mysql_help.getCacheConfig = async function(){
  let texts = await common.fsReadFiles(['./config/column.json', './config/config.json'])
  mysql_help_config = {
    dbEnum: texts[0],
    mysql: texts[1]
  }
}

// 引入
mysql_help.config = async function(dbName, config){
  mysql_help_config = await sqlConfig(dbName, config)
  return mysql_help_config
}

function saveDataInDB(rowDatas) {
  let sqlResult = getSQL.AddDataSQL(this.id_name, this.table_name, rowDatas, this.dbConstruct)
  return this.db_operation.insert(sqlResult, this.textTip.create);
}

// 新增单条/多条数据(参数:对象/数组)
mysql_help.prototype.addRow = saveDataInDB;

mysql_help.prototype.addRows = saveDataInDB;

// 获取所有
mysql_help.prototype.getAllRowsSQL = function () {
  let sql = this.getAllRows()
  return this.db_operation.select(sql, this.textTip.find);
}

// 分页查询
mysql_help.prototype.getRowsByPageSQL = function (pageNum, everyPageNum, wherefield) {
  let sql = getSQL.GetRowsByPageSQL(this.table_name, pageNum, everyPageNum, wherefield)
  return this.db_operation.select(sql, this.textTip.find);
}

// 根据索引获取数据
mysql_help.prototype.getRowsByIdsSQL = function (ids, otherField) {
  let sql = getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, ids, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 同查询ids一样, 查询单个id
 */
mysql_help.prototype.getRowsByIdSQL = function (id, otherField) {
  let sql = getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, id, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 同查询id一样, 只是名称不同
 * @param {*} indexs 
 * @param {*} name 
 */
mysql_help.prototype.getRowsByIndexsSQL = function (indexs, otherField) {
  let sql = getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, indexs, otherField)
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 根据任意字段获取相关数据
 * @param {*} field <object> 需要查询的相关字段
 * @param {*} orAnd <string> 默认为 "or" 只要满足一个及可以匹配, "and" 为需要满足所有传递的参数 
 */
mysql_help.prototype.getRowsByWhereSQL = function (field, orAnd) {
  let sql = getSQL.GetRowsByWhereSQL(this.table_name, field, orAnd);
  return this.db_operation.select(sql, this.textTip.find)
}

/**
 * 根据任意字段更新相关数据
 * @param {*} rowData <object> 需要更新的数据
 */
mysql_help.prototype.updateRowSQL = function (rowData) {
  let sql = getSQL.UpdateRowSQL(this.table_name,this.id_name,this.dbConstruct, rowData)
  return this.db_operation.update(sql, this.textTip.update)
}

/**
 * 根据任意字段更新相关数据
 * @param {*} rowDatas <object> 需要更新的数据集 必须要存在id字段
 */
mysql_help.prototype.updateRowsSQL = function (rowDatas) {
  let sql = getSQL.UpdateRowsSQL(this.table_name,this.id_name,this.dbConstruct,rowDatas)
  return this.db_operation.client(sql)
}

/**
 * 根据任意字段删除相关数据
 * @param {*} ids 需要删除的 id 字段
 * @param {*} name 
 */
mysql_help.prototype.deleteRowsSQL = function (ids, name) {
  let sql = getSQL.UpdateRowsSQL(this.table_name,this.id_name,ids, name)
  return this.db_operation.delete(sql, this.textTip.delete);
}

// 获取SQL语句内部函数 ===

// 添加数据
mysql_help.prototype.addDataSQL = function(rowDatas){
  return getSQL.AddDataSQL(this.table_name, this.id_name, this.dbConstruct, rowDatas)
}
// 创建数据库
mysql_help.prototype.createDBSQL = function(db_name){
  return getSQL.CreateDatabaseSQL(db_name)
}
// 创建数据表
mysql_help.prototype.createTableSQL = function(table_name, db_construct){
  return getSQL.CreateDBTable(this.db_name, table_name, db_construct)
}

// 按照字段名和字段数据删除多条数据
mysql_help.prototype.deleteRowsByIndexSQL =function(ids, name){
  return getSQL.DeleteRowsSQL(this.table_name, this.id_name, ids, name)
}
// 按照 id 删除单条数据
mysql_help.prototype.deleteRowByIdSQL =function(id){
  return getSQL.DeleteRowsSQL(this.table_name, this.id_name, id)
}
// 按照 ids 删除多条数据
mysql_help.prototype.deleteRowsByIdsSQL =function(ids){
  return getSQL.DeleteRowsSQL(this.table_name, this.id_name, ids)
}

// 获取所有(数据库, 表)的字段名称
mysql_help.prototype.getAllColumnNameSQL =function(){
  return getSQL.GetAllColumnName(this.db_name,this.table_name)
}
// 获取表内所有数据
mysql_help.prototype.getAllRowsSQL =function(){
  return getSQL.GetAllRowsSQL(this.table_name)
}
// 获取数据库内所有表名称
mysql_help.prototype.getAllTableNameSQL =function(){
  return getSQL.GetAllTableNameSQL(this.db_name)
}
// 通过 id 获取数据
mysql_help.prototype.getRowByIdSQL =function(id){
  return getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, id)
}
// 通过 ids 获取数据
mysql_help.prototype.getRowsByIdsSQL =function(ids){
  return getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, ids)
}
// 通过 字段名称如name=zhangsan 获取数据
mysql_help.prototype.getRowByIndexSQL =function(name, fieldname){
  return getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, name, fieldname)
}
// 通过 name=['张三', '李四'] 获取数据
mysql_help.prototype.getRowsByIndexSQL =function(names, fieldname){
  return getSQL.GetRowsByIdsSQL(this.table_name, this.id_name, names, fieldname)
}
// 分页获取数据('usre','5','10') 第五页每页10条
mysql_help.prototype.getRowsByPageSQL =function(pageNum, everyPageNum){
  return getSQL.GetRowsByPageSQL(this.table_name, pageNum, everyPageNum)
}
// wherefield={userid: 123}
mysql_help.prototype.getRowsByPageWSQL =function(pageNum, everyPageNum, wherefield){
  return getSQL.GetRowsByPageSQL(this.table_name, pageNum, everyPageNum, wherefield)
}
// 通过条件获取数据('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))
mysql_help.prototype.getRowsByWhereSQL =function(field, orAnd){
  return getSQL.GetRowsByWhereSQL(this.tableName, field, orAnd)
}
// 查询是否存在数据库
mysql_help.prototype.isExistDBSQL =function(){
  return getSQL.IsExistDBSQL(this.db_name)
}
// 更新数据表
mysql_help.prototype.updateRowSQL =function(rowData){
  return getSQL.UpdateRowSQL(this.table_name, this.id_name, this.dbConstruct, rowData)
}
// 更新多行
mysql_help.prototype.updateRowsSQL =function(rowDatas){
  return getSQL.UpdateRowsSQL(this.table_name, this.id_name, this.dbConstruct, rowDatas)
}

// 直接获取SQL语句原始函数 ===>>>
Object.keys(getSQL).forEach(function(key){
  mysql_help.prototype['ly' + key] = getSQL[key]
})

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