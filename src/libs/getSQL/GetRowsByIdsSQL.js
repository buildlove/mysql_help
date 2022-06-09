/**
 * Query multiple pieces of data based on multiple IDs
 * @param {*} self  
 * @param {Array} ids   
 * @param {*} where  
 *       example：Need to query the person named "mark" in the "username" field
 *       getRowsByIds(["Mike"], "username")
 */
const GetRowsByIdsSQL = function(self, ids, where){
  // console.log(ids, where)
  let field_name = where ? where : self.id_name
  let idsField = [];
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids.forEach(id => {
    idsField.push(`'${id}'`)
  });
  let w = `${field_name} in (${idsField.join(',')})`
  let sql = `select * from ${self.table_name} where ${w}`;
  return sql
}

// console.log(GetRowsByIdsSQL('user', 'userid', '1111'))
// console.log(GetRowsByIdsSQL('user', 'userid', 'Mike', 'name'))
// console.log(GetRowsByIdsSQL('user', 'userid', ['111','2222']))
// console.log(GetRowsByIdsSQL('user', 'userid', ['Mike','Trump'], 'name'))
module.exports = GetRowsByIdsSQL