// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()
// 验证数据格式的 joi 中间件
const joi = require('joi')
// 解析 json 格式的中间件
app.use(express.json())


// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件
app.use('/pages', express.static('pages'))

// 在路由之前，封装 res.cc 函数，最后定义错误级别的中间件
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况，顺带一提 0 是成功
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

// 导入 dayjs 模块，获取时间，使用中间件共享到所有路由
const dayjs = require('dayjs')
app.use((req, res, next) => {
  req.time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 导入并注册无需权限的api模块和需要权限的my模块
const select = require('./router/selectRouter')
app.use('/api', select)
const update = require('./router/updateRouter')
app.use('/my', update)
const user = require('./router/userRouter')
app.use('/api', user)
const userinfo = require('./router/userinfoRouter')
app.use('/my', userinfo)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(80, () => {
  console.log('api server running at http://127.0.0.1:80')
})