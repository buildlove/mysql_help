/**
 * 获取数据库中所有表的名称
 * @param {*} table_name 数据库名称
 */
const GetAllTableNameSQL = function(self){
  let sql = `select table_name from information_schema.tables where table_schema='${self.database}'`;
  return sql
}

module.exports = GetAllTableNameSQL