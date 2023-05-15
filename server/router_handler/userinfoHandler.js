// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 1. 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  db.query('select uid, uname, email, uimg from users where uid = ?', [req.user.uid], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败！')

    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  })
}

// 2. 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  db.query('update users set ? where uid = ?', [req.body, req.user.uid], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
    res.cc('更新用户信息成功！', 0)
  })
}

// 3. 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  db.query('select * from users where uid = ?', req.user.uid, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在！')
    // compareSync 判断密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPasswd, results[0].passwd)
    if (!compareResult) return res.cc('旧密码错误！')

    // 对新密码进行加密处理
    const newPasswd = bcrypt.hashSync(req.body.newPasswd, 10)
    db.query('update users set passwd = ? where uid= ? ', [newPasswd, req.user.uid], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      res.cc('更新密码成功', 0)
    })
  })
}

// 4. 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  db.query('update users set uimg = ? where uid = ?', [req.body.avatar, req.user.uid], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更换头像失败！')
    res.cc('更换头像成功！', 0)
  })
}
