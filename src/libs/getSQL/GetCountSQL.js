'use strict';

/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetCountSQL = function(self) {
  const sql = `SELECT COUNT(*) FROM ${self.table_name}`;
  return sql;
};

module.exports = GetCountSQL;
