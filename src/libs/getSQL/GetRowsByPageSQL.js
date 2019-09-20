let { whereField } = require('../../common.js')

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
  let order = ""
  // order 可以为对象 {key: 'DESC'}  {key: 'ASC'}
  // order 可以为字符串 'key'
  // order 可以为数组 ['key', 'key1']  或 [{key: 'DESC'}, {key: 'ASC'}]   (未支持)
  if(orderfield){//排序
    if(typeof orderfield === 'string'){ // 默认排序
      order = `ORDER BY ${orderfield} DESC`
    } else if(typeof orderfield === 'object'){ // 设置正序或者倒序
      for(key in orderfield){
        order = `ORDER BY ${key} ${orderfield[key] === '1' ? 'DESC' : 'ASC'}`
      }
    }
  }
  if(where) {
    sql = `select * from ${self.table_name} ${where} ${order} limit ${pageNum*everyPageNum},${everyPageNum}`;
  }else{
    sql = `select * from ${self.table_name} ${order} limit ${pageNum*everyPageNum},${everyPageNum}`;
  }
  return sql
}

module.exports = GetRowsByPageSQL