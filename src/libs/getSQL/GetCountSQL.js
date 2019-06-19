'use strict';

let { whereField } = require('../../common.js')
/**
 * 获取整张表的数据
 * @param {*} table_name 表名
 */
const GetCountSQL = function(self, whereFi) {
  let where = whereFi ? ` where ${whereField(whereFi)}`:""
  const sql = `SELECT COUNT(*) FROM ${self.table_name}${where}`;
  return sql;
};

module.exports = GetCountSQL;
