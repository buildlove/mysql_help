'use strict';

/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetCountSQL = function(table_name) {
  const sql = `SELECT COUNT(*) FROM ${table_name}`;
  return sql;
};

module.exports = GetCountSQL;
