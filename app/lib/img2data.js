import * as Ajax from './Ajax'
import {htmlServerHost} from './config'

export default (url, callback) => {
	if (url.indexOf(htmlServerHost) != -1) return callback && callback(url);
	Ajax.getJSON('http://eexx.me/sina/img2data.php?url=' + encodeURIComponent(url), (json) => {
		if (json.code == 200) {
		 	callback && callback(json.data)
		 } else {
		 	console.log(json.msg)
		 }
	})
}