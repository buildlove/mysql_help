// 公共方法
function assignSqlArg(keys, obj) {
  let result = []
 
  keys.forEach((key, index) => {
    let value = obj[key];
    if (value) {
      result.push(`${key}='${value}'`)
    }
  });
  return result
}

// 调整参数顺序
function sortArg(name, data, dbEnum) {
  let result = [];
  let ArgEnum = Object.keys(dbEnum[name]);
  // let ArgData = Object.keys(data);
  // if (ArgEnum.length === ArgData.length) {
  ArgEnum.forEach(function (key) {
    let value = data[key]
    if (!value){
      value = ""
    }
    result.push(value);
  })
  return result
  // } else {
  //   return "common.js:sortArg_枚举参数和传入参数字段不相等"
  // }
}

// 转换对象为where条件语句
function whereField(field, orAnd) {
  let condition = orAnd.match('or') ? ' or ' : ' and '
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

module.exports = {
  assignSqlArg: assignSqlArg,
  sortArg: sortArg,
  whereField: whereField
}