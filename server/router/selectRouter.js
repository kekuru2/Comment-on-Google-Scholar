const express = require('express')
const router = express.Router()
const selectHandler = require('../router_handler/selectHandler')

// 1. 使用 getpage 接口返回一个页面
router.get('/getpage/:aid', selectHandler.getPage)

// 2. 使用 select 接口查询评论
router.get('/select/:aid', selectHandler.select)

module.exports = router
