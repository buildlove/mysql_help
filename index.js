let uuidV1 = require('uuid/v1');
let db_operation = require('./src/db.operation');
let common = require('./src/common');
let config = null;
let dbName = "";

/**
 * 通用接口入口函数
 * @param {*} dbName     数据库名称
 * @param {*} tableName  表名称
 */
function mysql_help(tableName, name, cf) {
  dbName = name ? name : dbName;
  config = cf ? cf : config;

  if (tableName) {
    this.db_name = dbName;                            // 数据库名称
    this.table_name = tableName;                      // 表名称
    this.msconfig = config.config.mysql;
    this.dbConstruct = config.dbEnum[tableName]       // 表头字段
    this.id_name = Object.keys(this.dbConstruct)[0]   // 表头 id 字段名
    this.db_operation = db_operation(dbName, this.msconfig)          // 查询数据库接口
    this.textTip = this._getTextTip(tableName, config.dbEnum.textTip)        // 提示文字
    this.config = config
  }
}

/**
 * 新增数据到数据库
 * @param {*} rowData 除 id 外的其他数据
 */
mysql_help.prototype.addRow = function (rowData) {
  if (typeof rowData === 'string') {
    rowData = JSON.parse(rowData);
  }
  rowData[this.id_name] = rowData[this.id_name] ? rowData[this.id_name] : uuidV1()
  let arg = common.sortArg(this.table_name, rowData, this.dbConstruct);
  return this.db_operation.insert(this.table_name, arg, this.textTip.create);
}

/**
 * 获取所有数据
 */
mysql_help.prototype.getAllRows = function () {
  return this.db_operation.selectAll(this.table_name);
}

/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 */
mysql_help.prototype.getRowsByPageCount = function (pageNum, everyPageNum) {
  return this.db_operation.selectByPageCount(this.table_name, pageNum * everyPageNum, everyPageNum);
}

/**
 * 根据 id 或者 ids 获取相关数据
 * @param {*} ids   <array> 需要查询的数组 id
 * @param {*} otherField  <string> 其它字段
 *       如：需要查询 "username" 字段叫"李四"的人
 *       getRowsByIds(["李四"], "username")
 */
mysql_help.prototype.getRowsByIds = function (ids, otherField) {
  let field_name = otherField ? otherField : this.id_name
  let idsField = [];
  if (typeof ids === 'string') {
    ids = ids.replace(/\'/g, '"')
    ids = JSON.parse(ids);
  }
  ids.forEach(id => {
    idsField.push(`'${id}'`)
  });
  let where = `${field_name} in (${idsField.join(',')})`
  return this.db_operation.select(this.table_name, where, this.textTip.find)
}

/**
 * 同查询id一样, 只是名称不同
 * @param {*} indexs 
 * @param {*} name 
 */
mysql_help.prototype.getRowsByIndexs = function (indexs, otherField) {
  return this.getRowsByIds(indexs, otherField)
}

/**
 * 根据任意字段获取相关数据
 * @param {*} field <object> 需要查询的相关字段
 * @param {*} orAnd <string> 默认为 "or" 只要满足一个及可以匹配, "and" 为需要满足所有传递的参数 
 */
mysql_help.prototype.getRowsByWhere = function (field, orAnd) {
  let where = common.whereField(field, orAnd);
  return this.db_operation.select(this.table_name, where, this.textTip.find)
}

/**
 * 根据任意字段更新相关数据
 * @param {*} rowData <object> 需要更新的数据
 */
mysql_help.prototype.updataRow = function (rowData) {
  if (typeof rowData === 'string') {
    rowData = JSON.parse(rowData)
  }
  delete this.dbConstruct[this.id_name]

  let arg = {
    keys: common.assignSqlArg(Object.keys(this.dbConstruct), rowData),
    where: `${this.id_name}='${rowData[this.id_name]}'`
  }
  return this.db_operation.update(this.table_name, arg, this.textTip.update)
}

/**
 * 根据任意字段删除相关数据
 * @param {*} ids 需要删除的 id 字段
 * @param {*} name 
 */
mysql_help.prototype.deleteRows = function (ids, name) {

  if (typeof ids === 'string') {
    ids = ids.replace(/\'/g, '"');
    ids = ids.indexOf('[') === -1 ? ids : JSON.parse(ids);
  }

  let field_name = name ? name : this.id_name;
  let where;
  let idsToStr = [];
  if (typeof ids === 'string') {

    where = `${field_name} in('${ids}')`;

  } else if (typeof ids === 'object' && ids.length) {

    ids.forEach(function (id) {
      idsToStr.push(`'${id}'`);
    })

    where = `${field_name} in(${idsToStr.join(",")})`;

  }

  return this.db_operation.delete(this.table_name, where, this.textTip.delete);
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