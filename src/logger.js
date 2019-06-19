let path = require('path');
let fs = require('fs');
let fileDir = path.resolve(__dirname, 'log')

if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir);
}

const config = null;
const env = 'dev'
if(config && config.mysql){
  env = config.mysql.env
}else{
  try{
    config =fs.readFileSync(path.resolve(__dirname, './config/config.json'))
  }catch(err){
    // console.log(err)
  }
}

// 打印错误并写入日志
function error(message) {
  let t = new Date().toLocaleString();
  let filename = fileDir +'/'+ t.substr(0, t.indexOf(' ')) + '.log';
  let msg = debug(message)
  fsW(filename, msg)
}

// 打印调试
function debug(message) {
  let t = new Date().toLocaleString();
  if (typeof message == 'object') message = JSON.stringify(message);
  let msg = `[ ${t} ] ${message}`;
  if(env === 'dev'){
    console.log(msg)
  }
  return msg
}

// 写入文件(追加的方式)
function fsW(filename, msg){
  fs.writeFile(filename, msg, {flag: 'a'}, function (err) {
    if (err) {
      debug(err);
    }
  })
}

module.exports = {
  error: error,
  debug: debug
};