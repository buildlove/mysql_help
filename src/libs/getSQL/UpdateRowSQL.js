let {deepClone} = require('../../common.js')

const UpdateRowSQL = function(self, rowData){
  let construct = deepClone(self.dbConstruct)
  delete construct[self.id_name]
  let keys = assignSqlArg(Object.keys(construct), rowData);
  let where = `${self.id_name}='${rowData[self.id_name]}'`
  let sql = `update ${self.table_name} set ${keys.join(",")} where ${where}`
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