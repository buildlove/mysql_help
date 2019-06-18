let { uuid } = require('../../common')
let errorCode = require('../ErrorCode/code.json')

/**
 * 保存数据 - SQL转换
 * @param {string} id_name            表id字段的名称
 * @param {string} table_namedata     表
 */
const AddDataSQL = function(self, rowDatas){
  let args = format(self.id_name, rowDatas, self.dbConstruct)

  if(args && args.length){
    let tableTitle = `${self.table_name}(` + Object.keys(self.dbConstruct).join(",") + ')'
    let v = values(args)
  
    let sql = `INSERT INTO ${tableTitle} VALUES${v}`;
    return sql
  }else{
    return errorCode['100001']
  }

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
    let vs = args[i]
    Object.values(vs).forEach(function (value) {
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
  let ArgEnum = Object.keys(dbEnum);
  let newData = {}
  ArgEnum.forEach(function (key) {
    newData[key] = data[key]
  })
  return newData
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