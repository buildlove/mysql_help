/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetAllRowsSQL = function(self){
  let sql = `select * from ${self.table_name}`;
  return sql
}

module.exports = GetAllRowsSQL