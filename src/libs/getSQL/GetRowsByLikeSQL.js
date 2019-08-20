// 模糊匹配关键字 用于简单搜索单张表内的相关数据
// SELECT * FROM `sys_panel_case` WHERE CONCAT(`id`,`name`,`mobiletype`) LIKE '%ne%'

/**
 * 需要模糊匹配的表字段
 * @param {Array||Object} dbConstruct 
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
 * 获取数据通过页码和每条数目
 * @param <Array> field
 */
const GetRowsByLikeSQL = function(self, key, field){
  let where = ''
  if(field && field.length){
    where = getFields(field)
  } else { // 默认匹配整张表的所有字段名称
    where = getFields(self.dbConstruct)
  }
  let sql = `select * from ${self.table_name} ${where} '%${key}%'`

  return sql
}

module.exports = GetRowsByLikeSQL



