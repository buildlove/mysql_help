let path = require('path');
let fs = require('fs');
let t = new Date().toLocaleString();

let fileDir = path.resolve(__dirname, 'log')

if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir);
}
let filename = fileDir +'/'+ t.substr(0, t.indexOf(' ')) + '.log';

function getMsg(message) {
  if (typeof message == 'object') message = JSON.stringify(message);
  let msg = `[ ${t} ] ${message} \n`;
  fsW(filename, msg)
}

function fsW(filename, msg){
  fs.writeFile(filename, msg, {flag: 'a'}, function (err) {
    if (err) {
      console.log(err);
    }
  })
}

module.exports = {
  error: getMsg,
};