/**
 * 获取数据库中所有表的名称
 * @param {*} table_name 数据库名称
 */
const GetAllTableNameSQL = function(db_name){
  let sql = `select table_name from information_schema.tables where table_schema='${db_name}'`;
  return sql
}

module.exports = GetAllTableNameSQL