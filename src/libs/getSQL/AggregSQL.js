let { whereField } = require('../../common.js')

/**
 * 聚合单个字段
 * @param {*} table_name 表名称
 */
const AggregSQL = function(self, field, wherefield){
  let where = whereField(wherefield) ? ` where ${whereField(wherefield)}`:""
  if(typeof field === 'string'){
    field = [ field ]
  }
  let sql = `SELECT ${field.join(',')} FROM ${self.table_name}${where} GROUP BY ${field.join(',')};`;
  return sql
}

module.exports = AggregSQL