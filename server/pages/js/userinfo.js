const url = 'http://127.0.0.1/'
const api = url + 'api/'
const my = url + 'my/'
const search = window.location.search
const aid = search.substring(5)

function setToken(token) {
    Cookies.set('token', token, { expires: 7 })
}

function getToken() {
    return Cookies.get('token')
}

var userinfo = new Vue({
    el: '#userinfo',
    data: {
        uid: '0',
        uname: '000',
        email: '000@000.000',
        newUname: '',
        passwd: '',
        newPasswd: '',
        newPasswd2: '',
        uimg: './img/lion.png',
        avatar: ''
    },
    methods: {
        // 更换头像
        changeUimg: function () {
            var that = this
            axios.post(my + 'update/avatar/', { avatar: that.avatar }, {
                headers: {
                    Authorization: getToken()
                }
            }).then(function (response) {
                if (response.data.status === 1) {
                    alert(response.data.message)
                }
                else {
                    alert('头像更新成功！')
                    location.reload()
                }
            }, function (err) {
                console.log(err)
            })
        },

        // 更新用户名
        changeUname: function () {
            var that = this
            axios.post(my + 'userinfo', { uname: that.newUname }, {
                headers: {
                    Authorization: getToken()
                }
            }).then(function (response) {
                if (response.data.status === 1) {
                    alert('用户名已被占用或用户名不合规！')
                }
                else {
                    alert('用户名更新成功！')
                    location.reload()
                }
            }, function (err) {
                console.log(err)
            })
        },

        // 更新密码
        changePasswd: function () {
            var that = this
            if (that.newPasswd !== that.newPasswd2) alert('两次输入密码不一致！')
            else if (that.newPasswd === that.passwd) alert('新密码与旧密码相同！')
            else {
                axios.post(my + 'updatepasswd/', { newPasswd: that.newPasswd, oldPasswd: that.passwd }, {
                    headers: {
                        Authorization: getToken()
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 1) {
                            alert(response.data.message);
                        }
                        else {
                            alert('密码更新成功！')
                            location.reload()
                        }
                    }, function (err) {
                        console.log(err)
                    })
            }
        }
    }
})

// 先获取用户基本信息
axios.get(my + 'userinfo', {
    headers: {
        Authorization: getToken()
    }
}).then(function (response) {
    const data = response.data.data
    userinfo.uid = data.uid
    userinfo.uname = data.uname
    userinfo.email = data.email
    if (data.uimg) { userinfo.uimg = data.uimg }
}, function (err) { console.log(err); })