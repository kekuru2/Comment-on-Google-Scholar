const db = require('../db/index')

// 3. 使用 insert 接口插入主楼评论
exports.insert = (req, res) => {
  const aid = req.body.aid
  const content = req.body.content
  const time = req.time
  const status = 1
  const uid = req.user.uid
  // 获取最高楼层数，当前评论楼层为最高楼 + 1
  db.query('select MAX(layer) maxLayer from comments where aid = ?;', [aid], (err, results) => {
    if (err) return res.cc(err)
    const layer = results[0].maxLayer + 1
    db.query('insert into comments (aid, layer, content, time, status, uid) values (?, ?, ?, ?, ?, ?);', [aid, layer, content, time, status, uid], (err2, results2) => {
      if (err2) return res.cc(err2)
      res.send('OK')
    })
  })
}

// 4. 使用 delete 接口删除评论
exports.delete = (req, res) => {
  const cid = req.body.cid
  db.query('select * from comments where cid = ?', [cid], (err, results) => {
    if (err) return res.cc(err)
    if (results[0].uid != req.user.uid) {
      res.send('您没有权限删除该评论。')
    }
    else {
      db.query('update comments set status = 0 where cid = ? or ofcid = ?', [cid, cid], (err, results) => {
        if (err) return res.cc(err)
        res.send('OK')
      })
    }
  })
}

// 5. 使用 insert2 接口插入楼中楼评论
exports.insert2 = (req, res) => {
  const aid = req.body.aid
  const ofcid = req.body.ofcid
  const content = req.body.content
  const time = req.time
  const status = 1
  const uid = req.user.uid

  db.query('insert into comments (aid, ofcid, content, time, status, uid) values (?, ?, ?, ?, ?, ?);', [aid, ofcid, content, time, status, uid], (err, results) => {
    if (err) return res.cc(err)
    res.send('OK')
  })
}

// 6. 使用 delete2 接口删除评论
exports.delete2 = (req, res) => {
  const cid = req.body.cid

  db.query('select * from comments where cid = ?', [cid], (err, results) => {
    if (err) return res.cc(err)
    if (results[0].uid != req.user.uid) {
      res.send('您没有权限删除该评论。')
    }
    else {
      db.query('update comments set status = 0 where cid = ?;', [cid], (err, results) => {
        if (err) return res.cc(err)
        res.send('OK')
      })
    }
  })
}