const mysql_help = require('../index.js')

let userTable = new mysql_help('user')
userTable.getAllRows().then(function(sql){
  console.log(sql)
})