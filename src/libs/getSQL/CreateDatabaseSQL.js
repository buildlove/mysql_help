/**
 * 创建不存在的数据库
 * @param {*} db_name 数据库名称
 */
const CreateDatabaseSQL = function(self){
  let sql = `CREATE DATABASE IF NOT EXISTS ${self.database} default charset utf8 COLLATE utf8_general_ci`;
  return sql
}

module.exports = CreateDatabaseSQL