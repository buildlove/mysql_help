let { whereField } = require('../../common.js')

/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetAllRowsSQL = function(self, wherefield){
  let where = whereField(wherefield) ? ` where ${whereField(wherefield)}`:""
  let sql = `select * from ${self.table_name}${where}`;
  return sql
}

module.exports = GetAllRowsSQL