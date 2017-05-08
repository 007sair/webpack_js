/**
 * rem脚本js
 * ----------------
 * 根据 /src/css/_config.scss 中的变量 $output 的值引入对应js
 *   $output: 640    ->   ./lib/rem640.js
 *   $output: 750    ->   ./lib/rem750.js
 */
var rem = require('Lib/rem750.js');
var utils = require('Mods/utils.js');
var Cookies = require('Lib/js.cookie.js');
var sticky = require('Mods/sticky.js');
var doT = require('Lib/doT.js');

//cookie key
var cookie_key = '_group' + (new Date().getMonth() + 1) + new Date().getDate() + '_';

console.log('index');

var pre = 'http://local.m.miyabaobei.com';

//页面数据
var oPage = {
	tab_index: 0, //红色tab的当前索引值
	tabs: [], //红色tab组
};

// sticky.isSupport = function() {
// 	return false
// };

console.log('sticky:', sticky.isSupport());

sticky.polyfill($('.g-scrollbar'), '-1px');

var oNotice = {
	flag: 0,
	elem: $('.notice'),
	delay: 3000,
	show: function() {
		if (this.flag == 1) return false;
		var _this = this;
		this.elem.animate({
			transform: 'translate3d(0, 100%, 0)'
		}, 400, 'ease', function() {
			_this.hide()
		});
		this.flag = 1;
	},
	hide: function() {
		var _this = this;
		setTimeout(function() {
			_this.elem.animate({
				transform: 'translate3d(0, 0, 0)'
			}, 400, 'ease', function(){});
		}, _this.delay)
	},
	isUse: function() {
		var count = 1;
		if (!Cookies.get(cookie_key)) {
			Cookies.set(cookie_key, 1, { expires: 1 });
		} else {
			count = Cookies.get(cookie_key);
			count++;
			Cookies.remove(cookie_key);
			Cookies.set(cookie_key, count, { expires: 1 });
		}
		return count < 4 && count > 0
	}
};



var scrollItems = {
	$ele: $('#uper'),
	data: null,
	end: false,
	id: 0,
	speed: 1000,
	init: function() {
		var _this = this;
		this.getData(function(data){
			_this.data = data.slice(0);

			_this.fix();
			_this.add(3);
			_this.move();
		});
	},
	add: function(num) {
		var _this = this;
		if (_this.data.length == 0) {
			this.getData(function(data) {
				if (data.length) {
					_this.data = data
				} else {
					_this.$ele.append(_this.$ele.find('li').first().clone());
					_this.end = true;
				}
			})
		};
		var data = _this.data.splice(0, num);
		var html = '';
		for (var i = 0, len = data.length; i < len; i++) {
			html += '<li _id="'+ data[i].id +'"><a href="javascript:;"><img src="' + data[i].icon + '" alt="">' + data[i].title + '</a></li>';
		};
		this.$ele.append(html);
	},
	move: function() {
		var _this = this;
		var $li = _this.$ele.find('li'),
			iheight = $li.height(),
			len = $li.length;
		var count = 0;
		setInterval(function() {
			count++;
			_this.$ele.animate({
				translate3d: '0,' + -(iheight + 50) * count + 'px,0'
			}, 700, 'ease-out', function() {
				len = _this.$ele.find('li').length;
				if (count >= len - 1) {
					count = 0;
					$(this).animate({translate3d: '0,0,0'}, 0)
				};
				if (!_this.end) {
					_this.add(1);
				};
			});
		}, _this.speed);
	},
	fix: function() {
		var $notice = this.$ele.parent();
		var offsetTop = $notice.offset().top;
		var top = $('.g-scrollbar').height() + 20;
		window.addEventListener('scroll', function() {
			var st = $(window).scrollTop();
			if (st + top > offsetTop) {
				$notice.css({
					'position': 'fixed',
					'top': top + 'px'
				});
			} else {
				$notice.css({
					'position': 'absolute',
					'top': offsetTop + 'px'
				});
			}
		});
	},
	getData: function(cb) {
		var _this = this;
		$.ajax({
			url: pre + '/instant/groupon/index_scroll_text/' + _this.id,
			type: 'get',
			data: {},
			dataType: 'json',
			success: function(data) {
				// data.data.length = 4;
				cb && cb(data.data);
				_this.id = data.data[0].id;
			}
		});
	}
};
scrollItems.init();


//swiper
(function() {
	var Swipe = require('Lib/swipe.js');
	var $swiper = $('#grouponIndex'),
		$pointer = $swiper.find('.swipe-pointer'),
		len = $swiper.find('.swipe-item').length,
		span = '';
	for (var i = 0; i < len; i++) {
		span += i ? '<span></span>' : '<span class="cur"></span>';
	}
	$pointer.html(span);
	var elem = document.getElementById('grouponIndex');
	var swiper = Swipe(elem, {
		handleLoop: true,
		auto: 4000,
		callback: function(index, ele) {
			$pointer.find('span').eq(index).addClass('cur').siblings().removeClass('cur');
		}
	});
})();

//scroll bar
var IScroll = require('Lib/iscroll.js');
window.myScroll = new IScroll('#scrollbar', {
	fixedScrollBar: true,
	bindToWrapper: false,
	eventPassthrough: true,
	scrollX: true,
	scrollY: false,
	preventDefault: false,
	click: true
});

/**
 * 初始化oPage
 */
function initPageData() {
	$('.g-scrollbar').find('li').each(function(index, el) {
		oPage.tabs.push({
			page: 1,
			isRender: false,
			cate_id: $(this).attr('_cate_id'),
			isEnd: false
		});
		if (index == 0) {
			oPage.tabs[0].sec_tab_index = 0;
			oPage.tabs[0].isRender = true;
		};
	});

	oPage.tabs[0].sec_tabs = []; //首页有一个二级tab
	$('.secondbar').find('li').each(function(index, el) {
		oPage.tabs[0].sec_tabs.push({
			page: 1,
			cate_id: $(this).attr('_cate_id'),
			isRender: false,
			isEnd: false
		});
	});

}
initPageData();


/**
 * 滚动加载数据
 * render: function(){}  //满足滚动条件后渲染
 */
var ScrollLoad = require('Mods/scrollLoad.js');
var scrollload = new ScrollLoad({
	render: function() {
		var _this = this;
		setTimeout(function() {
			var page = 0,
				cate_id, 
				curTab = getCurTab();
			if (curTab.isEnd) {
				_this.loader.inform('- 到底啦 -');
				return false;
			}

			$.ajax({
				url: pre + '/instant/groupon/common_list/' + (curTab.page++) + '/' + curTab.cate_id + '/',
				type: 'get',
				dataType: 'json',
				success: function(data) {
					if (data.flag == 1) {
						if (oPage.tab_index == 0) {
							renderHomeList(data.data_list);
						} else {
							renderType(data.cate_list);
							renderSecondList(data.data_list);
						}

						_this.loader.hide();
					}
					if (data.flag == 0) {
						_this.loader.inform('- 到底啦 -');
						curTab.isRender = true;
						curTab.isEnd = true;
					}
				},
				error: function() {
					console.log('ajax error')
					_this.reload();
				}
			});
		}, 200)
	}
});

/**
 * 渲染拼团首页商品列表
 */
function renderHomeList(arr) {
	var html = '';
	arr.forEach(function(item) {
		item.sale_price = utils.fomatFloat(item.sale_price);
		item.groupon_price = utils.fomatFloat(item.groupon_price);
	});
	var interText = doT.template($("#gItems").text());
	$('.itemlist').find('ul').eq(oPage.tabs[0].sec_tab_index).append(interText(arr));
	oPage.tabs[0].sec_tabs[oPage.tabs[0].sec_tab_index].isRender = true;

	//数据第一次渲染完成后显示更新商品信息
	setTimeout(function() {
		if (oNotice.isUse()) {
			oNotice.show();
		};
	}, 500)
}

/**
 * 渲染非首页的二级分类
 */
function renderType(arr) {
	var interText = doT.template($("#gChannel").text());
	$('.g-container').eq(oPage.tab_index).append(interText(arr));

	oPage.tabs[oPage.tab_index].isRender = true;
}

/**
 * 渲染非首页的商品列表
 */
function renderSecondList(arr) {
	var interText = doT.template($("#gSecItemList").text());
	$('.g-container').eq(oPage.tab_index).append(interText(arr));

	oPage.tabs[oPage.tab_index].isRender = true;
}

/**
 * 根据tab切换中的index设置当前的tab
 */
function getCurTab() { //此函数一定要在切换tab并给oPage的index赋值后执行
	var curTab = null;
	if (oPage.tab_index == 0) { //首页
		curTab = oPage.tabs[0].sec_tabs[oPage.tabs[0].sec_tab_index];
	} else { //非首页
		curTab = oPage.tabs[oPage.tab_index];
	}
	return curTab;
}


/**
 * Events
 */
var toggletimer = null; //防止频繁切换导致数据渲染错误
$('#scrollbar').on('click', 'li', function() {
	if ($(this).hasClass('active')) return false;
	var index = $(this).index();
	$(this).addClass('active').siblings('li').removeClass('active');
	$('.g-container').eq(index).css('display', 'block').siblings('.g-container').css('display', 'none');

	clearTimeout(toggletimer);
	toggletimer = setTimeout(function() {
		oPage.tab_index = index;
		var curTab = getCurTab();
		if (!curTab.isRender) {
			scrollload.loader.show();
			scrollload.render();
		}
		if (curTab.isEnd) {
			scrollload.loader.inform('- 到底啦 -');
		}
		// console.log(oPage);
	}, 100)

});


$('.secondbar').on('click', 'li', function() {
	if ($(this).hasClass('active')) return false;
	var index = $(this).index();
	$(this).addClass('active').siblings('li').removeClass('active');
	$('.itemlist').find('ul').eq(index).show().siblings('ul').hide();

	clearTimeout(toggletimer);
	toggletimer = setTimeout(function() {
		oPage.tabs[0].sec_tab_index = index;
		var curTab = getCurTab();
		if (!curTab.isRender) {
			scrollload.render();
		};
		if (curTab.isEnd) {
			scrollload.loader.inform('- 到底啦 -');
		}
		// console.log(oPage);
	}, 100)
});



