let mysql_help = require("../..")
let common = require("../../src/common.js")
let path = require("path")
mysql_help.config('map', {
  mysql: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Lixiaoqi2468'
  }
}, async function(cf){
  console.log(cf)
  let cityHelp = new mysql_help('citys', cf);
  let data = await cityHelp.getAllRows()
})

// let cityTxt = common.fsReadFileAsync(path.resolve(__dirname, "citys.txt"))
// let json = common.stringToArray2(cityTxt)
// let cityHelp = new mysql_help('citys')
// for (let i = 0; i < json.length; i++) {
//   const j = json[i];
//   cityHelp.addRows([{
//     city: j[2],
//     area: j[3],
//     lat: j[1],
//     lon: j[0],
//   }])
// }

