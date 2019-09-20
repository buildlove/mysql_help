let { whereField } = require('../../common.js')

const GetRowsByWhereSQL = function(self, field, orAnd){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  field.orAnd = orAnd
  let where = whereField(field, dbConstructKey);
  let sql = `select * from ${self.tableName} where ${where}`;
  return sql
}
// console.log(GetRowsByWhereSQL('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))

module.exports = GetRowsByWhereSQL