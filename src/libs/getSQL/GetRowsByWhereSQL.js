const GetRowsByWhereSQL = function(tableName, field, orAnd){
  let where = whereField(field, orAnd);
  let sql = `select * from ${tableName} where ${where}`;
  return sql
}
// console.log(GetRowsByWhereSQL('user', {name: 'zhangshan', sex: 'man', te: '333'}, 'or'))
// 转换对象为where条件语句
function whereField(field, orAnd) {
  let condition = ""
  if(orAnd){
    condition = orAnd.match('or') ? ' or ' : ' and '
  }else{
    condition = ' or '
  }
  if(typeof field === 'string'){
    field = field.replace(/\'/g, '"')
    field = JSON.parse(field);
  }
  let keys = Object.keys(field);
  let result = [];
  keys.forEach(function (key) {
    result.push(`${key}='${field[key]}'`);
  })
  return result.join(condition)
}

module.exports = GetRowsByWhereSQL