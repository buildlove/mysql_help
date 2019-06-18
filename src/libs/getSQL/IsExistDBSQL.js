/**
 * 判断数据库是否存在
 * @param {*} database 数据库名称
 */
const IsExistDBSQL = function(self){
  let sql = `SHOW DATABASES LIKE "${self.database}"`;
  return sql
}

module.exports = IsExistDBSQL