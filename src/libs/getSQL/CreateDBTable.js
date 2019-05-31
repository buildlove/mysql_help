/**
 * 创建表
 * @param {*} table_name 表名
 * @param {*} db_construct 表字段
 */
const CreateDBTable = function(db_name, table_name, db_construct){
  let fields = Object.keys(db_construct)
  let sql = `Create Table If Not Exists ${table_name} (`
  fields.forEach(function(field, index){
    if(index === 0){
      sql += `${field} varchar(180),`
    }else if(field.indexOf('text') !== -1){
      sql += `${field} text,\n`
    }else{
      sql += `${field} varchar(255),`
    }
    if(index === fields.length - 1){
      sql += `primary key(${fields[0]})`
    }
  })
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='${db_name}'`
  return sql
}

module.exports = CreateDBTable