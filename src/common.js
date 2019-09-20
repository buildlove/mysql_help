let path = require('path')
let fs = require('fs')
/**
 * 同步读取多个文件
 * @param {Array} filePaths 文件路径
 */
function fsReadFilesAsync(filePaths){
  let datas = []
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    let data = fs.readFileSync(filePath)
    datas.push(data.toString())
  }
  return datas
}
function fsReadFileAsync(filePath){
  return fsReadFilesAsync([filePath])[0]
}
/**
 * 字符串转二维数组
 */
function stringToArray2(str){
  let arr = str.split("\n")
  let arr2 = []
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    if(a){
      arr2.push(a.split(','))
    }
  }
  return arr2
}

/**
 * 获取主键字段名称
 * @param {*} dbConstruct 
 */
function getPrimaryKey(dbConstruct){
  let key = '';
  for(let k in dbConstruct){
    if(dbConstruct[k].indexOf('primary') !== -1){
      key = k
    }
  }
  return key
}

/**
 * 写入文件
 * @param {string} rootPath 目录
 * @param {stirng} filePath 文件名(默认所有资源都在data目录中)
 * @param {stirng} text 写入内容文本
 * @param {string} flag 写入方式
 */
function fsWriteFile(rootPath="./", filename, text, flag='w') {
  let filePath = path.resolve(__dirname, rootPath, filename)
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, text, {flag: flag}, function (err) {
      if (err) {
        reject(err);
      }
      resolve(true)
    })
  })
}

/**
 * 异步读取文件内容
 * @param {string} filePath 文件路径
 */
function fsReadFile(filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function (err, fr) {
      if (err) {
        reject(err);
      }
      resolve(fr)
    })
  })
}


/**
 * 异步读取多个文件
 * @param {Array<string>} filePaths 多个文件路径
 */
function fsReadFiles(filePaths){
  let pro = []
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    let f = path.resolve(__dirname, filePath)
    pro.push(fsReadFile(f))
  }
  return Promise.all(pro)
}



/**
 * 验证对象参数是否有一个为空, 返回为空的数据
 * @param {object} params 
 */
function dbValidEmpty(params) {
  let is = false
  let arr = []
  const keys = Object.keys(params)
  if(!keys || keys.length < 4 ){
    is = true
  }
  for (let i = 0; i < keys.length; i++) {
    if (!params[keys[i]]) {
      arr.push(keys[i])
      is = true
    }
  }
  return [is, arr]
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

/**
 * 对数组进行去重和去除空的字段
 * @param {Array} arr 需要去重和去除空的字符
 */
function uniqArr(arr) {
  const newArr = []
  arr.forEach(function(item) {
    if (item && !newArr.includes(item)) {
      newArr.push(item)
    }
  })
  return newArr
}
function concatKeys(keys, cancatLike){
  let result = []
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key && cancatLike){
      result.push(`${key} LIKE '%${cancatLike}%'`)
    }
  }
  return "(" + result.join(' OR ') + ")"
}

// 转换对象为where条件语句
function whereField(field, dbConstructKeys) {
  // 深拷贝 防止参数误删
  let cacheField = deepClone(field)
  let result = [];

  // 处理与或非
  let condition = ""
  if(!cacheField){return}
  if(cacheField.orAnd){ // 与或非默认为and
    condition = cacheField.orAnd.match('or') ? ' OR ' : ' AND '
    delete cacheField.orAnd
  }else{
    condition = ' AND '
  }

  // 处理保留关键字 cancat_like(用于模糊匹配关键字 ---  暂时只支持一个)
  if(cacheField.cancat_like){
    if(cacheField.cancat_like_fields){
      dbConstructKeys = deepClone(cacheField.cancat_like_fields)
      delete cacheField.cancat_like_fields
    }

    if(dbConstructKeys){
      // concat 有的字段不显示 换成 or
      // result.push(`CONCAT('${dbConstructKeys.join(',')}') LIKE '%${field.cancat_like}%'`)
      let concatStr = concatKeys(dbConstructKeys, field.cancat_like)
      result.push(concatStr)
    }

    delete cacheField.cancat_like
  }

  // 处理主要参数转换为sql
  let keys = Object.keys(cacheField);
  keys.forEach(function (key) {
    if(typeof cacheField[key] === 'string' || typeof cacheField[key] === 'number'){
      // 当传入的值为isNotNull时 添加where条件
      if(cacheField[key] === 'isNull'){
        result.push(`${key} IS NULL`);
      }else{
        result.push(`${key}='${cacheField[key]}'`);
      }

    } else if(Array.isArray(cacheField[key]) && cacheField[key].length){
      result.push(`${key} in('${cacheField[key].join("', '")}')`);
    }
  })
  return result.join(condition)
}
// 转换对象为where条件语句 模糊匹配
function whereField1(field) {
  let condition = ""
  if(!field){return}
  if(field.orAnd){
    condition = field.orAnd.match('or') ? ' or ' : ' and '
    delete field.orAnd
  }else{
    condition = ' and '
  }
  let keys = Object.keys(field);
  let result = [];
  keys.forEach(function (key) {
    if(typeof field[key] === 'string' || typeof field[key] === 'number'){
      result.push(`${key} like '%${field[key]}%'`);
    } else if(Array.isArray(field[key]) && field[key].length){
      let fieldVal = uniqArr(field[key])
      if(fieldVal.length <= 1){
        result.push(`${key} like '%${fieldVal[0]}%'`);
      } else {
        let w = []
        fieldVal.forEach(function(item, i){
          let v = ''
          if(i === 0){
            v+='('
          }

          v+=`${key} like '%${item}%'`

          if(i + 1 === fieldVal.length){
            v+=')'
          }
          if(!w.includes(v)){
            w.push(v)
          }
        })
        let wStr = w.join(' or ')
        if(!result.includes(wStr)){
          result.push(wStr)
        }
      }
    }
  })
  return result.join(condition)
}

module.exports = {
  deepClone,
  uuid,
  fsWriteFile,
  fsReadFile,
  fsReadFiles,
  dbValidEmpty,
  getPrimaryKey,
  stringToArray2,
  fsReadFileAsync,
  fsReadFilesAsync,
  whereField
}