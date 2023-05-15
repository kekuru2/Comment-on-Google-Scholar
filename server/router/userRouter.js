const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/userHandler')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema, reg_register_schema } = require('../schema/userSchema')

// 1. 注册
router.post('/register', expressJoi(reg_register_schema), userHandler.register)

// 2. 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router