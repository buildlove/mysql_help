let { whereField } = require('../../common.js')

/**
 * Get the entire table of the database
 * @param {any} self 
 * @param {*} where
 */
const GetAllRowsSQL = function(self, where){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let w = whereField(where, dbConstructKey) ? ` where ${whereField(where, dbConstructKey)}`:""
  let sql = `select * from ${self.table_name}${w}`;
  return sql
}

module.exports = GetAllRowsSQL