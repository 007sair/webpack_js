/**
 * 一些方法
 */

var utils = {};

/**
* 四舍五入小数点
* @param  {[number]} src [输入的数字]
* @param  {[number]} pos [精确到后几位]
* @return {[number]}
*/
utils.fomatFloat = function(src, pos) {
	if (!arguments.length) return -1;
	if (!isNaN(src)) {
		pos = (src > 0 && src < 1) ? 2 : pos || 1;
		return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
	}
	return src
};

/**
 * var expireDays = 1;
 * date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000);
 * setcookie("sitefrom", sugs.from, date.toGMTString());
 */

utils.setcookie = function(key, value, expire) {
	var host = window.location.host;
	host = host.replace('https://', '');
	host = host.replace('www', '');
	if (!host) host = '.miyabaobei.com';
	document.cookie = key + "=" + value + ";path=/;domain=" + host + ";expires=" + expire + ";";
}

utils.getcookie = function(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) {
		return unescape(arr[2]);
	} else {
		return '';
	}
}

utils.debounce = function (func, wait, immediate) { //防抖函数
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	}
};


module.exports = utils;