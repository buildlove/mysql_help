/**
 * 聚合单个字段
 * @param {*} table_name 表名称
 */
const AggregSQL = function(self, field){
  let sql = `SELECT ${field} FROM ${self.table_name} GROUP BY ${field};`;
  return sql
}

module.exports = AggregSQL