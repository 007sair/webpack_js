/**
 * loading状态对象
 */

var defaults = {
	icon: 'https://img.miyabaobei.com/d1/p4/2016/11/28/0e/c1/0ec12ebad6c4e9d7bb53467455158410024083338.png',
	size: 20
};

function Loading(options) {
	this.opts = $.extend({}, defaults, options);
	this.elem = null;
}

Loading.prototype = {
	constructor: Loading,
	init: function() {
		this.insertCSS();
		this.insertHTML();
	},
	insertHTML: function() {
		var sHTML = '<div class="__loading__"><i></i>上滑加载更多</div>';
		var elem = this.str2dom(sHTML);
		document.body.appendChild(elem);
		this.elem = elem;
	},
	insertCSS: function() {
		var style = document.createElement('style');
		style.innerHTML = ".__loading__{padding:15px 0;text-align:center;font-size:12px;color:#666;line-height:"+ this.opts.size +"px;visibility:hidden}.__loading__ i{display:inline-block;vertical-align:top;margin-right:8px;background:url("+ this.opts.icon +") no-repeat;background-size:"+ this.opts.size +"px;width:"+ this.opts.size +"px;height:"+ this.opts.size +"px}";
		document.getElementsByTagName('head')[0].appendChild(style);
	},
	show: function() {
		this.elem.style.visibility = 'visible';
		this.elem.innerHTML = '<i></i>数据加载中，请稍后';
		this.status = 1;
	},
	hide: function() {
		this.elem.style.visibility = 'hidden';
		this.status = 0;
	},
	remove: function() {
		document.body.removeChild(this.elem);
	},
	inform: function(str) {
		this.elem.style.visibility = 'visible';
		this.elem.innerHTML = str;
		this.status = 0;
	},
	reload: function() {
		var btn = this.str2dom('<button>重新载入</button>');
		this.elem.innerHTML = '';
		this.elem.appendChild(btn);
		this.reloadbtn = btn;
	},
	isLoading: function() {
		if (this.status == 1) {
			return true
		};
		return false;
	},
	str2dom: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str;
		return div.childNodes[0];
	}
};

module.exports = Loading;