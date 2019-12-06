
import * as Ajax from "@lib/Ajax"
import { weiboCallbackURL, wechatCallbackURL } from "@lib/config"

class AjaxData {
	constructor(endpoint) {
		this.endpoint = endpoint;
	};

	get(interfaceName) {
		let url = this.endpoint + interfaceName;
		let currentURL = encodeURIComponent(window.location.href);

		return new Promise(function (resolve, reject) {
			Ajax.post(url, function (json) {
				if (json.err == 0) {
					resolve(json.data)
				} else if (json.err == 2001) {
					var callbackurl = encodeURIComponent(window.location.href);
					window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b3447b9d54801f4&redirect_uri=" + encodeURIComponent(wechatCallbackURL + currentURL) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect");
				} else if (json.err == 3001) {
					window.location.replace("https://api.weibo.com/oauth2/authorize?client_id=275994791&redirect_uri=" + encodeURIComponent(weiboCallbackURL + currentURL) + "&response_type=code&state=123&display=123");
				} else {
					alert(json.msg);
					reject(json.msg)
				}
			})
		})


	}
}
export default  AjaxData;


// get = new Promise(function(resolve,reject){
// 			Ajax.get("XXX",function(json){
// 				if (json.err == 0) {
// 					resolve(json)
// 				}else{
// 					reject();
// 				}
// 			})
// 		})

// class get {
// 	constructor() {
// 		this.resolve = null;
// 		Ajax.get('userinfo', function(json) {
// 			if (json.err == 0) {
// 				if (typeof this.resolve == 'function') {
// 					this.resolve(json)
// 				} else {
// 					this.json = json
// 				}
				
// 			} else {
				
// 			}
// 		})
// 	}
// 	then (callback) {
// 		if (this.status !== 'resolve') {
// 			this.resolve = callback
// 		} else {
// 			callback(this.json)
// 		}
		
// 	}
// }

// // get.then(callack)
// get.then(function (json) {
// 	// json..
// })