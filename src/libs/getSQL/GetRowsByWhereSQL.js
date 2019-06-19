let { whereField } = require('../../common.js')

const GetRowsByWhereSQL = function(self, field, orAnd){
  let where = whereField(field, orAnd);
  let sql = `select * from ${self.tableName} where ${where}`;
  return sql
}
// console.log(GetRowsByWhereSQL('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))

module.exports = GetRowsByWhereSQL