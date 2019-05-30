/**
 * 判断数据库是否存在
 * @param {*} db_name 数据库名称
 */
const IsExistDBSQL = function(db_name){
  let sql = `SHOW DATABASES LIKE "${db_name}"`;
  return sql
}

module.exports = IsExistDBSQL