/**
 * Determine whether the database exists
 * @param {any} self database info
 */
const IsExistDBSQL = function(self){
  let sql = `SHOW DATABASES LIKE "${self.database}"`;
  return sql
}

module.exports = IsExistDBSQL