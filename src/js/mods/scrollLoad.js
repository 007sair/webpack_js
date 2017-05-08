/**
 * 上滑加载
 */

//loading
var Loading = require('./loading.js');

//scroll load
var WINDOW_HEIGHT = $(window).height();

var defaults = {
	page: 0,
	loader: new Loading(),
	render: function() {}
};

function ScrollLoad(options) {
	this.opt = $.extend({}, defaults, options);
	this.page = this.opt.page;
	this.loader = this.opt.loader;
	this.render = this.opt.render;

	this.init();
}

ScrollLoad.prototype = {
	constructor: ScrollLoad,
	init: function() {
		this.loader.init();
		this.bindEvent();
		if ($(document).height() <= WINDOW_HEIGHT) {
			this.success();
		}
	},
	bindEvent: function() {
		var _this = this;
		$(window).scroll(function() {
			if (_this.loader.isLoading()) return false;
			var scrollTop = $(this).scrollTop();
			var docHeight = $(document).height();
			if (scrollTop >= docHeight - WINDOW_HEIGHT) {
				_this.success();
			}
		});
	},
	success: function() {
		this.loader.show();
		this.render();
	},
	reload: function() {
		var _this = this;
		this.loader.reload();
		this.loader.reloadbtn.addEventListener('click', function(){
			_this.loader.show();
			_this.render();
		})
	}
};

module.exports = ScrollLoad;