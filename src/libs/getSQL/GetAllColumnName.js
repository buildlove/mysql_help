/**
 * 获取所有数据库表的字段名称
 * @param {*} db_name 数据库名称
 * @param {*} table_name 表名称
 */
const GetAllColumnName = function(db_name,table_name){
  let sql = `select column_name from information_schema.columns where table_schema='${db_name}' and table_name='${table_name}'`;
  return sql
}

module.exports = GetAllColumnName