const db = require('../db/index')

// 1. 使用 getpage 接口返回一个页面
exports.getPage = (req, res) => {
  res.sendFile('C:\\114\\StudySpace\\comments\\server\\pages\\index.html')
}

// 2. 使用 select 接口查询评论
exports.select = (req, res) => {
  const aid = req.params.aid
  
  db.query('select cid, aid, layer, ofcid, comments.uid, uname, uimg, content, time, status from comments, users where comments.uid = users.uid and aid = ? and status = 1 and ofcid is NULL order by time;', [aid], (err, results) => {
    if (err) return res.cc(err)
    const len = results.length - 1
    for (let k in results) {
      if (!results[k].uimg) results[k].uimg = 'http://127.0.0.1/pages/img/lion.png'
      results[k].innerContent = []
      // 查找楼中楼评论
      db.query('select cid, aid, layer, ofcid, comments.uid, uname, uimg, content, time, status from comments, users where comments.uid = users.uid and aid = ? and status = 1 and ofcid = ? order by time;', [aid, results[k].cid], (err2, results2) => {
        if (err2) return res.cc(err2)
        for (let l in results2) {
          if (!results2[l].uimg) results2[l].uimg = 'http://127.0.0.1/pages/img/lion.png'
          results[k].innerContent.push(results2[l])
        }
        results[k].sum = results2.length
        if (k == len) res.send(results)
      })
    }
  })
}
