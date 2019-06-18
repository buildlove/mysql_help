const SQL = require('./getSQL/index.js');

class getSQL {
  constructor(self){
    this.self = self
  }
  // 添加数据
  addDataSQL (rowDatas) {
    return SQL.AddDataSQL(this.self, rowDatas);
  }

  // 创建数据库
  createDBSQL (db_name) {
    return SQL.CreateDatabaseSQL(db_name);
  }

  // 创建数据表
  createTableSQL (table_name, db_construct) {
    return SQL.CreateDBTable(this.self, table_name, db_construct);
  }

  // 按照字段名和字段数据删除多条数据
  deleteRowsByIndexSQL (index, field) {
    return SQL.DeleteRowsSQL(this.self, index, field);
  }

  // 按照 id 删除单条数据
  deleteRowByIdSQL (id, field) {
    return SQL.DeleteRowsSQL(this.self, id, field);
  }

  // 按照 ids 删除多条数据
  deleteRowsByIdsSQL (ids, field) {
    return SQL.DeleteRowsSQL(this.self, ids, field);
  }

  // 获取所有(数据库, 表)的字段名称
  getAllColumnNameSQL () {
    return SQL.GetAllColumnName(this.self);
  }

  // 获取表内所有数据
  getAllRowsSQL () {
    return SQL.GetAllRowsSQL(this.self);
  }
  // 获取数据库内所有表名称
  getAllTableNameSQL () {
    return SQL.GetAllTableNameSQL(this.self);
  }

  // 通过 id 获取数据
  getRowByIdSQL (id) {
    return SQL.GetRowsByIdsSQL(this.self, id);
  }

  // 通过 ids 获取数据
  getRowsByIdsSQL (ids) {
    return SQL.GetRowsByIdsSQL(this.self, ids);
  }

  // 通过 字段名称如name:zhangsan 获取数据
  getRowByIndexSQL (name, fieldname) {
    return SQL.GetRowsByIdsSQL(this.self, name, fieldname);
  }

  // 通过 name:['张三', '李四'] 获取数据
  getRowsByIndexSQL (names, fieldname) {
    return SQL.GetRowsByIdsSQL(this.self, names, fieldname);
  }

  // 分页获取数据('usre','5','10') 第五页每页10条
  getRowsByPageSQL (pageNum, everyPageNum) {
    return SQL.GetRowsByPageSQL(this.self, pageNum, everyPageNum);
  }

  // wherefield:{userid: 123}
  getRowsByPageWSQL (pageNum, everyPageNum, wherefield) {
    return SQL.GetRowsByPageSQL(this.self, pageNum, everyPageNum, wherefield);
  }

  // 通过条件获取数据('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))
  getRowsByWhereSQL (field, orAnd) {
    return SQL.GetRowsByWhereSQL(this.self, field, orAnd);
  }

  // 查询是否存在数据库
  isExistDBSQL () {
    return SQL.IsExistDBSQL(this.self);
  }

  // 更新数据表
  updateRowSQL (rowData) {
    return SQL.UpdateRowSQL(this.self, rowData);
  }

  // 更新多行
  updateRowsSQL (rowDatas) {
    return SQL.UpdateRowsSQL(this.self, rowDatas);
  }
}

module.exports = getSQL