const express = require('express')
const router = express.Router()

// 路由处理函数模块
const userinfo_handler = require('../router_handler/userinfoHandler')

// 验证数据
const expressJoi = require('@escook/express-joi')
// 验证规则
const { update_userinfo_schema, update_passwd_schema, update_avatar_schema } = require('../schema/userSchema')

// 1. 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 2. 更新用户信息（用户名）
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 3. 更新密码
router.post('/updatepasswd', expressJoi(update_passwd_schema), userinfo_handler.updatePassword)
// 4. 更换头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router