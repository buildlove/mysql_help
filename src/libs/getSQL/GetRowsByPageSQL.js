/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 * @param {number} orderfield 按哪个字段排序
 * @param {number} wherefield 按条件查询
 */
const GetRowsByPageSQL = function(self, pageNum, everyPageNum, orderfield, wherefield){
  let where = wherefield ? `where ${whereField(wherefield)}`:""
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
// 转换对象为where条件语句
function whereField(field) {
  let condition = ""
  if(field.orAnd){
    condition = field.orAnd.match('or') ? ' or ' : ' and '
  }else{
    condition = ' and '
  }
  if(typeof field === 'string'){
    field = field.replace(/\'/g, '"')
    field = JSON.parse(field);
  }
  let keys = Object.keys(field);
  let result = [];
  keys.forEach(function (key) {
    result.push(`${key}='${field[key]}'`);
  })
  return result.join(condition)
}
module.exports = GetRowsByPageSQL