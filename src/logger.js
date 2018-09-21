let logger = function () {

  let fs = require('fs');
  let t = new Date().toLocaleString();
  // 判断 log目录是否被创建，否则创建
  let fileDir = __dirname + '/' + "../../log/";
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  let filename = fileDir + t.substr(0, t.indexOf(' ')) + '.log';
  // debug
  let debug = function (message) {
    if (typeof message == 'object') message = JSON.stringify(message);
    let msg = '[ ' + t + ']debug---' + message + '\n';
    let writeStream = fs.createWriteStream(filename, { flags: 'a', autoClose: true, encoding: 'utf8' });
    writeStream.write(msg, 'utf8', () => {
      writeStream.close();
    });
  };
  // error
  let error = function (message) {
    if (typeof message == 'object') message = JSON.stringify(message);
    let msg = '[ ' + t + ']error---' + message + '\n';
    let writeStream = fs.createWriteStream(filename, { flags: 'a', autoClose: true, encoding: 'utf8' });
    writeStream.cork();
    writeStream.write(msg, 'utf8', () => {
      writeStream.close();
    });
    process.nextTick(() => writeStream.uncork());
    writeStream.on('error', (err) => {
      console.log(JSON.stringify(err));
    });
  };
  return {
    debug: debug,
    error: error
  };
}

module.exports = logger;