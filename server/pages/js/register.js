const url = 'http://127.0.0.1/'
const api = url + 'api/'
const search = window.location.search
const aid = search.substring(5)
const loginHref = url + 'pages/login.html'

var top = new Vue({
    el: '#register',
    data: {
        uname: '',
        passwd: '',
        passwd2: '',
        email: ''
    },
    methods: {
        // 注册
        register: function () {
            var that = this
            if (that.passwd === that.passwd2) {
                axios.post(api + 'register/', { uname: that.uname, passwd: that.passwd, email: that.email })
                    .then(function (response) {
                        if (response.data.status === 1) {
                            alert(response.data.message);
                        }
                        else {
                            let targetUrl = loginHref
                            if (aid) {
                                targetUrl += '?aid=' + aid
                            }
                            location.href = targetUrl
                        }
                    }, function (err) {
                        console.log(err)
                    })
            }
            else {
                alert('两次输入的密码不一致！')
            }
        }
    }
})