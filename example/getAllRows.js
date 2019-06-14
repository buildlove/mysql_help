const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const mysql_help = require('../index.js')

mysql_help.config({
  "mysql": {
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "password": "Lixiaoqi2468",
    "db": 'jobs'
  }
})

// app.use(router.routes());
// app.use(bodyParser());

// router.post('/getAllRows', async function (ctx) {
//   let userTable = new mysql_help('user')
//   let sql = await userTable.getAllRowsSQL({userid: 1})
//   console.log(sql)
// });

// app.listen(3000);