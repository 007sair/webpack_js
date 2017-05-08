/**
 * position sticky
 */
var utils = require('./utils.js');

var sticky = {};

var oPlaceHolder = {
	$elem: null,
	show: function($obj) {
		if (!this.$elem) {
			this.$elem = $('<div style="height:' + $obj.height() + 'px;">');
			$obj.after(this.$elem);
		} else {
			this.$elem.css('display', 'block');
		}
	},
	hide: function() {
		this.$elem.css('display', 'none');
	}
};

sticky.isSupport = function() { //is Support Sticky
	var prefixTestList = ['', '-webkit-'];
	var stickyText = '';
	for (var i = 0; i < prefixTestList.length; i++) {
		stickyText += 'position:' + prefixTestList[i] + 'sticky;';
	}
	// 创建一个dom来检查
	var div = document.createElement('div');
	var body = document.body;
	div.style.cssText = 'display:none;' + stickyText;
	body.appendChild(div);
	var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
	body.removeChild(div);
	div = null;
	return isSupport;
};

sticky.polyfill = function($obj, offsetTop, zIndex) {
	if (!$) {
		console.warn('$ is not defined');
		return false;
	};
	zIndex = zIndex || 1000;
	if (this.isSupport()) {
		$obj.addClass('sticky').css({
			'top': offsetTop,
			'z-index': zIndex
		});
	} else {
		var stop = utils.debounce(function() {
			$('body').removeClass('disable-event');
		}, 50);

		var flag = 0; //just run once
		var top = $obj.offset().top;
		window.addEventListener('scroll', function() {
			var scrollTop = $(this).scrollTop();
			$('body').addClass('disable-event');
			if (scrollTop == 0) {
				unfixed();
			} else {
				if (scrollTop > top) {
					fixed();
				} else {
					//防止top值在滑动过程中被修改  优化，需要节流函数
					var temp_top = $obj.offset().top;
					if (temp_top !== top) { 
						top = temp_top;
					};
					unfixed();
				}
			}
			stop();
		});

		function fixed() {
			if (flag) return;
			var p_height = $obj.height();
			oPlaceHolder.show($obj);
			$obj.css({
				'position': 'fixed',
				'width': '100%',
				'left': 0,
				'top': offsetTop,
				'z-index': zIndex
			});
			// console.log('fixed');
			flag = 1;
		}

		function unfixed() {
			if (!flag) return;
			oPlaceHolder.hide($obj);
			$obj.removeAttr('style');
			// console.log('unfixed');
			flag = 0;
		}
	}
};


module.exports = sticky;