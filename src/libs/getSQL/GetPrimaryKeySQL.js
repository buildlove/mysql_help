/**
 * The primary key name of the query table
 * @param {*} table_name table name
 */
const GetPrimaryKeySQL = function(table_name){
  let sql = "SELECT column_name FROM INFORMATION_SCHEMA.`KEY_COLUMN_USAGE` WHERE table_name='"+table_name+"' AND constraint_name='PRIMARY'";
  return sql
}

module.exports = GetPrimaryKeySQL