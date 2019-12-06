import $ from "jquery";

const api = 'http://common.mn.sina.com.cn/activity/jsonp/'
let pid = 499;

export let get = function (...o) {
	typeof o[1] == 'function' ? (
		o[3] = o[2],
		o[2] = o[1],
		o[1] = {}
	) : null;
	$.getJSON(api + pid + '/' + o[0] + '?callback=?', o[1], function(json, textStatus) {
		if (json.err == 0) {
			o[2](json, textStatus);
		} else if(json.err == 0xA0) {
			// 微信未登录
			alert('请先授权微信登录！');
			window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1b43c71a4970c9f9&redirect_uri="+encodeURIComponent('http://common.mn.sina.com.cn/wx/wx_oauth2')+"&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(location.href)+"#wechat_redirect");
		} else if(json.err == 0xB0 || json.err == 0xB1) {
			// 微博未登录
			alert('请先登录微博！');
			window.location.replace("https://api.weibo.com/oauth2/authorize?client_id=2485256049&redirect_uri="+encodeURIComponent('http://common.mn.sina.com.cn/wb/wb_oauth2')+"&response_type=code&state="+encodeURIComponent(location.href)+"&display=");
		} else {
			typeof o[3] == 'function' ? o[3](json, textStatus) :
			alert(json.msg);
		}
	}); 
}