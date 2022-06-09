/**
 * Get table name of all in database
 * @param {any} self  database info
 */
const GetAllTableNameSQL = function(self){
  let sql = `select table_name from information_schema.tables where table_schema='${self.database}'`;
  return sql
}

module.exports = GetAllTableNameSQL