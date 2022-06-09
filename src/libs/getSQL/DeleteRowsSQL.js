let { whereField } = require('../../common.js')

/**
 * Delete related data based on any field
 * @param {any} self (Optional) The name of the field to be deleted
 * @param {string|Array<string>} whereItem Id to be deleted
 * @param {string} field (Optional) The name of the field to be deleted
 */
const DeleteRowsSQL = function(self, whereItem, field){
  let field_name = field ? field : self.id_name;
  let where = ''

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
  if(!where){console.log("Parameter error", field)}
  let sql = `delete from ${self.table_name} where ${where}`
  return sql
}

module.exports = DeleteRowsSQL