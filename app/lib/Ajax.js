/* 小玲欢 */
import {htmlServerHost} from './config'

//格式化参数
let formatParams = (data) => {
	var arr = [];
	for (var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".",""));
	return arr.join("&");
}

let ajax = (options) => {
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = formatParams(options.data);

	//创建 - 非IE6 - 第一步
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else { //IE6及其以下版本浏览器
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	//接收 - 第三步
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				options.success && options.success(xhr.responseText, xhr.responseXML);
			} else {
				options.fail && options.fail(status);
			}
		}
	}

	//连接 和 发送 - 第二步
	if (typeof options.xhrFields === 'object' && options.xhrFields.withCredentials || location.host != htmlServerHost) {
		xhr.withCredentials=true;
	}
	if (options.type == "GET") {
		xhr.open("GET", options.url + "?" + params, true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open("POST", options.url, true);
		//设置表单提交时的内容类型
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(params);
	}
}

export {ajax}

export let get = function (...o) {
	typeof o[1] == 'function' ? (
		o[3] = o[2],
		o[2] = o[1],
		o[1] = {}
	) : null;

	ajax({
		url: o[0],
		type: "GET",
		data: o[1],
		dataType: "json",
		success: function (response, xml) {
			let json = eval('(' + response + ')');
			o[2] && o[2](json);
		},
		fail: function (status) {
			o[3] && o[3](json);
		}
	});
}

export let post = function (...o) {
	typeof o[1] == 'function' ? (
		o[3] = o[2],
		o[2] = o[1],
		o[1] = {}
	) : null;

	ajax({
		url: o[0],
		type: "post",
		data: o[1],
		dataType: "json",
		success: function (response, xml) {
			let json = eval('(' + response + ')');
			o[2] && o[2](json);
		},
		fail: function (status) {
			o[3] && o[3](json);
		}
	});
}

export let getJSON = function (...args) {
	let url = args[0];
	let data = typeof args[1]!=='function' ? args[1] : {};
	let fn = typeof args[1]==='function' ? args[1] : args[2];
	let fn_name = "AJAX" + Math.floor(Math.random()*10000000);
	let elem = document.createElement("script");
	url += (url.search(/\?/) === -1 ? '?' : '&') + Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
	elem.setAttribute("type", "text/javascript");
	elem.setAttribute("language", "javascript");
	elem.setAttribute("src", url + (url.indexOf('?')!=-1?'&':'?') + 'callback=' + fn_name);
	document.head.appendChild(elem);
	window[fn_name] = function(json) {
		fn(json);
	};
}