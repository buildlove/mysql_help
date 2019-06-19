let { whereField } = require('../../common.js')

/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 * @param {number} orderfield 按哪个字段排序
 * @param {number} wherefield 按条件查询
 */
const GetRowsByPageSQL = function(self, pageNum, everyPageNum, orderfield, wherefield){
  let where = whereField(wherefield) ? `where ${whereField(wherefield)}`:""
  let sql = ""
  let order = ""
  if(orderfield){//排序
    order = `order by ${orderfield} `
  }
  if(where) {
    sql = `select * from ${self.table_name} `+ where +` ${order}limit ${pageNum*everyPageNum},${everyPageNum}`;
  }else{
    sql = `select * from ${self.table_name} ${order}limit ${pageNum*everyPageNum},${everyPageNum}`;
  }
  return sql
}

module.exports = GetRowsByPageSQL