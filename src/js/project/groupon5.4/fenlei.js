/**
 * rem脚本js
 * ----------------
 * 根据 /src/css/_config.scss 中的变量 $output 的值引入对应js
 *   $output: 640    ->   ./lib/rem640.js
 *   $output: 750    ->   ./lib/rem750.js
 */
require('./lib/rem750.js');

console.log('fenlei');

var sticky = require('./mods/sticky.js');

sticky.isSupport = function() {
	return false
}
console.log(sticky.isSupport());

//g-scrollbar-detail

sticky.polyfill($('.g-scrollbar'), '0');


//scroll bar
var IScroll = require('./lib/iscroll.js');
window.myScroll = new IScroll('#scrollbar', {
	fixedScrollBar: true,
	bindToWrapper: false,
	eventPassthrough: true,
	scrollX: true,
	scrollY: false,
	preventDefault: false,
	click: true
});

$('#scrollbar').on('click', 'li', function() {
	var index = $(this).index();
	$(this).addClass('active').siblings('li').removeClass('active')
});