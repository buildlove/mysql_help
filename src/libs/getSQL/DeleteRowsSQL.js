/**
 * 根据任意字段删除相关数据
 * @param {string|Array<string>} ids 需要删除的 id
 * @param {string} name (可选)需要删除的字段名称
 */
const DeleteRowsSQL = function(table_name, id_name, ids, name){
  let field_name = name ? name : id_name;
  let where = '';

  if (typeof ids === 'string') {

    where = `${field_name} in('${ids}')`;

  } else if (ids && Array.isArray(ids)) {

    let idsToStr = [];
    ids.forEach(function (id) {
      idsToStr.push(`'${id}'`);
    })
    where = `${field_name} in(${idsToStr.join(",")})`;

  }
  let sql = `delete from ${table_name} where ${where}`
  return sql
}

module.exports = DeleteRowsSQL