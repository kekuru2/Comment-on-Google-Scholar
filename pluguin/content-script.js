(function() {
	const url_comments = 'http://127.0.0.1/api/getPage/'
	// 文章的class是gs_rt，谷歌学术对每一篇文章的<a>标签使用gs_rt的class
	let gs_rt = document.querySelectorAll('.gs_rt')
	// 评论区需要写在class为gs_fl且不带有gs_ggs的class的<div>中
	let gs_fl = document.querySelectorAll('.gs_fl:not(.gs_ggs)')
	let len = gs_rt.length;

	// 对每个文章都加上相应的评论区，id为s，参数为aid
	for (let k = 0; k < len; k++) {
		// 得到当前文章的aid号
		let aid = gs_rt[k].getElementsByTagName('a')[0].id
		const str = '<a href="' + url_comments + aid + '">评论区</a>'
		
		// 截取字符串
		let index = gs_fl[k].innerHTML.indexOf('版本')
		if (!index) {
			continue
		}
		else index = index + 6
		const str1 = gs_fl[k].innerHTML.substring(0, index)
		const str2 = gs_fl[k].innerHTML.substring(index + 1)
		gs_fl[k].innerHTML = str1 + str + str2
	}
})();