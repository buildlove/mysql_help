'use strict';

let { whereField } = require('../../common.js')
/**
 * Statistics on data according to conditions
 * @param {any} self database info
 * @param {any} where
 */
const GetCountSQL = function(self, where) {
  let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
  let w = whereField(where, dbConstructKey) ? ` where ${whereField(where, dbConstructKey)}`:""
  const sql = `SELECT COUNT(*) FROM ${self.table_name}${w}`;
  return sql;
};

module.exports = GetCountSQL;
