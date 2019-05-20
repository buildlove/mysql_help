// 公共方法
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

// 调整参数顺序
function sortArg(name, data, dbEnum) {
  let result = [];
  let ArgEnum = Object.keys(dbEnum);

  ArgEnum.forEach(function (key) {
    let value = data[key]
    if (!value){
      value = ""
    }
    result.push(value);
  })
  return result

}

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

// 深拷贝
function deepClone(data){
  var type = getType(data);
  var obj;
  if(type === 'array'){
      obj = [];
  } else if(type === 'object'){
      obj = {};
  } else {
      //不再具有下一层次
      return data;
  }
  if(type === 'array'){
      for(var i = 0, len = data.length; i < len; i++){
          obj.push(deepClone(data[i]));
      }
  } else if(type === 'object'){
      for(var key in data){
          obj[key] = deepClone(data[key]);
      }
  }
  return obj;
}

function getType(obj){
  //tostring会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString;
  var map = {
     '[object Boolean]'  : 'boolean', 
     '[object Number]'   : 'number', 
     '[object String]'   : 'string', 
     '[object Function]' : 'function', 
     '[object Array]'    : 'array', 
     '[object Date]'     : 'date', 
     '[object RegExp]'   : 'regExp', 
     '[object Undefined]': 'undefined',
     '[object Null]'     : 'null', 
     '[object Object]'   : 'object'
 };
 return map[toString.call(obj)];
}

module.exports = {
  assignSqlArg: assignSqlArg,
  sortArg: sortArg,
  whereField: whereField,
  deepClone: deepClone
}