let { whereField, orderField, limitField } = require('../../common.js')

/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 * @param {number} orderfield 按哪个字段排序
 * @param {number} wherefield 按条件查询
 */
const GetRowsByPageSQL = function(self, pageNum, everyPageNum, orderfield, wherefield){
  console.log('========================', pageNum, everyPageNum, orderfield, wherefield)
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let where = whereField(wherefield, dbConstructKey) ? `where ${whereField(wherefield, dbConstructKey)}`:""
  let sql = ""
  let order = orderField(orderfield)
  let limit = limitField(pageNum, everyPageNum)
  if(where) {
    sql = `select * from ${self.table_name} ${where} ${order} ${limit}`;
  }else{
    sql = `select * from ${self.table_name} ${order} ${limit}`;
  }
  return sql
}

module.exports = GetRowsByPageSQL