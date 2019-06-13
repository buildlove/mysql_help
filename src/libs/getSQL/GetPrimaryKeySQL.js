/**
 * 查询表的主键名称
 * @param {*} table_name 表名称
 */
const getPrimaryKey = function(table_name){
  let sql = "SELECT column_name FROM INFORMATION_SCHEMA.`KEY_COLUMN_USAGE` WHERE table_name='"+table_name+"' AND constraint_name='PRIMARY'";
  return sql
}

module.exports = getPrimaryKey