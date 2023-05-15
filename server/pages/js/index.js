const currentUrl = window.location.href.trim()
const startIndex = currentUrl.indexOf('api/get') + 12
const endIndex = currentUrl.indexOf('?') == -1 ? currentUrl.length : currentUrl.indexOf('?')
const aid = currentUrl.substring(startIndex, endIndex)

const url = 'http://127.0.0.1/'
const api = url + 'api/'
const my = url + 'my/'
const loginHref = url + 'pages/login.html'
const registerHref = url + 'pages/register.html'
const token = Cookies.get('token')
var uid = 0

var topBox = new Vue({
    el: '#topBox',
    data: {
        isLogin: false,
        uid: 0,
        uname: '00',
        uimg: '',
    },
    methods: {
        // 退出登录，从 cookie 中抛弃 token
        logout: function () {
            Cookies.remove('token')
            location.reload()
        },

        // 跳转到登录界面
        getLogin: function () {
            location.href = loginHref + '?aid=' + aid
        },

        // 跳转到注册界面
        getRegister: function () {
            location.href = registerHref + '?aid=' + aid
        }
    }
})

var commentBox = new Vue({
    el: '#commentBox',
    data: {
        isShowArray: {},
        comments: [],
        username: '',
        content: ''
    },
    methods: {
        // 更换当前显示状态，显示当前楼中楼回复框并去掉其他的
        changeShow: function (index) {
            for (k in this.isShowArray) {
                this.isShowArray[k] = false
            }
            this.isShowArray[index] = true
        },

        // 光标注视值为空
        changeContent: function (box) {
            this.content = box.target.value
            box.target.value = ''
        },

        // 删除评论，前后端都验证一次
        deleteItem: function (cid) {
            axios.post(my + 'delete/', { cid: cid }, {
                headers: {
                    Authorization: token
                }
            })
                .then(function (response) {
                    location.reload()
                }, function (err) {
                    console.log(err);
                })
        },

        // 楼中楼评论
        insertItem2: function (cid, aid) {
            var that = this
            axios.post(my + 'insert2/', { ofcid: cid, aid: aid, content: that.content }, {
                headers: {
                    Authorization: token
                }
            })
                .then(function (response) {
                    if (response.data.status === 1) {
                        alert('请先登录！')
                    }
                    else location.reload()
                }, function (err) {
                    console.log(err)
                })
        },

        // 删除楼中楼评论
        deleteItem2: function (cid) {
            axios.post(my + 'delete2/', { cid: cid }, {
                headers: {
                    Authorization: token
                }
            })
                .then(function (response) {
                    location.reload()
                }, function (err) {
                    console.log(err);
                })
        }
    }
})

var replyBox = new Vue({
    el: '#replyBox',
    data: {
        username: '',
        content: ''
    },
    methods: {
        // 主楼评论
        insertItem: function () {
            var that = this
            axios.post(my + 'insert/', { aid: aid, content: that.content }, {
                headers: {
                    Authorization: token
                }
            })
                .then(function (response) {
                    // console.log(response);
                    if (response.data.status === 1) {
                        alert('请先登录！')
                    }
                    else location.reload()
                }, function (err) {
                    console.log(err)
                })
        }
    }
})

// token 实现7天免登录
if (token) {
    axios.get(my + 'userinfo/', {
        headers: {
            Authorization: token
        }
    }).then(function (response) {
        if (response.data.status === 0) {
            topBox.isLogin = true
            const data = response.data.data
            topBox.uimg = data.uimg ? data.uimg : 'http://127.0.0.1/pages/img/lion.png'
            topBox.uid = data.uid
            topBox.uname = data.uname
            uid = data.uid
        }
    }, function (err) { console.log(err); })
}

// 查询评论信息
axios.get(api + 'select/' + aid).then(function (response) {
    commentBox.comments = response.data
    const len = commentBox.comments.length
    // 楼中楼评论区需要使用 json 格式的信息，v-if 或 v-show 不监视布尔值数组变化
    for (let k = 0; k < len; k++) {
        commentBox.$set(commentBox.isShowArray, k, false)
    }
    for (k in commentBox.comments) {
        if (uid === commentBox.comments[k].uid) { commentBox.comments[k].isAuthor = true }
        for (l in commentBox.comments[k].innerContent) {
            if (commentBox.comments[k].innerContent[l].uid === uid) { commentBox.comments[k].innerContent[l].isAuthor = true }
        }
    }
}, function (err) { console.log(err); })