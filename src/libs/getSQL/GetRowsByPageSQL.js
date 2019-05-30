/**
 * 获取数据通过页码和每条数目
 * @param {number} pageNum 第N页
 * @param {number} everyPageNum 取N条数据
 * @param {number} userid 用户id(可不填)
 */
const GetRowsByPageSQL = function(table_name, pageNum, everyPageNum, wherefield){
  let where = wherefield && wherefield.userid ? `where ${wherefield.field}='${wherefield.userid}'`:""
  let sql = ""
  if(where) {
    sql = `select * from ${table_name} `+ where +` order by create_time limit ${pageNum},${everyPageNum}`;
  }else{
    sql = `select * from ${table_name} order by create_time limit ${pageNum},${everyPageNum}`;
  }
  return sql
}
// functionGetRowsByPageSQL(user, 2, 10, {userid: 007})
module.exports = GetRowsByPageSQL