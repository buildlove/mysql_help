const router = require('koa-router')();
const Koa = require('koa');
const app = module.exports = new Koa();
const koaBody = require('koa-body');

const config = require('./config/config');
const dbEnum = require('./config/db.enum');
require('../index')("", 'jobs' , {
  config: config,
  dbEnum: dbEnum
})

const mysqlHelp = require('../index')

app.use(koaBody({
  jsonLimit: '1kb'
}));

router.post('/getAllRows', getAllRows);
router.post('/getRowsByIds', getRowsByIds);
router.post('/getRowsByIndexs', getRowsByIndexs);
router.post('/getRowsByWhere', getRowsByWhere);
router.post('/updataRow', updataRow);
router.post('/addRow', addRow);
router.post('/deleteRows', deleteRows);

// 前端传递参数格式
// null
async function getAllRows(ctx) {
  ctx.body = await new mysqlHelp("user").getAllRows();
}

// 前端传递参数格式
// {ids: ['1','2']}
async function getRowsByIds(ctx) {
  ctx.body = await new mysqlHelp("user").getRowsByIds(ctx.request.body.ids);
}

// 前端传递参数格式
// {username: ['admin']}
async function getRowsByIndexs(ctx) {
  let params = ctx.request.body;
  ctx.body = await new mysqlHelp("user").getRowsByIndexs(params.username, Object.keys(params)[0]);
}

// 前端传递参数格式
// {field : {'username': 'admin', 'sex': '男'}, orAnd: 'or'}
async function getRowsByWhere(ctx) {
  let params = ctx.request.body;
  ctx.body = await new mysqlHelp("user").getRowsByWhere(params.field, params.orAnd);
}

// 前端传递参数格式
// {userid:'1', 'username': 'admin', 'sex': '男'} 
// id是必传参数, 其他参数可以只传一部分,
async function updataRow(ctx) {
  let params = ctx.request.body;
  ctx.body = await new mysqlHelp("user").updataRow(params);
}

// 前端传递参数格式
// let user = {
//   username: "admin",
//   password: "123456",
//   sex: "男",
//   mail: "test@gmail.com",
//   phone: "15312345678",
//   create_time: "",
//   last_login_time: "",
//   authorized: ""
// }
// 顺序无所谓,可以少字段,少的字段默认值为空字符串
// "id" 可传可不传
async function addRow(ctx) {
  let params = ctx.request.body;
  ctx.body = await new mysqlHelp("user").addRow(params);
}

// 前端传递参数格式
// {ids: []} 
// id是必传参数, 其他参数可以只传一部分,
async function deleteRows(ctx) {
  let ids = ctx.request.body.ids;
  ctx.body = await new mysqlHelp("user").deleteRows(ids);
}

app.use(router.routes());

if (!module.parent) app.listen(3000);