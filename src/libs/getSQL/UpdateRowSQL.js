let {deepClone} = require('../../common.js')

const UpdateRowSQL = function(self, rowData){
  let construct = deepClone(self.dbConstruct)
  delete construct[self.id_name]
  let keys = assignSqlArg(Object.keys(construct), rowData);
  let where = `${self.id_name}='${rowData[self.id_name]}'`
  let set = keys.length ? ' SET ' + keys.join(",") : ''
  let sql = `UPDATE ${self.table_name}${set} WHERE ${where}`
  return sql
}

function assignSqlArg(keys, obj) {
  let result = []
  let ex = Object.keys(obj);
  keys.forEach((key) => {
    let value = obj[key] ? obj[key] : null;
    if (value || ex.includes(key)) {
      result.push(`${key}='${value}'`)
    }
  });
  return result
}

module.exports = UpdateRowSQL