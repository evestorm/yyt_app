import Session from '@/service/Session/SessionAppService.js'
import CY18 from '@/service/CY/CY18AppService.js'
import CY19 from '@/service/CY/CY19AppService.js'
import CY20 from '@/service/CY/CY20AppService.js'
import CY57 from '@/service/CY/CY57AppService.js'
import CY61 from '@/service/CY/CY61AppService.js'
import CY63 from '@/service/CY/CY63AppService.js'
import CY65 from '@/service/CY/CY65AppService.js'
import CY67 from '@/service/CY/CY67AppService.js'
import UR01 from '@/service/UR/UR01AppService.js'
import storage from '@/common/unistorage/index.js'
import moment from '@/lib/moment/moment.min.js'
import _ from '@/lib/lodash/lodash.js'
import util from '@/common/util.js';
import create from '@/common/create.js';
import yytPopupCenter from '@/components/yyt-popup-center/yyt-popup-center';
export default {
	removeAaary: function(_arr, _obj) {
		var length = _arr.length
		for (var i = 0; i < length; i++) {
			if (_arr[i] == _obj) {
				if (i == 0) {
					_arr.shift() //删除并返回数组的第一个元素
					return _arr
				} else if (i == length - 1) {
					_arr.pop() //删除并返回数组的最后一个元素
					return _arr
				} else {
					_arr.splice(i, 1) //删除下标为i的元素
					return _arr
				}
			}
		}
	},
	getQueryString: function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
		var r = window.location.search.substr(1).match(reg)
		if (r != null) return decodeURI(r[2])
		return null
	},
	weixinIntType: 0, // 正式版:0，测试版:1，体验版:2
	ImgServerUrl: 'https://pic.cwyyt.cn',
	gotoIndex: function() {
		var herf = '/Phone'
		window.location.href = herf
	},
	async logout() {
		// 删除本地storage信息
		storage.removeAppUserInfo();
		storage.removeSalesAuthority();
		storage.removeStoreAuthority();
		storage.removeMsgMould();
		getApp().globalData.isGetAll = 0;
		getApp().globalData.homePageData.isLoad = false;
		getApp().globalData.isLogin = false;
		storage.setAgreeFile(true);
		let res = await Session.ClearCurrentAppUserSessionAsync({});
		this.deleteSiteStorage()
		uni.reLaunch({
			url: '/pages/homePageSub/login/login',
		});
		// 如果是iOS，退出登录后删除当前用户的极光注册的alias别名
		if (this.isiOS()) {
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'deleteLoginUser',
			});
		}
	},
	isiOS() {
		return typeof iOS != 'undefined'
	},
	isAndroid() {
		return typeof YYT != 'undefined'
	},
	// 判断是否是app
	isApp(isShow) {
		var isShow = isShow === false ? false : true
		if (this.isAndroid()) {
			return true
		} else if (this.isiOS()) {
			return true
		} else {
			if (isShow) {
				uni.showToast({
					title: '该功能需在安卓云于天APP上使用',
					duration: 2000,
					icon: 'none',
				})
			}
			return false
		}
	},
	/**
	 * 获取App版本号
	 */
	getVersion() {
		if (this.isAndroid()) {
			return YYT.GetVersion()
		} else if (this.isiOS()) {
			return iOS.getAppInfo.version
		}
	},
	/**
	 * @description 是否能获取联系人，iOS下如果不能则跳转授权页
	 * @param {Object} cb 回调 返回Bool值：能还是不能
	 * @param {Boolean} 是否重定向到授权页
	 */
	canGetAddressBook(cb, redirectTo = true) {
		if (this.isAndroid()) {
			cb && cb(true)
		} else if (this.isiOS()) {
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'canGetAddressBook',
			});
			window['canGetAddressBook'] = (auth) => {
				let res = Boolean(auth)
				if (res) {
					getApp().globalData.commonPageData.isIOSAddressAuth = res //有权限=>跟新权限
					cb && cb(res)
				} else {
					if (redirectTo) {
						// 获取当前页面的URL和url完整路径
						let fullPath = this.getCurrentPageUrlAndArgs()
						let redirectUrl = encodeURIComponent('/' + fullPath)
						uni.redirectTo({
							url: `/pages/_common/contactsReqAuthPage/contactsReqAuthPage?redirectUrl=${redirectUrl}`,
						})
					}
				}
			}
		}
	},

	/**
	 * @description 请求获取联系人的权限
	 * @param {Object} cb 回调 返回Bool值：用户选择了允许还是不允许
	 */
	reqAddressBookAuth(cb) {
		window.webkit.messageHandlers.iOS.postMessage({
			method: 'reqAddressBookAuth',
		})
		window['reqAddressBookAuth'] = (auth) => {
			cb && cb(Boolean(auth))
		}
	},
	/**
	 * @description 清除iOS角标
	 */
	cleanBadge() {
		if (this.isiOS()) {
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'cleanBadge',
			});
		}
	},
	// 获取联系人
	/**
	 * @param {Object} cb 回调函数
	 * @return 字符串
	 * @e.g. {"555-610-6679":"TaylorDavid","555-522-8243":"HaroAnna","(415) 555-3695":"BellKate","(408) 555-3514":"HigginsDaniel","(707) 555-1854":"ZakroffHank","888-555-1212":"AppleseedJohn"}
	 */
	getContacts(cb) {
		if (this.isAndroid()) {
			cb && cb(JSON.parse(YYT.GetConnect()))
		} else if (this.isiOS()) {
			// 调用iOS下的getContacts方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'getContacts',
			})
			window['getContacts'] = (msg) => {
				cb && cb(JSON.parse(msg))
			}
		}
	},
	/**
	 * @description 打电话（安卓打电话发短信能调原生方法，不用前端做；iOS拿不到通话记录和短信，所以前端要调CreateByDto接口）
	 * @param {String} phone 电话string
	 */
	callPhone(phone,isNotFollow=0, cb) {
		if (this.isAndroid()) {
			YYT.CallPhone(phone);
			//更新globalData
			getApp().globalData.phoneCallData.phone=phone;
			getApp().globalData.phoneCallData.isNotFollow=isNotFollow;
			getApp().globalData.phoneCallData.beginTime=moment().format('YYYY-MM-DD HH:mm:ss');
			// this.followChange(phone,...cb);//注释
		} else if (this.isiOS()) {
			// 调用iOS下的callPhone方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'callPhone',
				params: {
					phone,
				},
			})
			window['callPhone'] = (time) => {
				let seconds = Number(time)
				let userInfo = storage.getAppUserInfo()
				let data = {
					customerId: '',
					storeId: userInfo.currentStoreId,
					cWCompanyId: userInfo.userCWCompanyID,
					marketerId: userInfo.marketerId,
					callType: 2, // 1-呼入，2-呼出，3-短信 4-电话未接通 5-微信发送 6-收到短信
					phone: phone,
					beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					endTime: moment().add(seconds || 0, 's').format('YYYY-MM-DD HH:mm:ss'), // 5s后
					talkTime: seconds || 0,
					isNotFollow:isNotFollow,
				}
				// 添加通讯记录
				CY57.CreateByDto(data)
				cb && cb();
				// this.followChange(phone,result.id,cb) //主动跟踪
			}
		}
	},
	/**
	 * 上传通话记录
	 */
	uploadCall() {
		if (this.isAndroid()) {
			YYT.UploadCall()
		} else if (this.isiOS()) {
			// iOS无法获取手机通话记录
		}
	},
	/**
	 * 获取通话记录
	 */
	getPhoneCallResult(time) {
		if (this.isAndroid()) {
			let res = YYT.GetPhoneCallResult(time);
			return res;
		} else if (this.isiOS()) {
			// iOS无法获取手机通话记录
		}
	},
	/**
	 * @param {String} name 姓名
	 * @param {String} phone 电话
	 * @param {Function} cb 回调
	 */
	insertPhone(name, phone, cb) {
		if (this.isAndroid()) {
			// 成功返回 “success”
			let res = YYT.InsertPhone(name, phone)
			cb && cb(res)
		} else if (this.isiOS()) {
			// 调用iOS下的insertPhone方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'insertPhone',
				params: {
					name,
					phone,
				},
			})
			// 成功返回 “success”
			window['insertPhone'] = (res) => {
				cb && cb(res)
			}
		}
	},
	/**
	 * @description 保存图片到手机
	 * @param {Object} urlStr 图片url地址
	 */
	savePhoto(urlStr) {
		if (this.isAndroid()) {
			YYT.SavePhoto(urlStr)
		} else if (this.isiOS()) {
			// 调用iOS下的insertPhone方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'savePhoto',
				params: {
					urlStr,
				},
			})
		}
	},
	/**
	 * @description iOS发送短信
	 * @param {Object} customer 客户信息
	 * 		@param {String} phone 电话
	 * 		@param {String} message 短信内容
	 * @param {Function} cb 回调
	 */
	sentSMS(customer, isNotFollow,cb) {
		let {
			phone,
			realContent: message
		} = customer
		// let userInfo = storage.getAppUserInfo()
		if (this.isiOS()) {
			// let { phone, content: message } = customer;
			// 调用iOS下的insertPhone方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'sentSMS',
				params: {
					phone,
					message,
				},
			})
			// 成功返回 “success”
			window['sentSMS'] = (res) => {
				if (res == 'success') {
					this.sendMsgSuc(customer,isNotFollow);
				}
				cb && cb(res)
			}
		} else {
			/* //安卓取消静默发送，更改为手动发送
			YYT.SendSMS(String phoneNumber, String message)
			弹出发送短信页面，注意不是直接发送 */
			/* 
			 1 发送 调用发送接口
			 2 网页弹窗 获取短信发送结果中... 有个按钮 我已取消发送  点击取消发送  关闭弹窗 2秒后关闭定时器 
			 3 构造timer 每隔2秒  调用获取发送内容接口 
			 成功后 关闭弹窗 弹出发送成功信息  走后续逻辑
			 最多15次 超时 关闭弹窗 清空定时器 弹出 获取短信发送结果失败
			 */
			YYT.SendSMS(phone, message);
			let n=0;				
			let res='';
			let confirmPopup;
			let msgTime=setInterval(()=>{
				n++;
				if(n<=8){
					res=YYT.getSendSMSResult(phone);
					if (res == 'success') {
						clearInterval(msgTime); //清除定时器
						confirmPopup.close();
						this.sendMsgSuc(customer,isNotFollow);
						cb && cb(res);
					}
				}else{//超过15秒 定为发送失败
					res='fail';
					clearInterval(msgTime) //清除定时器
					confirmPopup.close();
					cb && cb(res);
				}
			},2000)
			
			confirmPopup =create(yytPopupCenter, {//由于安卓无法获取用户点击取消操作，需要手动调用一个弹出框，由用户自己去手动选择已取消
				title: "提示",
				desc: "获取短信发送结果中...",
				cancelText:'我已取消',
				confirmText:'我已发送',
				isShowErrImg:false,
				success:() => {//客户选择成功 就默认是发送成功的  不用管是否发送
					setTimeout(()=>{
						clearInterval(msgTime); //清除定时器
						res='success';
						this.sendMsgSuc(customer,isNotFollow)
						cb && cb(res);
					},2000)
				}, //点击发送
				cancel: () => { //点击取消
					setTimeout(()=>{
						clearInterval(msgTime); //清除定时器
						res= res=='success' ? 'success' : 'fail';
						cb && cb(res);
					},2000)
				}
			});
			confirmPopup.open();
			// 静默群发短信(暂时注释)
			/* // 开始发送短信任务
			YYT.BeginSendSSMS()
			// 发送短信YYT.SendSSMS()
			YYT.SendSSMS(phone, message)
			// 每1s获取发送短信结果:YYT.GetSendResult() 每个短信有3秒的反应时间
			// 0发送中，1已发送，其他2-5：发送失败
			let tiem = 0
			let msgTime = setInterval(() => {
				try {
					tiem++
					let str1 = YYT.GetSendResult();
					let str = JSON.parse(str1);
					if (str[phone] != 0 || tiem > 5) {
						clearInterval(msgTime) //清除定时器
						// 结束发送短信任务
						YYT.EndSendSSms()
						YYT.UploadCall()
						//向后台发送成功的电话列表 sucCustomerId MassTextAddFollow
						if (str[phone] == 1) {
							let textFollowData = {
								cWCompanyId: userInfo.userCWCompanyID, //企业ID.
								storeId: userInfo.currentStoreId, //门店.
								customer: [{
									customerId: customer.customerID,
									phone: phone,
									customSaveName: customer.customerName || customer.customSaveName,
								}, ], //用户
								marketerId: userInfo.marketerId, //客户经理id
							}
							//群发调用的通话记录
							CY61.MassTextAddFollow(
								textFollowData,
								(res) => {
									console.log('发送跟踪结果' + res)
								},
								null,
								false
							)
							this.followChange(phone) //主动跟踪
						} else {
							str[phone] = 2
						}
						let isAndroidRes = str[phone] == 1 ? 'success' : str[phone] > 1 ? 'fail' : '';
						console.log(isAndroidRes)
						cb && cb(isAndroidRes)
					}
				} catch (err) {
					console.log(err)
				}
			}, 1000) */
		}
		//主动跟踪
	},
	// 短信发送成功后请求cy57
	sendMsgSuc(customer,isNotFollow){
		let userInfo = storage.getAppUserInfo();
		let data = {
			customerId: customer.customerID,
			storeId: userInfo.currentStoreId,
			cWCompanyId: userInfo.userCWCompanyID,
			marketerId: userInfo.marketerId,
			callType: 3, // 1-呼入，2-呼出，3-短信 4-电话未接通 5-微信发送 6-收到短信
			phone: customer.phone,
			beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
			endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
			msgContent: customer.content, // 消息内容
			isNotFollow:isNotFollow,//是否跟踪
		}
		// 添加通讯记录（单发添加通讯记录）
		CY57.CreateByDto(data);
			// this.followChange(customer.phone,result.id) //主动跟踪
	},
	/**
	 * @description 发送给微信好友文字
	 * @param {String} message 消息内容
	 * @param {String} phone 电话号码
	 * @param {String} customerID 客户id
	 * @param {String} isShow 控制是否他拿出需要在app使用提示
	 */
	sendWeixinText(message, phone, customerID, isNotFollow=0,isShow = true) {
		if (this.isApp(isShow)) {
			if (this.isAndroid()) {
				YYT.SendWeixinText(message, phone)
			} else if (this.isiOS()) {
				// 调用iOS下的sendWXTextMessage方法
				window.webkit.messageHandlers.iOS.postMessage({
					method: 'sendWXTextMessage',
					params: {
						message,
						phone,
					},
				})
			}
			// android 和 ios 发送微信后都得上传记录
			let userInfo = storage.getAppUserInfo()
			// 添加分享记录
			let data = {
				customerId: customerID,
				storeId: userInfo.currentStoreId,
				cWCompanyId: userInfo.userCWCompanyID,
				marketerId: userInfo.marketerId,
				callType: 5, // 1-呼入，2-呼出，3-短信 4-电话未接通 5-微信发送 6-收到短信
				phone: phone,
				beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				msgContent: message, // 消息内容
				isNotFollow:isNotFollow
			}
			// 添加通讯记录
			CY57.CreateByDto(data,result=>{
				// this.followChange(phone,result.id) //主动跟踪
				// uni.$emit('refreshCustomFollow'); //跟新跟踪列表
			})
		}
	},
	/**
	 * @description 发送给微信好友图片
	 * @param {String} imageUrl 图片地址
	 * @param {String} isShow 控制是否他拿出需要在app使用提示
	 */
	sendWXImageMessage(imageUrl, isShow = true) {
		if (this.isApp(isShow)) {
			if (this.isAndroid()) {
				YYT.sendWeixinPic(imageUrl)
			} else if (this.isiOS()) {
				// 调用iOS下的sendWXTextMessage方法
				window.webkit.messageHandlers.iOS.postMessage({
					method: 'sendWXImageMessage',
					params: {
						imageUrl,
					},
				})
			}
		}
	},
	// 调用微信接口，向微信好友发送小程序。ptype:正式版:0，测试版:1，体验版:2,isshow 控制是否他拿出需要在app使用提示
	sendMiniPrograme(
		webpageurl,
		pagePath,
		title,
		desc,
		imageUrl,
		ptype,
		isShow = true
	) {
		if (this.isApp(isShow)) {
			if (this.isAndroid()) {
				YYT.SendMiniPrograme(webpageurl, pagePath, title, desc, imageUrl, ptype)
			} else if (this.isiOS()) {
				// 调用iOS下的sendWXMiniProgramMessage方法
				window.webkit.messageHandlers.iOS.postMessage({
					method: 'sendWXMiniProgramMessage',
					params: {
						webpageurl,
						pagePath,
						title,
						desc,
						imageUrl,
						ptype,
					},
				})
			}
		}
	},
	// 获取授权
	RequestPermissions() {
		if (this.isAndroid()) {
			YYT.RequestPermissions()
		} else if (this.isiOS()) {
			// 不作处理，页面启动会自动请求所需用户授权
		}
	},
	setLoginUser(userId) {
		if (this.isAndroid()) {
			YYT.SetLoginUser(userId)
		} else if (this.isiOS()) {
			// 调用iOS下的setLoginUser方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'setLoginUser',
				params: {
					id: userId,
				},
			})
		}
	},
	checkPhone(tel) {
		var TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
		if (TEL_REGEXP.test(tel)) {
			return true
		}
		return false
	},
	getHandleInfo: function() {
		var chooseHandleData = [{
				value: '0',
				text: '发送微信评价',
			},

			{
				value: '1',
				text: '发送微信邀请函',
			},
			{
				value: '2',
				text: '延迟五天提醒',
			},
			{
				value: '3',
				text: '当月不在提醒',
			},
			{
				value: '4',
				text: '更改客户经理',
			},
			{
				value: '5',
				text: '移除客户池',
			},
			{
				value: '6',
				text: '修改预订单',
			},
			{
				value: '7',
				text: '取消预订单',
			},
		]
		return chooseHandleData
	},
	async updatefixedSales(data, success, removeRecordData) {
		var self = this
		let result = await CY19.CreateOrUpdateByDto(data)
		success(result)
		// 添加客户池变更记录
		await CY65.CreateByDto(removeRecordData)
	},
	//延迟五天提醒
	async delayFiveDaysRemind(data, success) {
		let result = await CY61.UpdateByDto(data)
		success(result)
	},
	//当月不在提醒
	async currentMonthNoRemind(data) {
		let result = await CY61.UpdateByDto(data)
		return result;
	},
	//发送微信邀请函
	async sendWeiXinInvite(data, success) {
		let result = await CY67.GetSmsTemplateListDetails(data)
		success(result)
	},
	//发送短信内容模板
	async sendMessage(data, success) {
		let result = await CY67.GetSmsTemplateListDetails(data)
		success(result)
	},
	//获取取消预订单
	async cancelReason(data, success) {
		let res = await CY63.GetViewPage(data)
		success(result)
	},
	//cy61 修改操作改为后端更改，暂时注释
	async followChange(phone,callRecordId, cb) {
		// 从跟踪列表进入时，自动上报跟踪   //跟踪id和跟踪记录电话相同才请求 主动跟踪接口
		console.log(
			'主动跟踪',
			getApp().globalData.customerPageData.isFollowGo,
			getApp().globalData.customerPageData.fllowData.phone,
			getApp().globalData.customerPageData.fllowData.customerFollowID
		)
		if (
			getApp().globalData.customerPageData.isFollowGo &&
			getApp().globalData.customerPageData.fllowData.phone == phone &&
			getApp().globalData.customerPageData.fllowData.customerFollowID
		) {
			let data = {
				id: getApp().globalData.customerPageData.fllowData.customerFollowID,
				callRecordId:callRecordId||'',//获取的cy57的id
				followState: 1,
			}
			await CY61.UpdateByDto(data, null, null, false)
			cb && cb()
		}
	},
	// 首页切换 [我的][全店]
	homeType: [{
			name: '我的',
			value: 0,
		},
		{
			name: '全店',
			value: 1,
		},
	],
	// 确认取消订单
	async confirmCancelReason(data, success) {
		let result = await CY20.UpdateByDto(data)
		success(result)
	},
	// 全部关单
	async allPass(data, success) {
		let result = await CY20.BatchCloseOrder(data)
		success(result)
	},
	// 单个审核关单
	async singlePass(data, success) {
		let result = await CY20.BatchCloseOrderByIds(data)
		success(result)
	},
	// 添加遮罩
	addBackdrop: function() {
		backdrop.show() //显示遮罩
	},
	// 取消遮罩
	cancelBackdrop: function() {
		backdrop.close() //关闭遮罩
	},
	goBack: function() {
		uni.navigateBack({
			delta: 1,
		})
	},
	deepCopy: function(data) {
		return JSON.parse(JSON.stringify(data))
	},
	dialog: function(content, success, cancel, singleBtn, title) {
		var btnArray = ['确定', '取消']
		if (singleBtn) {
			var btnArray = ['确定']
		}
		mui.confirm(content, title || '', btnArray, function(e) {
			if (e.index == 0) {
				success()
			} else if (e.index == 1) {
				if (cancel) {
					cancel()
				}
			}
		})
	},
	//切换上一个客户经理
	getPreSales: function(MarketData, CustomFollowData) {
		var MarketData = MarketData
		var index = 0
		var currentMarketerId =
			CustomFollowData.marketerId ||
			CustomFollowData.marketerId ||
			CustomFollowData.marketId
		if (currentMarketerId) {
			index = _.findIndex(MarketData, function(item) {
				return item.value == currentMarketerId
			})
			index = index - 1 < 0 ? MarketData.length - 1 : index - 1
		} else {
			index = 0
			CustomFollowData.searchType = 1
			CustomFollowData.bookRange = 1
		}
		var CurrentSalesInfo = MarketData[index]
		return CurrentSalesInfo
	},
	////切换下一个客户经理
	getNextSales: function(MarketData, CustomFollowData) {
		var MarketData = MarketData
		var index = 0
		var currentMarketerId =
			CustomFollowData.marketerId ||
			CustomFollowData.marketerId ||
			CustomFollowData.marketId
		if (currentMarketerId) {
			index = _.findIndex(MarketData, function(item) {
				// console.log(item.value, currentMarketerId);
				return item.value == currentMarketerId
			})
			index = index + 1 > MarketData.length - 1 ? 0 : index + 1
		} else {
			index = MarketData.length - 1
			CustomFollowData.searchType = 1
			CustomFollowData.bookRange = 1
		}
		var CurrentSalesInfo = MarketData[index]
		return CurrentSalesInfo
	},
	chooseMonthDate: function(newDate) {
		var options = {
			type: 'month',
		}
		var dtPicker = new mui.DtPicker(options)
		dtPicker.show(function(selectItems) {
			var chooseDate = selectItems.y.value + '-' + selectItems.m.value
			newDate = chooseDate
		})
	},
	deleteSiteStorage: function() {
		// 删除站点的storage
		storage.removeAppUserId();
		storage.removeAppUserInfo();
		storage.removeToken();
	},
	currentCustomerItem: null, // 用于点击进入客户详情保持的点击的Item
	currentAddCustomer: null, // 用于点击进入新增客户的Item
	currentCustomerPoolItem: null, // 用于点击进入客户池的Item
	// 重构新增

	// 格式化时间
	pikerGetDate: function(type) {
		const date = new Date()

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		if (type === 'start') {
			year = year - 100
		} else if (type === 'end') {
			year = year + 2
		}
		month = month > 9 ? month : '0' + month
		day = day > 9 ? day : '0' + day

		return `${year}-${month}-${day}`
	},
	// 提示信息
	showMsg(msg, time = 3000) {
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: time,
		})
	},
	// 错误提示弹框
	showError(msg, duration = 3000) {
		uni.showToast({
			title: msg,
			duration: duration,
			mask: false,
			icon: 'none',
			image: '/static/toast/deletePic.png',
		})
	},
	// 返回.net云于天首页时调用
	// delta: 当前uniapp的页面栈个数（https://uniapp.dcloud.io/collocation/frame/window?id=getcurrentpages）
	backToHome(delta) {
		if (parent.document.getElementById('AppMain') !== null) {
			window.parent.document.getElementById('AppMain').style.display = 'block'
			window.parent.document.getElementById('mainFrame').style.display = 'none'
			// 当前有多少个uniapp页面栈实例，就返回多少次历史记录条数
			window.history.go(-delta)
		} else {
			console.log(
				'请回到首页刷新后再进今日预订，目前暂不考虑进入今日预订后刷新页面右上角返回的情况'
			)
		}
	},
	// 封装去客户详情页
	gotoCustomInfo(customerId, followPage) {
		const url = `/pages/_common/customInfo/customInfo?customerId=${customerId}&followPage=${followPage}`
		uni.navigateTo({
			url,
		})
	},
	// 获取客户经理列表
	async getViewcy18Page() {
		let result = (
			await CY18.GetStoreManager({
				StoreID: storage.getAppUserInfo().currentStoreId,
			})
		).result

		var allMarketData = result.dataList
		var marketDatas = []
		var allMarketDatas = []
		allMarketData.forEach((item, index) => {
			var obj = {
				value: item.marketerID,
				text: item.marketerName,
				salseImg: item.imgUrl ?
				this.ImgServerUrl + '/' + item.imgUrl : 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png',
			}
			marketDatas.push(obj);
			if (item.customerPoolCount > 0) {
				var obj2 = {
					value: item.marketerID,
					text: item.marketerName + `(${item.customerPoolCount})`,
				}
				allMarketDatas.push(obj2)
			}
		})
		// 存进localstorage(不需要存vuex,每次监听到 appuserinfo.currentStoreId 就调一次)
		storage.setChooseMarketData(marketDatas)
		storage.setAllChooseMarketData(allMarketDatas)
	},
	/**
	 * @description tabBar跳转传参
	 * @param {String} url 跳转链接 e.g. '/pages/customer/customer'
	 * @param {Object} payload 参数对象 e.g. {tabIndex: 0}
	 */
	setSwitchTo(config) {
		let {
			url,
			payload
		} = config
		// 把数据缓存到storage
		storage.setTabBarPayload(payload)
		uni.switchTab({
			url,
		})
	},
	/**
	 * @description 计算消费跟踪的联系方式是什么
	 * @param {Number} callType 后端数字类型
	 */
	calcCallMode(callType) {
		let callMode = ''
		switch (callType) {
			case 1: // 呼入
				callMode = '呼入'
				break
			case 2: // 呼出
				callMode = '呼出'
				break
			case 3: // 短信
				callMode = '短信'
				break
			case 4: // 电话未接通
				callMode = ''
				break
			case 5: // 微信发送
				callMode = '微信发送'
				break
			case 6: // 收到短信
				callMode = '短信'
				break
			default:
				break
		}
		return callMode
	},
	// 把字段为null的转为空字符串
	emptyToString(field) {
		return _.isNil(field) ? '' : field
	},
	/**
	 * @description 是否显示提示
	 * @param {Object} item 当前提示项
	 * @param {Object} permission 该项执行权限
	 */
	isShowTaskTip(item, permission) {
		return permission && !item
	},

	// 获取当前页带参数的url
	getCurrentPageUrlAndArgs() {
		let pages = getCurrentPages() //获取加载的页面
		let currentPage = pages[pages.length - 1] //获取当前页面的对象
		let url = currentPage.route //当前页面url
		let options = currentPage.options || currentPage.$route.query //如果要获取url中所带的参数可以查看options
		//拼接url的参数
		let urlWithArgs = url + '?'

		for (let key in options) {
			let value = options[key]
			urlWithArgs += key + '=' + value + '&'
		}

		urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
		return urlWithArgs
	},
	getRecordsData(isGetIOsAuth = false) {
		//获取通讯录信息 isGetIOsAuth:是否跳转获取ios通讯录权限页面
		// 获取联系人--globalData没有联系人的时候再获取赋值
		if (JSON.stringify(getApp().globalData.recordsData) == '{}') {
			if (this.isApp(false)) {
				if (this.isiOS()) {
					this.canGetAddressBook((auth) => {
						//app 有权限 赋值
						if (auth) {
							this.getContacts((data) => {
								getApp().globalData.recordsData = data
							})
						}
					}, isGetIOsAuth)
				} else {
					getApp().globalData.recordsData = JSON.parse(YYT.GetConnect())
				}
			}
		}
	},
	// --------------------- 宴会、客户列表、客户跟踪 权限控制 --------------------------
	canSeeAllDetail() { //是否可以查看预月统计详情
		let auth = storage.getSalesAuthority();
		return !!auth.isCanSeeAllDetail;
	},
	canSeeCustomerList() { // 是否有查看客户列表板块的权限
		// 默认可以查看编辑自己的客户，批量打标签
		let auth = storage.getSalesAuthority();
		return !!auth.isShowCstList;
	},
	canSeeAllCustomer() { // 客户列表查看所有
		// 查看所有的客户，支持批量打标签
		let auth = storage.getSalesAuthority();
		return !!auth.isSeeCstAll;
	},
	canEditAllCustomer() { // 客户列表编辑所有
		// 编辑所有的客户，包括基本信息、客户经理、标签，客户详情里面
		let auth = storage.getSalesAuthority();
		return !!auth.isCanEditCstAll;
	},
	canBatchChangeCS() { // 批量更换客户经理
		let auth = storage.getSalesAuthority();
		return !!auth.isAdjustMarket;
	},
	groupSentMessage() { // 群发短信
		// 按钮显示和信息页面能不能选多个人
		let auth = storage.getSalesAuthority();
		return !!auth.isCanBatchSendMsg;
	},
	canRefreshTrackOpportunities() { // 刷新跟踪机会
		let auth = storage.getSalesAuthority();
		return !!auth.isRefreshTrace;
	},
	canSeeLabelManagement() { // 查看标签管理
		// 只能查看，刷新
		let auth = storage.getSalesAuthority();
		return !!auth.isSeeTagManage;
	},
	canEditLabelManagement() { // 编辑标签管理器
		// 支持编辑删除操作
		let auth = storage.getSalesAuthority();
		return !!auth.isCanTagManageEdit;
	},
	canSeeTrack() { // 是否有查看客户跟踪
		let auth = storage.getSalesAuthority();
		return !!auth.isCustomerTrack;
	},
	canSeeAllTrack() { // 客户跟踪查看所有
		let auth = storage.getSalesAuthority();
		return !!auth.isCanSeeCstTrackAll;
	},
	canEditAllBanquet() { // 可操作所有
		// 所有的宴会单都能操作
		// 客户经理和统筹人可以操作属于他自己宴会的所有操作
		let auth = storage.getSalesAuthority();
		return !!auth.isYHBanquetOrderAdmin;
	},
	canSeeMiningYHClue() { // 挖掘宴会线索
		let auth = storage.getSalesAuthority();
		return !!auth.isCanSeeMiningYHClue;
	},
	canSeeYHClueAll() { // 宴会线索查看所有
		let auth = storage.getSalesAuthority();
		return !!auth.isCanSeeYHClueAll;
	},
	canSeeYHClue() { // 宴会线索查看权限
		let auth = storage.getSalesAuthority();
		return !!auth.isShowYHClue;
	},
	canSeeYHBanquetOrder() { // 宴会订单查看权限
		let auth = storage.getSalesAuthority();
		return !!auth.isShowYHBanquetOrder;
	},
	canSeeMarketingCenter() { // 营销中心查看权限
		let auth = storage.getSalesAuthority();
		return !!auth.isShowMarketingCenter;
	},
	todayScheduled() { //是否有预订查看权限
		let auth = storage.getSalesAuthority();
		return !!auth.isTodayScheduled;
	},
	canEdit() { //是否可编辑自己的预订单，默认只能编辑单位、预订类型、备注字段，不能取消
		let auth = storage.getSalesAuthority();
		return !!auth.isCanEdit;
	},
	canEditCancelOfOther() { //是否可编辑/取消别人的预订单
		let auth = storage.getSalesAuthority();
		return !!auth.isCanEditCancelOfOther;
	},
	isFinance() { //是否可以关单 （财务权限）
		let auth = storage.getSalesAuthority();
		return !!(auth.isFinance || auth.isCanClose);
	},
	canOperLockedTable() { //是否可以锁台
		let auth = storage.getSalesAuthority();
		return !!auth.isCanOperLockedTable;
	},
	// --------------------- 门店权限控制 --------------------------
	approveInAppBook() { //该门店的订单是否需要审核(审核订单默认不发送信息)
		let auth = storage.getStoreAuthority();
		return !!auth.isApproveInAppBook;
	},
	// ---------------------- 极光推送 ---------------------
	// 注册极光推送的跳转事件
	injectNativeNavigateTo() {
		let that = this;
		// 注册极光推送跳转
		window['nativeNavigateTo'] = (pageUrl, params) => {
			let payload = util.urlParse(pageUrl); // url?后面的传参
			let p = JSON.parse(params);
			if (p.store) { // 如果需要切换门店
				uni.switchTab({
					url: '/pages/homePage/homePage',
					success: function() {
						uni.$emit('change-store', {
							storeId: p.store.storeId,
							branchName: p.store.branchName,
							cb: function() {
								if (pageUrl.includes('/banquet/banquet') ||
									pageUrl.includes('/customer/customer') ||
									pageUrl.includes('/reserve/reserve') ||
									pageUrl.includes('/my/my')) {
									that.setSwitchTo({
										url: pageUrl,
										payload,
									});
								} else {
									let url = pageUrl;
									uni.navigateTo({
										url,
									});
								}
							}
						});
					}
				});
			} else { // 不需要切换门店
				//tabbar级别的页面跳转，需要用switchTo方法跳转
				if (pageUrl.includes('/banquet/banquet') ||
					pageUrl.includes('/customer/customer') ||
					pageUrl.includes('/reserve/reserve') ||
					pageUrl.includes('/my/my')) {
					this.setSwitchTo({
						url: pageUrl,
						payload,
					});
				} else { // 其他情况
					// let param = util.urlEncode(obj).substring(1);
					// let url = pageUrl + '?' + param;
					uni.navigateTo({
						url: pageUrl
					});
				}
			}
		}
	},
	// 上传JPushId
	uploadJPushID() {
		window['uploadJPushID'] = (jpushId) => {
			jpushId = String(jpushId);
			// 保存到 globalData
			getApp().globalData.regId = jpushId;
			let userGUID = storage.getAppUserInfo().userGUID;
			if (userGUID) { // 有userInfo才传，否则在登录的时候传
				let rid = storage.getJPushRId();
				if (!rid) { // 没有就保存
					storage.setJPushRId(jpushId);
					let data = {
						userGUID,
						regId: jpushId
					}
					UR01.SetJGRegId(data);
				} else if (rid !== jpushId) { // 和本地不一样就替换
					storage.setJPushRId(jpushId);
					let data = {
						userGUID,
						regId: jpushId
					}
					UR01.SetJGRegId(data);
				} else { // 一样就不管

				}
			}
		}
	},
	// 注册全局JS方法
	initGlobalMethods() {
		// 注册极光推送的跳转事件
		this.injectNativeNavigateTo();
		this.uploadJPushID();
	},
	/**
	 * @description 调扫码器
	 * @param {Function} cb 回调
	 */
	popupScanner(cb) {
		if (this.isiOS()) {
			// 调用iOS下的insertPhone方法
			window.webkit.messageHandlers.iOS.postMessage({
				method: 'popupScanner',
			})
			window['sendScannerMsg'] = (res) => {
				cb && cb(res)
			}
		} else {
			// 调用android的方法
			YYT.goScan();
			window["scanResult"] = (res) => {
				cb && cb(res);
			}
		}
		//主动跟踪
	},
}
