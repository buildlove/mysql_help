
/**
 * 在一张表中更新多条数据
 * @param {*} table_name 表名称
 * @param {*} id_name 表id  
 * @param {*} dbConstruct 表的数据结构
 * @param {*} rowDatas 传入数据
 */
const UpdateRowsSQL = function(table_name, id_name, dbConstruct, rowDatas){
  let SQL = `UPDATE ${table_name} SET \n`
  let KEYS = Object.keys(dbConstruct)
  let reduce = false
  KEYS.forEach(function (key, index) {
    let fieldSQL = ""
    if(key !== id_name){
      fieldSQL += `${key} = CASE ${id_name} \n`
      let one = false
      rowDatas.forEach(function (rowData) {
        if(rowData[key]){
          fieldSQL += `WHEN '${rowData[id_name]}' THEN '${rowData[key]}' \n`
          one = true
          reduce= true
        }
      })
      fieldSQL += KEYS.length === index + 1 ? 'END ' : 'END, '
      if(one){
        SQL += fieldSQL
      }
    }
  })
  // 去掉,
  if(reduce){
    SQL = SQL.substring(0, SQL.length - 2);
    SQL += ' '
  }
  let ids = rowDatas.map(function(item){return item[id_name]})
  let inIDs = "'" + ids.join("', '") + "'"
  SQL += `WHERE ${id_name} IN (${inIDs})`
  return SQL
}

// UPDATE photo SET
//     remark = CASE photo_id
//         WHEN '4866b3f0-1fb6-11e9-9ff8-3d7112b84c8b' THEN '123'
//         WHEN '4866b3f1-1fb6-11e9-9ff8-3d7112b84c8b' THEN '234'
//     END
// WHERE photo_id IN ('4866b3f0-1fb6-11e9-9ff8-3d7112b84c8b', '4866b3f1-1fb6-11e9-9ff8-3d7112b84c8b')


// console.log(UpdateRowsSQL('user','userid', {
//   userid: "",
//   username: "",
//   password: "",
//   sex: "",
//   mail: "",
//   phone: "",
//   create_time: "",
//   last_login_time: "",
//   authorized: ""
// }, [{
//   userid:'XSQ4MimuDED0KN0',
//   username: "zhangsan",
//   sex: "dddd",
//   mail: "a",
//   phone: "b",
//   create_time: "e",
//   last_login_time: "d",
//   authorized: ""
// },{
//   userid:'91fe8350-8288-11e9-9d17',
//   username: "lisi",
//   sex: "rrrrr",
//   mail: "b",
//   phone: "d",
//   create_time: "e",
//   last_login_time: "b",
//   authorized: ""
// }]))
module.exports = UpdateRowsSQL