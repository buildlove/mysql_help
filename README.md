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


