window.CONFIG || (window.CONFIG={});

const desiginwidth = 640;
let nickname = window.CONFIG.nickname || "";

export {
	desiginwidth,
	nickname
}

export let setConfig = (key, value) => {
	module.exports[key] = value;
	window.CONFIG[key] = value;
}

export let getConfig = (key) => {
	return module.exports[key];
}