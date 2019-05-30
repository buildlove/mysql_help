/**
 * 创建不存在的数据库
 * @param {*} db_name 数据库名称
 */
const CreateDatabaseSQL = function(db_name){
  let sql = `CREATE DATABASE IF NOT EXISTS ${db_name} default charset utf8 COLLATE utf8_general_ci`;
  return sql
}

module.exports = CreateDatabaseSQL