let { whereField } = require('../../common.js')

/**
 * Single field aggregation
 * @param {any} self table info
 * @param {any} field table info
 * @param {any} where Filter parameter
 */
const aggregationSQL = function(self, field, where){
  let distinct = ''
  if(where && where.distinct){ // Duplication
    distinct = ' distinct'
    delete where.distinct
  }

  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let w = whereField(where, dbConstructKey) ? ` where ${whereField(where, dbConstructKey)}`:""
  if(typeof field === 'string'){
    field = [ field ]
  }

  // limit search 10000
  let sql = `SELECT${distinct} ${field.join(',')} FROM ${self.table_name}${w} GROUP BY ${field.join(',')} limit 100000;`;
  return sql
}

module.exports = aggregationSQL