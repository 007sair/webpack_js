/**
 * rem脚本js
 * ----------------
 * 根据 /src/css/_config.scss 中的变量 $output 的值引入对应js
 *   $output: 640    ->   ./lib/rem640.js
 *   $output: 750    ->   ./lib/rem750.js
 */
require('Lib/rem750.js');
var doT = require('Lib/doT.js');

console.log('g_detail');

var pre = 'http://local.m.miyabaobei.com';

/**
 * sticky
 */
var sticky = require('Mods/sticky.js');
// console.log(sticky.isSupport());
sticky.polyfill($('.g-scrollbar-detail'), '-1px');

//swiper
(function() {
	var Swipe = require('Lib/swipe.js');
	var $swiper = $('#grouponItems'),
		$pointer = $swiper.find('.swipe-pointer'),
		len = $swiper.find('.swipe-item').length,
		span = '';

	for (var i = 0; i < len; i++) {
		span += i ? '<span></span>' : '<span class="cur"></span>';
	}
	$pointer.html(span);
	var elem = document.getElementById('grouponItems');
	var swiper = Swipe(elem, {
		handleLoop: true,
		callback: function(index, ele) {
			$pointer.find('span').eq(index).addClass('cur').siblings().removeClass('cur');
		}
	});
})();

var Countdown = require('Lib/newTimer.js');
new Countdown(document.getElementById('timer'), {
	time: {
		end: '2017/5/1 23:59:59', //活动结束时间
	},
	render: function(date) {
		var html = '<span>--</span><em>:</em><span>--</span><em>:</em><span>--</span>';
		if (this.interval) {
			html = '<span class="appw t0">' + date.days + '</span>' + '天' +
				'<span class="appw t1">' + this.leadingZeros(date.hours) + '</span>' + "<em>:</em>" +
				'<span class="appw t2">' + this.leadingZeros(date.min) + '</span>' + "<em>:</em>" +
				'<span class="appw t3">' + this.leadingZeros(date.sec) + '</span>';
		};
		this.el.innerHTML = '还剩' + html + '结束';
	}
});

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

//页面数据
var oPage = {
	tab_index: 0, //tab的当前索引值
	tabs: [], //tab组
};

/**
 * 初始化oPage
 */
function initPageData() {
	$('.g-scrollbar-detail').find('li').each(function(index, el) {
		oPage.tabs.push({
			page: 1,
			isRender: false,
			cate_id: $(this).attr('_cate_id'),
			isEnd: false
		});
	});
	console.log(oPage)
}
initPageData();


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
						renderSecondList(data.data_list);
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
 * 渲染非首页的商品列表
 */
function renderSecondList(arr) {
	var interText = doT.template($("#gSecItemList").text());
	$('.g-secondlist').eq(oPage.tab_index).append(interText(arr));

	oPage.tabs[oPage.tab_index].isRender = true;
}


/**
 * 根据tab切换中的index设置当前的tab
 */
function getCurTab() { //此函数一定要在切换tab并给oPage的index赋值后执行
	var curTab = null;
	curTab = oPage.tabs[oPage.tab_index];
	return curTab;
}

/**
 * Events
 */
var toggletimer = null; //防止频繁切换导致数据渲染错误
$('#scrollbar').on('click', 'li', function() {
	var index = $(this).index();
	$(this).addClass('active').siblings('li').removeClass('active');
	$('.g-secondlist').eq(index).css('display', 'block').siblings('.g-secondlist').css('display', 'none');

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