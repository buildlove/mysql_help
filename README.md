# mysql_help

<!-- [文档](https://www.showdoc.cc/mysqlhelp) -->

## 引入插件和配置

#### 项目中配置使用

在 app.js 中配置

```

const config = require('./config.json');

npm install mysql_help --save

const mysqlHelp = require('mysql_help')

mysqlHelp.config(config)

```

在其他文件中使用

```

  const mysqlHelp = require('mysql_help') // 引用

  let userTable = new mysql_help('user')  // 实例化 user 表

  userTable.getAllRows().then(function(data){
    console.log(data)
  })

```

#### 直接使用

```
  const mysqlHelp = require('mysql_help')

  mysql_help.config({
    "mysql": { // mysql 基本配置
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
