// 更新同一字段为某值
let { whereField } = require('../../common.js')

const UpdateSameField = function(self, field, wherefield){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let where = whereField(wherefield, dbConstructKey) ? `where ${whereField(wherefield, dbConstructKey)}`:""
  let p = ''
  for( var key in field ){
    p = `${key} = '${field[key]}'`
  }
  let sql = `UPDATE ${self.table_name} SET ${p} ${where}`
  return sql
}

// let a = UpdateSameField({table_name: 'sys'}, { jjj: 'kkkk' }, {aaa:'bbbb'} )
// console.log(a)

module.exports = UpdateSameField