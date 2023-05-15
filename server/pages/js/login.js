const url = 'http://127.0.0.1/'
const api = url + 'api/'
const search = window.location.search
const aid = search.substring(5)
const getPageHref = url + 'api/getpage/'

function setToken(token) {
    Cookies.set('token', token, {expires: 7})
}

var top = new Vue({
    el: '#login',
    data: {
        uname: '',
        passwd: '',
    },
    methods: {
        // 登录
        login: function () {
            var that = this
            axios.post(api + 'login/', { uname: that.uname, passwd: that.passwd })
                .then(function (response) {
                    console.log(response);
                    if (response.data.status === 1) {
                        alert('用户名或密码错误！');
                    }
                    else {
                        const token = response.data.token
                        setToken(token)
                        let targetUrl = getPageHref
                        if (aid) {
                            targetUrl += aid
                        }
                        location.href = targetUrl
                    }
                }, function (err) {
                    console.log(err)
                })
        }
    }
})