/**
 * Get the field names of all database tables
 * @param {any} self Name database 
 * @param {any} tableName Name database 
 */
const GetAllColumnName = function(self, tableName){
  const name = tableName ? tableName : self.table_name
  let sql = `select column_name from information_schema.columns where table_schema='${self.database}' and table_name='${self.table_name}'`;
  return sql
}

module.exports = GetAllColumnName