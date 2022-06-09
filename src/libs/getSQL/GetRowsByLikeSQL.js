// Fuzzy match keywords
// SELECT * FROM `sys_panel_case` WHERE CONCAT(`id`,`name`,`mobiletype`) LIKE '%ne%'

/**
 * @param {any} dbConstruct 
 */
function getFields(dbConstruct){
  let dbConstructKeys;
  if(Array.isArray(dbConstruct)){
    dbConstructKeys = dbConstruct
  }else{
    dbConstructKeys = Object.keys(dbConstruct)
  }
  let dbConstructStr = 'WHERE CONCAT(' + dbConstructKeys.join(',') + ') LIKE'
  return dbConstructStr
}

/**
 * Fuzzy match keywords by page number and number of each
 * @param {any} self 
 * @param {any} key 
 * @param {any} where 
 */
const GetRowsByLikeSQL = function(self, key, where){
  let w = ''
  if(where && where.length){
    w = getFields(where)
  } else { // Match all field names of the entire table by default
    w = getFields(self.dbConstruct)
  }
  let sql = `select * from ${self.table_name} ${w} '%${key}%'`

  return sql
}

module.exports = GetRowsByLikeSQL



