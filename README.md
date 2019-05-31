Version: 2.1024.10240

## 引入插件

### 1.新建 config.json 文件

```
  {
    "mysql": { // mysql 基本配置
        "host": "127.0.0.1",
        "port": "3306",
        "user": "root",
        "password": "12345678"
    },
    // 可选参数配置(配置 'app' 表后会自动在数据库创建该表(数据库中存在 'app' 表, 不会创建))
    "tables": {
        "app": {
            "id": "",  // 默认创建
            "name": "" // 默认创建
        }
    }
  }
```


### 2.app.js中初始化配置


```

const config = require('./config.json');

npm install mysql_help --save

const mysqlHelp = require('mysql_help')

mysqlHelp.config('jobs', config)

```

> mysqlHelp.config 是一个 Promise 函数, 返回 mysql_help 生成的完整配置数据

## 使用方法

### 1. 传入参数返回对应的 sql 语句

```

const mysqlHelp = require('mysql_help')

// 实例 user 表数据
let userTable = new mysqlHelp("user")
// 获取获取查询 user 表的 SQL 语句
let user = userTable.getAllRows();

```
