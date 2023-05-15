const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 1. 注册
exports.register = (req, res) => {
  const userinfo = req.body
  // 合法性校验
  if (!userinfo.uname || !userinfo.passwd) {
    return res.send({ status: 1, message: '用户名或密码不合法！' })
  }
  // 查询用户名是否被占用
  db.query('select * from users where uname = ?', [userinfo.uname], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    db.query('select * from users where email = ?', [userinfo.email], (err, results) => {
      if (err) return res.cc(err)
      if (results.length > 0) return res.cc('邮箱已被注册！')
      // 调用 bcrypt.hashSync() 对密码进行加密
      userinfo.passwd = bcrypt.hashSync(userinfo.passwd, 10)
      db.query('insert into users set ?', { uname: userinfo.uname, passwd: userinfo.passwd, email: userinfo.email }, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
        res.cc('注册成功！', 0)
      })
    })
  })
}

// 2. 登录
exports.login = (req, res) => {
  const userinfo = req.body
  db.query('select * from users where uname = ?', [userinfo.uname], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登录失败！')
    const compareResult = bcrypt.compareSync(userinfo.passwd, results[0].passwd)
    if (!compareResult) return res.cc('登录失败！')
    // 在服务器端生成 Token 的字符串，results[0]里面含有用户的所有信息
    // ...是展开运算符，passwd''和uimg''的含义是将result[0]里面对应的值给覆盖掉，保证用户信息的安全性，使得token里面不含passwd和uimg
    const user = { ...results[0], passwd: '', uimg: '' }
    // 对用户的信息进行加密，生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 将 Token 响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}