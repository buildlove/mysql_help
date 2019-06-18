/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 * @param {number} userid 用户id(可不填)
 */
const GetRowsByPageSQL = function(self, pageNum, everyPageNum, orderfield, wherefield){
  let where = wherefield && wherefield.userid ? `where ${wherefield.field}='${wherefield.userid}'`:""
  let sql = ""
  let order = ""
  if(orderfield){//排序
    order = 'order by ${orderfield} '
  }
  if(where) {
    sql = `select * from ${self.table_name} `+ where +` ${order}limit ${pageNum*everyPageNum},${everyPageNum}`;
  }else{
    sql = `select * from ${self.table_name} ${order}limit ${pageNum*everyPageNum},${everyPageNum}`;
  }
  return sql
}
// functionGetRowsByPageSQL(user, 2, 10, {userid: 007})
module.exports = GetRowsByPageSQL