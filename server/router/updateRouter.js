const express = require('express')
const router = express.Router()
const updateHandler = require('../router_handler/updateHandler')

// 3. 使用 insert 接口插入主楼评论
router.post('/insert/', updateHandler.insert)

// 4. 使用 delete 接口删除评论
router.post('/delete/', updateHandler.delete)

// 5. 使用 insert2 接口插入楼中楼评论
router.post('/insert2/', updateHandler.insert2)

// 6. 使用 delete2 接口删除评论
router.post('/delete2/', updateHandler.delete2)

module.exports = router