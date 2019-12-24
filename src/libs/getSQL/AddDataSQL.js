let errorCode = require('../ErrorCode/code.json')

/**
 * 保存数据 - SQL转换
 * @param {string} id_name            表id字段的名称
 * @param {string} table_namedata     表
 */
const AddDataSQL = function(self, rowDatas){  let args = format(self.id_name, rowDatas, self.dbConstruct)

  if(args && args.length){
    let tableTitle = `${self.table_name}(` + Object.keys(self.dbConstruct).join(",") + ')'
    let v = getValues(args)
    // console.log(v)
    let sql = `INSERT INTO ${tableTitle} VALUES${v}`;
    return sql
  }else{
    return errorCode['100001']
  }

}

// 规范数据结构
function format(id_name, rowDatas, dbConstruct){
  let datas = rowDatas && Array.isArray(rowDatas) ? rowDatas : [rowDatas]
  let args = [];
  // 根据表结构调整顺序, 新增 id
  for (let i = 0; i < datas.length;i++){
    let row = datas[i]
    if(row && !row[id_name]){
      delete dbConstruct[id_name]
    }
    // console.log(dbConstruct, '======')
    // row[id_name] = row[id_name] ? row[id_name] : uuid(15)
    if(row){
      let arg = sortArg(row, dbConstruct);
      args.push(arg)
    }
  }

  return args
}

// 根据数据生成 sql 语句
function getValues(args){ // [{a: '111', b:'222'}]  || {a: '111', b:'222'}
  if(!Array.isArray(args)){getValues([args])}
  let v = ""
  let signal = "'" // 写死为单引号
  for(let i=0;i<args.length;i++){
    let newVal = ''
    let vs = args[i]
    let keyObj = Object.values(vs) // ['111', '222']
    keyObj.forEach(function (value, index) {
      if(value || value === 0 || typeof value === 'string'){

        // 特殊处理单双引号
        if(signal==="'" && typeof value === 'string' && value.includes("'")){ // 同时有双引号和单引号 替换所有单引号为双引号
          value = value.replace(/\'/g, '"')
        }

        newVal += signal + value + signal
      }else{ // value值不存在的统一变为null
        newVal += null
      }
      if(keyObj.length !== index+1){
        newVal += ','
      }
    })
    let b = ','
    if(args.length === i+1){
      b = ';'
    }
    v += ' (' + newVal + ')' + b;
  }
  return v // ("111","2222",null);
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