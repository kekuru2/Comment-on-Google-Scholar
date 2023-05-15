const joi = require('joi')

// 定义用户名和密码的验证规则，用户名大于1小于20
const uname = joi.string().min(1).max(20).required()
const passwd = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required()

// 定义 邮箱 的验证规则
const user_email = joi.string().email().required()

// 定义验证 uimg 头像的验证规则
const uimg = joi.string().dataUri().required()

// 验证登录和注册
exports.reg_login_schema = {
  body: {
    uname,
    passwd
  }
}

exports.reg_register_schema = {
  body: {
    uname,
    passwd,
    email: user_email
  }
}

// 验证更新uname
exports.update_userinfo_schema = {
  body: {
    uname
  }
}

// 验证更新pwd
exports.update_passwd_schema = {
  body: {
    oldPasswd: passwd,
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPasswd: joi.not(joi.ref('oldPasswd')).concat(passwd)
  }
}

// 验证更新头像
exports.update_avatar_schema = {
  body: {
    avatar: uimg
  }
}