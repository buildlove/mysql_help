const mysql_help = require('../index.js')

mysql_help.config({
  mysql: {
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "password": "Lixiaoqi2468",
    "database":"jobs",
    "env": "dev" //"prod"
  }
}, function(cf){
  let userTable = new mysql_help('user')
  // userTable.getAllRows().then(function(data){
  // })
  // console.log(userTable.getCountSQL({ddd:'ddd'}))
  // let sql = userTable.GetCountSQL(cf, {case_id: 2})
  userTable.addRow({userid: '123123123', username, password: showPassWord, authorized: 0})
  userTable.end()
})

