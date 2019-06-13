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
  fsReadFilesAsync
}