let { whereField } = require('../../common.js')

/**
 * 聚合单个字段
 * @param {*} table_name 表名称
 */
const AggregSQL = function(self, field, wherefield){
  let distinct = ''
  if(wherefield && wherefield.distinct){ // 去重
    distinct = ' distinct'
    delete wherefield.distinct
  }

  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let where = whereField(wherefield, dbConstructKey) ? ` where ${whereField(wherefield, dbConstructKey)}`:""
  if(typeof field === 'string'){
    field = [ field ]
  }

  // 限制查询10000条
  let sql = `SELECT${distinct} ${field.join(',')} FROM ${self.table_name}${where} GROUP BY ${field.join(',')} limit 100000;`;
  return sql
}

module.exports = AggregSQL