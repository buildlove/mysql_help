let {deepClone} = require('../../common.js')

/**
 * Update a single database data
 * @param {*} self 
 * @param {*} rowData 
 */
const UpdateRowSQL = function(self, rowData){
  let construct = deepClone(self.dbConstruct)
  delete construct[self.id_name]
  let keys = assignSqlArg(Object.keys(construct), rowData);
  let where = `${self.id_name}='${rowData[self.id_name]}'`
  let set = keys.length ? ' SET ' + keys.join(",") : ''
  let sql = `UPDATE ${self.table_name}${set} WHERE ${where}`
  return sql
}

/**
 * Processing parameters
 * @param {*} keys 
 * @param {*} obj 
 */
function assignSqlArg(keys, obj) {
  let result = []
  let ex = Object.keys(obj);
  keys.forEach((k) => {
    let value = obj[k] ? obj[k] : null;
    if (value || ex.includes(k)) {
      result.push(`${k}='${value}'`)
    }
  });
  return result
}

module.exports = UpdateRowSQL