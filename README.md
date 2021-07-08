# mysql_help

文档链接 https://www.yuque.com/docs/share/411375d9-d449-43d1-921f-c338f3345afe

## QuickStart

### Development

app.js

```

const config = require('./config.json');

npm install mysql_help --save

const mysqlHelp = require('mysql_help')

mysqlHelp.config(config)

```

other.js

```

  const mysqlHelp = require('mysql_help') // 引用

  let userTable = new mysql_help('user')  // 实例化 user 表

  userTable.getAllRows().then(function(data){
    console.log(data)
  })

```

### test

```
  const mysqlHelp = require('mysql_help')

  mysql_help.config({
    "mysql": {
        "host": "127.0.0.1",
        "port": "3306",
        "user": "root",
        "password": "12345678",
        "db": "user",
        "env": "dev" 
    },
    // 可选参数配置(自动在数据库创建 app 表(数据库中存在 'app' 表, 不会创建))
    <!-- "tables": {
        "app": {
            "id": "",  // 默认创建
            "name": "" // 默认创建
        }
    } -->

  }, function(cf){

    let userTable = new mysql_help('user')
    userTable.getAllRows().then(function(data){
      console.log(data)
    })

  })

```

> 一张表只标记一个主键，当有多个主键时，按顺序标记第一个。



1. 添加数据 AddDataSQL

请求参数说明：

参数值	类型	说明
self	object	数据库参数
rowsData	Array	添加数据
返回数据示例:


2. 表聚合 AggregSQL

请求参数说明：

参数值	类型	说明
self	object	数据库参数
rowsData	Array	添加数据
返回数据示例:


3. 创建数据库 CreateDatabaseSQL

请求参数说明：

参数值	类型	说明
self	object	数据库参数
返回数据示例:


4. 创建数据库的表 CreateDBTable

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
table_name	String	数据库名称
db_construct	String	表头字段名称
返回数据示例:


5. 删除多行数据 DeleteRowsSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
whereItem	any	需要删除的条件
field	String	需要删除的单个字段名称如: name, 不填则为id
返回数据示例:


6. 获取表的所有字段名称 GetAllColumnName

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
table_name	String	数据表名称
返回数据示例:


7. 获取表里所有数据 GetAllRowsSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
table_name	String	数据表名称
返回数据示例:


8. 获取数据库中所有表的名称 GetAllTableNameSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
返回数据示例:


9.按条件对数据进行统计 GetCountSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库参数
where	Object	过滤条件
返回数据示例:


10.查询表的主键 GetPrimaryKeySQL

请求参数说明：

参数值	类型	说明
table_name	String	数据库名称
返回数据示例:


11.根据多个id查询多条数据 GetRowsByIdsSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
ids	Array	数据id
where	Object	过滤条件(默认是数据表的id)
返回数据示例:


12.模糊查询数据 GetRowsByLikeSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
key	String	数据id
where	Object	过滤条件(默认是数据表的id)
返回数据示例:


13.分页查询数据 GetRowsByPageSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
current	number	当前页面数
size	number	查询条数
order	string|Object	排序字段
where	Object	其他查询条件
返回数据示例:


14.通过条件查询数据 GetRowsByWhereSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
current	number	当前页面数
size	number	查询条数
order	string|Object	排序字段
where	Object	其他查询条件
返回数据示例:


15.判断数据库是否存在 IsExistDBSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
返回数据示例:


16.更新单条数据库数据 UpdateRowSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
rowData	Object	单条数据
返回数据示例:


17.更新多条数据库数据 UpdateRowsSQL

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
rowsData	Object	单条数据
返回数据示例:


18.更新相同的字段 UpdateSameField

请求参数说明：

参数值	类型	说明
self	Object	数据库信息
field	Object	字段
where	Object	条件过滤
返回数据示例:


