let { whereField } = require('../../common.js')

/**
 * Get data by condition
 * @param {*} self 
 * @param {*} field 
 * @param {*} orAnd 
 */
const GetRowsByWhereSQL = function(self, field, orAnd){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  field.orAnd = orAnd
  let where = whereField(field, dbConstructKey);
  let sql = `select * from ${self.tableName} where ${where}`;
  return sql
}
// console.log(GetRowsByWhereSQL('user', {name: 'Mike', sex: 'man', te: '333'}, 'or'))

module.exports = GetRowsByWhereSQL