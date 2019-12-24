const mysql_help = require('../index.js')

let userTable = new mysql_help('user')
userTable.getAllRows().then(function(data){
  console.log(data)
})
// let sql = userTable.getAllRows()
// console.log(sql)

// npm version 2.1.21
// npm publish