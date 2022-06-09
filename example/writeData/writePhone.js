let mysql_help = require("../..")
let fs = require('fs')
let txt = fs.readFileSync('./phone.txt')
txt = txt.toString().split('\n')


mysql_help.config({
  mysql: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Lixiaoqi2468',
    database:"drwifi",
    env: "dev" //"prod"
  }
}, async function(cf){
  let cityHelp = new mysql_help('phone_brand', cf);
  await cityHelp.addRows(txt.map(function(item, idx){
    if(item){
      return {
        id: idx,
        phone_brand: item.trim()
      }
    }

  }))
})

