const mysql_help = require('../index.js')

mysql_help.config({
  mysql: {
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "password": "Lixiaoqi2468",
    "database":"resource",
    "env": "dev" //"prod"
  }
})

let houseTable = new mysql_help('house')
let data = houseTable.getAllRows()