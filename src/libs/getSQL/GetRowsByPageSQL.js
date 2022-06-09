let { whereField, orderField, limitField } = require('../../common.js')

/**
 * Get data by page number and number of each item
 * @param {number} current current page num
 * @param {number} size page size
 * @param {any} order
 * @param {any} where
 */
const GetRowsByPageSQL = function(self, current, size, order, where){
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let w = whereField(where, dbConstructKey) ? `where ${whereField(where, dbConstructKey)}`:""
  let sql = ""
  let o = orderField(order)
  let limit = limitField(current, size)
  if(w) {
    sql = `select * from ${self.table_name} ${w} ${o} ${limit}`;
  }else{
    sql = `select * from ${self.table_name} ${o} ${limit}`;
  }
  return sql
}

module.exports = GetRowsByPageSQL