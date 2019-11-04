let { whereField } = require('../../common.js')

/**
 * 根据任意字段删除相关数据
 * @param {string|Array<string>} whereItem 需要删除的 id
 * @param {string} field (可选)需要删除的字段名称
 */
const DeleteRowsSQL = function(self, whereItem, field){
  let field_name = field ? field : self.id_name;


  if (typeof whereItem === 'string') { 

    where = `${field_name} in('${whereItem}')`;

  } else if (whereItem && Array.isArray(whereItem)) {

    let idsToStr='';
    idsToStr += "'";
    idsToStr += whereItem.join("','");
    idsToStr += "'"
    where = `${field_name} in(${idsToStr})`;

  } else if (whereItem && typeof whereItem === 'object'){

    let dbConstructKey = self.dbConstruct ? Object.keys(self.dbConstruct) : false
    where = whereField(whereItem, dbConstructKey) ? `${whereField(whereItem, dbConstructKey)}`:""

  }
  if(!where){console.log("参数错误", field)}
  let sql = `delete from ${self.table_name} where ${where}`
  return sql
}

module.exports = DeleteRowsSQL