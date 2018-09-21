## mysql_help

版本 v1.0.1

### 简介

  * 插件封装基本 sql 语句提供接口用于单表查询。
  * 插件接口仅仅用于后端查询数据库构建 api 返回给前端。
  * 插件涉及的接口一般不会直接暴露给前端环境(demo 内的方式仅供参考)。

### 作为插件使用
  * npm install mysql_help --save-dev
  * let mysqlHelp = require("mysqlHelp")
  * mysqlHelp('数据库名称', '要操作的表名称', '配置文件')
  * 以下数据库仅仅只适用于 mysql 数据库, 插件提供的所有接口返回的都是 primise 对象。

### 只是想连接数据库测试插件接口是否可用

  * 确保安装 mysql 数据库, 修改 /demo/config/config.example.js 文件名称为 config.js 且修改配置。
  * 在 /demo/config/db.enum.js 文件中填入需要查询的表结构。  
  * npm i && npm run dev

### 查询数据库数据

  * 得到整个表的数据。                             // getAllRows
  * 使用 id 查询数据库数据。                      // getRowsByIds
  * 使用多个 id 查询数据库数据。                   //  getRowsByIds
  * 使用任意字段查询数据库数据。                   //  getRowsByIndexs
  * 使用任意多个字段混合查询数据库数据<and | or>。  // getRowsByWhere 

### 更新数据库数据  

  * 使用 id 更新数据库数据。                      // updataRow

### 新增数据库数据  

  * 自动随机生成 id, 插入数据到数据库。            // addRow

### 删除数据库数据  

  * 使用 id 删除数据库数据。                      // deleteRows
  * 使用 ids 删除数据库数据。                     // deleteRows

### 如果你长期需要使用单表查询且以下接口不能满足你

  * 给我提 issues
  * 给我发邮件  564845354@qq.com
  * 修改 src/db.operation.js 和 index.js, 主要代码都在里面, 目前只有 300 行, 且严格按照 js 类的写法封装, 备注详细。

### 配置文件格式

```
  // config.js
  { 
    mysql: {
      host: '127.0.0.1',
      port: '3306',
      user: 'admin',
      password: 'admin'
    }
  }

  // db.enum.js
  // 以下表结构根据自身情况而定
  // textTip 可写可不写
  {
    user: {
      userid: "userid",
      username: "username",
      password: "password",
      sex: "sex",
      mail: "mail",
      phone: "phone",
      create_time: "create_time",
      last_login_time: "last_login_time",
      authorized: "authorized"
    },
    role: {
      role_id: "role_id",
      role_code: "role_code",
      role_name: "role_name",
      remark: "remark"
    },
    textTip: {
      user: "用户信息",
      role: "角色信息"
    }
  }
```

> 实际引用代码参考 demo 内的 app.js


 