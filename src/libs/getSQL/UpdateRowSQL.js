let {deepClone} = require('../../common.js')

const UpdateRowSQL = function(table_name, id_name, dbConstruct, rowData){
  let construct = deepClone(dbConstruct)
  delete construct[id_name]
  let keys = assignSqlArg(Object.keys(construct), rowData);
  let where = `${id_name}='${rowData[id_name]}'`
  let sql = `update ${table_name} set ${keys.join(",")} where ${where}`
  return sql
}

function assignSqlArg(keys, obj) {
  let result = []
 
  keys.forEach((key) => {
    let value = obj[key];
    if (value) {
      result.push(`${key}='${value}'`)
    }
  });
  return result
}

module.exports = UpdateRowSQL