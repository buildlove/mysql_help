let { whereField } = require('../../common.js')

/**
 * Update the same field to a certain value
 * @param {*} self 
 * @param {*} field 
 * @param {*} where 
 */
const UpdateSameField = function(self, field, where){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let w = whereField(where, dbConstructKey) ? `where ${whereField(where, dbConstructKey)}`:""
  let p = ''
  for( var key in field ){
    p = `${key} = '${field[key]}'`
  }
  let sql = `UPDATE ${self.table_name} SET ${p} ${w}`
  return sql
}

// let a = UpdateSameField({table_name: 'sys'}, { jjj: 'kkkk' }, {aaa:'bbbb'} )
// console.log(a)

module.exports = UpdateSameField