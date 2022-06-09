/**
 * Creat new database
 * @param {*} self database message
 */
const CreateDatabaseSQL = function(self){
  let sql = `CREATE DATABASE IF NOT EXISTS ${self.database} default charset utf8 COLLATE utf8_general_ci`;
  return sql
}

module.exports = CreateDatabaseSQL