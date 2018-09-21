/**
 * 数据库字段设计枚举
 */
let user = {
  userid: "userid",
  username: "username",
  password: "password",
  sex: "sex",
  mail: "mail",
  phone: "phone",
  create_time: "create_time",
  last_login_time: "last_login_time",
  authorized: "authorized"
}

let role = {
  role_id: "role_id",
  role_code: "role_code",
  role_name: "role_name",
  remark: "remark"
}

module.exports = {
  user: user,
  role: role,
  textTip: {
    user: "用户信息",
    role: "角色信息"
  }
}