
以下数据库仅仅只代表 mysql 数据库。
1. 查询数据库数据
  select * from ${tableName} where ${where}
  (1) 使用 id 查询数据库数据。
  (2) 使用多个 id 查询数据库数据。
  (3) 使用任意字段查询数据库数据。
  (4) 使用任意多个字段查询数据库数据。
  (5) 混合使用不同字段 and | or 查询数据库数据。
2. 更新数据库数据
  update ${tableName} set ${args.keys.join(",")} where ${args.where}
  (1) 使用 id 更新数据库数据。
3. 新增数据库数据
  insert into ${tableName} values (${v})
  (1) 自动随机生成 id, 插入数据到数据库。
4. 删除数据库数据
  delete from ${tableName} where ${where}
  (1) 使用 id 删除数据库数据。
  (2) 使用 ids 删除数据库数据。
  (3) 使用任意字段删除数据库数据。