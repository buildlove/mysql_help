/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetAllRowsSQL = function(table_name){
  let sql = `select * from ${table_name}`;
  return sql
}

module.exports = GetAllRowsSQL