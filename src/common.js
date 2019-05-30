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

// 根据参数随机生成id
function uuid(num){
  var returnStr = "",       
  charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  for(var i=0; i<num; i++){
    var index = Math.round(Math.random() * (charStr.length-1));
    returnStr += charStr.substring(index,index+1);
  }
  return returnStr;
}

module.exports = {
  deepClone: deepClone,
  uuid: uuid
}