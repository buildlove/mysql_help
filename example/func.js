const mysql_help = require('../index.js')

// let userTable = new mysql_help('user')
// userTable.getAllRowsSQL({userid: 1}).then(function(sql){
//   console.log(sql)
// })

mysql_help.config('jobs', {mysql: {
  "host": "127.0.0.1",
  "port": "3306",
  "user": "root",
  "password": "Lixiaoqi2468"
}})