function isIosApp(){
	return /iphone|ipad|ipod|ios/.test(UA);
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	let hour = parseInt(time / 3600)
	time = time % 3600
	let minute = parseInt(time / 60)
	time = time % 60
	let second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
let dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		let humanize = '';
		for (let key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		let date = this.parse(dateStr)
		let diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		let _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		let a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

// 对象转url参数
/**
 * @param {Object} obj数据
 * @param {Object} 第一个字符
 * @param {Object} key
 * @param {Object} encode
 */
function urlEncode(param, firstSymbol, key, encode) {
	if (param == null) return '';
	let paramStr = '';
	let t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (let i in param) {
			let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
			paramStr += urlEncode(param[i], '&', k, encode)
		}
	}

	firstSymbol = firstSymbol || '&';

	paramStr = firstSymbol + paramStr.substring(1, paramStr.length);
	return paramStr;
}

// url参数转对象
/**
 * @param {String} url url参数
 */
function urlParse(url) {
	let obj = {}
	let reg = /[?&][^?&]+=[^?&]+/g
	let arr = url.match(reg)
	// ['?id=12345','&a=b']
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substr(1).split('=')
			let key = decodeURIComponent(tempArr[0])
			let val = decodeURIComponent(tempArr[1])
			obj[key] = val
		})
	}
	return obj
}

/**
 * @description: 防抖函数：函数被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
 * @param {Function} fn 要执行的函数
 * @param {Number} delay  delay毫秒后执行回调
 */
function debounce(fn, delay = 500) {
	let timer = null;
	return function() {
		const context = this;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(context, arguments);
			timer = null;
		}, delay);
	};
}

/**
 * @description: 节流函数：规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行
 * @param {Function} fn 要执行的函数
 * @param {Number} gapTime  单位时间
 */
function throttle(fn, gapTime = 500) {
	let canUse = true;
	return function() {
		if (canUse) {
			fn.apply(this, arguments);
			canUse = false;
			setTimeout(() => (canUse = true), gapTime);
		}
	};
}

/**
 * null => ''
 * @param {*} data 要处理的数据
 */
function null2str(data) {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 ''
			data[x] = '';
		} else {
			if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
				data[x] = data[x].map(z => {
					return null2str(z);
				});
			}
			if (typeof(data[x]) === 'object') { // 是json 递归继续处理
				data[x] = null2str(data[x])
			}
		}
	}
	return data;
}

// 获取当前时间
function curDate(format = 'YYYY-MM-DD HH:mm:ss') {
	return this.$moment().format(format)
}

// 预览图片 多个图片用,分割 比如 'img1','img2'
function previewImage(url) {
	let imgArr = [];
	imgArr.push(url);
	uni.previewImage({
		urls: imgArr
	})
}
//下载文件及预览 （不支持 无用）
async function downloadFile(url) {
	// uni.showLoading({
	// 	title: '文件下载中...'
	// })
	let [err, res] = await uni.downloadFile({
		url: url
	});
	if (res.statusCode === 200) {
		console.log(res)
		let [error, result] = await uni.openDocument({
			filePath: res.tempFilePath
		});
	}
	if (err) {
		uni.showToast({
			title: '文件下载失败！',
			icon: 'none'
		})
	}
}

// 获取当前界面和完整参数
function getCurrentPageUrl() {
	let pages = getCurrentPages(); // 获取加载的页面
	let currentPage = pages[pages.length - 1]; // 获取当前页面的对象
	let url = currentPage.route; // 当前页面url
	return url;
}

// 获取当前页带参数的url
function getCurrentPageUrlAndArgs() {
	let pages = getCurrentPages(); //获取加载的页面
	let currentPage = pages[pages.length - 1]; //获取当前页面的对象
	let url = currentPage.route; //当前页面url
	let options = currentPage.options || currentPage.$route.query; //如果要获取url中所带的参数可以查看options

	//拼接url的参数
	let urlWithArgs = url + '?';

	for (let key in options) {
		let value = options[key];
		urlWithArgs += key + '=' + value + '&';
	}

	urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
	return urlWithArgs;
}

/**
 * @description: 记录百度事件 https://tongji.baidu.com/web/help/article?id=236&type=0
 * @param {eventName} 事件名称 比如打电话 关单
 * @param {eventRemark} 事件备注  比如 首页底部打电话按钮触发
 * @example this.$util.baiduEvent('客户搜索','首页顶部客户搜索');
 */
function baiduEvent(eventName, eventRemark = '') {
	let pageUrl = getCurrentPageUrl();
	let userInfo = getApp().globalData.userInfo;
	if (userInfo) {
		let remark = {
			eventRemark: eventRemark,
			marketerId: userInfo.marketerId,
			userName: userInfo.userName,
			storeId: userInfo.currentStoreId,
			storeName: userInfo.currentStoreName
		}
		// 测试门店和实施门店和体验门店不记录统计
		if (userInfo.currentStoreId != "STR00000042" &&
			userInfo.currentStoreId != "GZH093548500000085" &&
			userInfo.currentStoreId != "STR00000051")
			_hmt.push(['_trackEvent', remark.storeName, remark.userName, eventRemark, JSON.stringify(remark)]);
	}
}

/**
 * @description: 用于发送某个指定URL的PV统计请求  https://tongji.baidu.com/web/help/article?id=235&type=0
 * @param {pageUrl} 页面的URl
 * @example this.$util.baiduPageView();
 */
function baiduPageView(pageUrl) {
	let userInfo = getApp().globalData.userInfo;
	if (userInfo) {
		// 加上storeId
		pageUrl = `${pageUrl}?storeId=${userInfo.currentStoreId}`
		_hmt.push(['_setAutoPageview', false]);
		_hmt.push(['_trackPageview', pageUrl]);
	}
}

/**
 * 获取随机数
 * min: Number, 最小值
 * max: Number, 最大值
 * range: String, 圈定范围，默认左闭右闭,可传 '[]', '[)', '(]', '()'
 */
function getRandomNumberFrom(min, max, range = '[]') {
	let num = 0;
	switch (range) {
		case '[)':
			num = Math.floor(Math.random() * (max - min) + min);
			break;
		case '(]':
			num = Math.ceil(Math.random() * (max - min) + min);
			break;
		case '()':
			num = Math.round(Math.random() * (max - min - 2) + min + 1);
			break;
		default:
			num = Math.round(Math.random() * (max - min) + min);
	}
	return num;
}

/**
 * 生成随机姓名
 */
function getRandomName() {
	const familyNames = [
		"赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
		"褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
		"何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
		"陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
		"云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
		"昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
		"酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
		"倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
		"乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
		"元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
	];
	const givenNames = [
		"子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
		"昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
		"东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
		"美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
		"建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
		"涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
		"子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
		"佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
		"佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
		"清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
	];

	const familyName = familyNames[getRandomNumberFrom(0, familyNames.length - 1)];
	const givenName = givenNames[getRandomNumberFrom(0, givenNames.length - 1)];

	return familyName + givenName;
}

/**
 * 生成随机电话
 */
function getRandomMoble() {
	const prefixArray = ["130", "131", "132", "133", "135", "137", "138", "170", "187", "189"];
	const i = parseInt(10 * Math.random());
	let prefix = prefixArray[i];
	for (let j = 0; j < 8; j++) {
		prefix = prefix + Math.floor(Math.random() * 10);
	}
	return prefix;
}

/** 检查哪些属性发生变化时需要刷新 设用obj
 * @param {Object} newValue 
 * @param {Object} oldValue
 * @param {Object} checkFields 需要检查的属性 ['name','age']
 */
function isChgForWatch(newValue,oldValue,checkFields){
	// 第一次watch
	if(oldValue===undefined) return true;
	
	// 对比变化
	for(let i=0;i<checkFields.length;i++){
		if(oldValue[checkFields[i]]!=newValue[checkFields[i]]){
			return true;
		}
	}
	
	// 最终返回
	return false;
}

export default {
	formatTime,
	formatLocation,
	dateUtils,
	urlEncode,
	urlParse,
	debounce,
	throttle,
	null2str,
	curDate,
	previewImage,
	downloadFile,
	baiduEvent,
	baiduPageView,
	getRandomName,
	getRandomMoble,
	getRandomNumberFrom,
	isChgForWatch,
	isIosApp
}
