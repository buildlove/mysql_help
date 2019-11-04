/**
 * 根据 id 或者 ids 获取相关数据
 * @param {*} ids   <array> 需要查询的数组 id
 * @param {*} otherField  <string> 其它字段
 *       如：需要查询 "username" 字段叫"李四"的人
 *       getRowsByIds(["李四"], "username")
 */
const GetRowsByIdsSQL = function(self, ids, otherField){
  console.log(ids, otherField)
  let field_name = otherField ? otherField : self.id_name
  let idsField = [];
  if (typeof ids === 'string') {
    ids = [ids]
  }
  ids.forEach(id => {
    idsField.push(`'${id}'`)
  });
  let where = `${field_name} in (${idsField.join(',')})`
  let sql = `select * from ${self.table_name} where ${where}`;
  return sql
}

// console.log(GetRowsByIdsSQL('user', 'userid', '1111')) // 查询单个id
// console.log(GetRowsByIdsSQL('user', 'userid', 'zhangsan', 'name')) // 查询name=zhangsan的数据
// console.log(GetRowsByIdsSQL('user', 'userid', ['111','2222'])) // 查询id=11和id=2222的数据
// console.log(GetRowsByIdsSQL('user', 'userid', ['zhangsan','lisi'], 'name')) // 查询name=zhangsan和name=lisi的数据
module.exports = GetRowsByIdsSQL