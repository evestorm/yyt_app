import Vue from 'vue'
import storage from '@/common/unistorage/index.js'

const PRESS_TIMEOUT = 1000
Vue.directive('focus', {
	inserted(el) {
		var input = el.querySelector('input');
		input.focus()
	  // el.focus()
	},
})

Vue.directive('longpress', {
	bind: function(el, binding, vNode) {
		// 确保提供的表达式是函数
		if (typeof binding.value !== 'function') {
			// 获取组件名称
			const compName = vNode.context.name;
			// 将警告传递给控制台
			let warn = `[longpress:] provided expression '${binding.expression}' is not afunction, but has to be `;
			if (compName) {
				warn += `Found in component '${compName}' `;
			}
			console.warn(warn);
		}
		var startX, startY, startTime;
		// 定义变量
		let pressTimer = null;
		// 定义函数处理程序
		// 创建计时器（ 1秒后执行函数 ）
		let start = (e) => {
			console.log(e.type);
			if (e.type === 'click' && e.button !== 0) {
				return;
			}
			// 记录下触发的坐标和时间
			startTime = (new Date()).getTime();
			
			startX = e.targetTouches[0].clientX;
			startY = e.targetTouches[0].clientY;
			// console.log(e.targetTouches);
			/**
			 *  注意：此处处理长按震动效果，经测试IOS目前不支持震动
			 **/
			if (pressTimer === null) {
				pressTimer = setTimeout(() => {
					navigator.vibrate = navigator.vibrate ||
						navigator.webkitVibrate ||
						navigator.mozVibrate ||
						navigator.msVibrate;

					if (navigator.vibrate) {
						// 支持
						navigator.vibrate(200);
					}
					// 执行函数
					handler();
				}, PRESS_TIMEOUT);
			}
		};
		// 取消计时器
		let cancel = (e) => {
			console.log(e.type);
			/**
			 *  注意：此处处理与click事件的冲突（小于300ms可以识别为点击事件的范围 然后判断触摸点的移动距离）
			 **/
			e.preventDefault();
			// debugger
			var now = (new Date()).getTime();
			if (now - startTime < 300) {
				var x = (Math.abs(startX - e.changedTouches[0].clientX) < 30);
				var y = (Math.abs(startY - e.changedTouches[0].clientY) < 30);
				if (x && y) {
					e.changedTouches[0].target.click();
				}
			}
			// console.log(e.changedTouches);
			// 检查计时器是否有值
			if (pressTimer !== null) {
				clearTimeout(pressTimer);
				pressTimer = null;
			}
		};
		// 运行函数
		const handler = (e) => {
			// 执行传递给指令的方法
			binding.value(e);
		};
		/**
		 *  注意：禁止浏览器长按出菜单
		 **/
		document.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};
		
		const log = (e) => {
			console.log(e.type);
		}
		// ['']
		// // 添加事件监听器
		// el.addEventListener('mousedown', start);
		// el.addEventListener('touchstart', start);
		// // 取消计时器
		// el.addEventListener('mouseout', cancel);
		// el.addEventListener('touchend', cancel);
		// el.addEventListener('touchcancel', cancel);

		;
		['mousedown', 'touchstart'].forEach(e => el.addEventListener(e, start));
		['mouseout', 'touchend', 'touchcancel'].forEach(e => el.addEventListener(e, cancel));
		// alt+tab可以触发 touchcancel事件
		// ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'click'].forEach(e => el.addEventListener(e, log));
	}
});
