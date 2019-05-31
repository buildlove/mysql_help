let { uuid } = require('../../common')
let errorCode = require('../ErrorCode/code.json')

/**
 * 保存数据 - SQL转换
 * @param {string} id_name            表id字段的名称
 * @param {string} table_namedata     表
 */
const AddDataSQL = function(table_name, id_name, dbConstruct, rowDatas){
  let args = format(id_name, rowDatas, dbConstruct)
  if(!validParams(args)){return errorCode['100001']}
  let tableTitle = `${table_name}(` + Object.keys(dbConstruct).join(",") + ')'
  let v = values(args)

  let sql = `INSERT INTO ${tableTitle} VALUES${v}`;
  return sql
}

// 判断传递参数是否与数据库没有任何字段相同
function validParams(args){
  let valid = true
  args = args.map(function(item){
    if(item){
      return item
    }
  })
  if(args.length === 1){
    valid = false
  }
  return valid
}

// 规范数据结构
function format(id_name, rowDatas, dbConstruct){
  let data = rowDatas && Array.isArray(rowDatas) ? rowDatas : [rowDatas]
  let args = [];

  // 根据表结构调整顺序, 新增 id
  for (let i = 0; i < data.length;i++){
    let row = data[i]
    row[id_name] = row[id_name] ? row[id_name] : uuid(15)
    let arg = sortArg(row, dbConstruct);
    args.push(arg)
  }

  return args
}

  // 根据数据生成 sql 语句
function values(args){
  let v = ""
  for(let i=0;i<args.length;i++){
    let newVal = []
    let values = args[i]
    values.forEach(function (value) {
      newVal.push('"' + value + '"')
    })
    let b = ','
    if(args.length === i+1){
      b = ';'
    }
    v += ' (' + newVal.join(",") + ')' + b;
  }
  return v
}

// 根据表结构调整参数顺序
function sortArg(data, dbEnum) {
  let result = [];
  let ArgEnum = Object.keys(dbEnum);

  ArgEnum.forEach(function (key) {
    let value = data[key]
    if (!value){
      value = ""
    }
    result.push(value);
  })
  return result
}

module.exports = AddDataSQL

// let test = AddDataSQL('userid', 'user', {
//   username: "张三",
//   password: "王五"
// },{
//   userid: "",
//   username: "",
//   password: "",
//   sex: "",
//   mail: "",
//   phone: "",
//   create_time: "",
//   last_login_time: "",
//   authorized: ""
// })
// console.log(test)