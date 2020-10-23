import cw from '@/common/ceiwei/common.js';

import CY19 from '@/service/CY/CY19AppService.js'; //修改尊称
import CY20 from '@/service/CY/CY20AppService.js'; //修改预订单发送短信微信状态
import CY57 from '@/service/CY/CY57AppService.js'; //上传通讯记录
import CY67 from '@/service/CY/CY67AppService.js'; //获取短信模板第一条
import CY61 from '@/service/CY/CY61AppService.js'; //获取短信模板第一条
export default {
	data() {
		return {
			picDomain: getApp().globalData.PicDomain, //图片服务器地址
			isExplain: false, //右上角说明文字是否隐藏
			message: '', //短信内容
			oldMesage: '', // 旧的短信内容
			customerList: [], //收件人列表
			popupIndex: '', //弹窗内容 1:修改尊称
			saveName: {}, //手机联系人列表
			isCueCome: false, //是否是线索进来
			cursorPos: -1, //textarea光标位置
			// ---------------------------------------------尊称相关-------------------------------------------------
			// num: 0, //尊称和通讯录不同参数
			// msgNameQuery: { //修改尊称请求参数
			// 	id: '',
			// 	msgName: ''
			// },
			// ---------------------------------------------短信预览相关相关参数-------------------------------------------------
			// messageFillTemplate: [], //预览拼接好的数据
			messsgeModeObj: {}, //获取缓存的短信模板
			isGetAllMsg: false, //是否刷新所有的短信预览 只有点击预览的时候才会刷新所有的 （防止新增收件人后自动获取预览数据）
			previewData: {
				storeId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店ID
				marketId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().marketerId : '', //客户经理id,//
				messageTemplateID: '', //短信模板主键id
				isClue: '', //判断是否是线索进来的 (1.线索，2.通讯录 3.预定列表)
				content: '', //短信内容-带标签
				realContent: '', //短信内容 str
				customerId: [], //客户id 或者线索的id集合
				userList: [], //用户数据 仅isClue=2时才赋值
			},
			// ===========================软键盘谈起会顶起底部按钮===================
			windowHeight: 0,
			// tabbar: true,
			previewIsActive: true, // 默认预览按钮为高亮状态
			telephoneBook: [], // 联系人
			options: {},
		}
	},
	async onLoad(option) {
		this.options = option;
		// //监听页面软键盘弹起事件(坑 会受其他页面影响 然后按钮没了)
		// let [err, resWh] = await uni.getSystemInfo()
		// if (resWh) {
		// 	this.windowHeight = resWh.windowHeight;
		// }
		// uni.onWindowResize((res) => {
		// 	if (res.size.windowHeight < this.windowHeight) {
		// 		this.tabbar = false;
		// 	} else {
		// 		this.tabbar = true;
		// 	}
		// })
		if (!this._.isEmpty(option)) { //接收客户列表传送过来的信息
			if (option.isFllow) { //是否是客户跟踪进来 需要自动跟踪 更新globalData数据
				getApp().globalData.customerPageData.isFollowGo = true;
			} else {
				getApp().globalData.customerPageData.isFollowGo = false;
				getApp().globalData.customerPageData.fllowData.customerFollowID = '';
				getApp().globalData.customerPageData.fllowData.phone = '';
			}
			let obj = {
				isConfirm: 1,
				// customSaveName: option.customSaveName, //通讯录联系人名称  进来的时候通讯录名称是
				customSaveName: '', //通讯录联系人名称  进来的时候通讯录名称是
				// customerID: option.customerID, //客户id
				customerName: option.customerName || option.customSaveName, //客户名称
				phone: option.phone, //电话
				msgName: option.msgName, //尊称
				isTemp: false, //是否有预览数据
				isEdit: false, //是否编辑预览短信
				// checked: true, // 是否选中
			};
			this.isCueCome = option.isClue ? true : false; //判断是否是线索进来 控制页面显示添加联系人按钮
			this.previewData.isClue = option.isClue ? option.isClue : null;
			switch (option.isClue) { //给previewData赋值
				case '1':
					this.previewData.customerId = [option.id];
					obj.customerID = option.id;
					break;
				case '2': //联系人 userList
					this.previewData.userList = [{
						phone: option.phone,
						customerName: option.customerName || option.customSaveName
					}]
					obj.userList = [{
						phone: option.phone,
						customerName: option.customerName || option.customSaveName
					}]
					break;
				default:
					this.previewData.customerId = [option.customerID];
					obj.customerID = option.customerID;
					break;
			}
			this.customerList = [obj];
			this.getSaveName();
			this.$storage.setCustomers(JSON.stringify(this.customerList));
		}
		//获取短信模板  取缓存()或者第一次进入显示第一条模板 getApp().globalData.sendMsgPageData.MsgMould
		let messgeModeArr = [];
		let tempTyep = this.previewData.isClue == 3 ? 1 : 2; //预定台进来1
		if (this.$storage.getMsgMould()) {
			if (this._.isArray(this.$storage.getMsgMould())) { //之前缓存短信模板不是数组
				messgeModeArr = this.$storage.getMsgMould();
			} else {
				messgeModeArr.push(this.$storage.getMsgMould())
			}
			messgeModeArr.forEach(x => {
				if (x.storeId == this.$storage.getAppUserInfo().currentStoreId && x.messageTemplateType == tempTyep) {
					getApp().globalData.sendMsgPageData.MsgMould = x
				}
			})
		}
		if ((!this._.isEmpty(messgeModeArr)) && getApp().globalData.sendMsgPageData.MsgMould.messageTemplateContent) {
			this.message = getApp().globalData.sendMsgPageData.MsgMould.messageTemplateContent;
		} else {
			let data = {
				storID: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店ID.
				marketID: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().marketerId : '', //客户经理id
			}
			let res = await CY67.GetMessageTemplate(data);
			let templateList = res.templateList;
			if (!this._.isEmpty(templateList)) { //只有从预定台进来显示预定短信
				let index1 = this._.findIndex(templateList, ['typeName', '预订通知']); //预定通知
				let index2 = this._.findIndex(templateList, ['typeName', '跟踪短信']);
				if (this.previewData.isClue == 3) {
					this.message = templateList[index1].templateList[0].messageTemplateContent;
					this.previewData.messageTemplateID = templateList[index1].templateList[0].messageTemplateID;
					getApp().globalData.sendMsgPageData.MsgMould = templateList[index1].templateList[0];
					// this.$storage.setMsgMould(templateList[index1].templateList[0])
				} else {
					this.message = templateList[index2].templateList[0].messageTemplateContent;
					this.previewData.messageTemplateID = templateList[index2].templateList[0].messageTemplateID;
					getApp().globalData.sendMsgPageData.MsgMould = templateList[index2].templateList[0];
					// this.$storage.setMsgMould(templateList[index2].templateList[0])
				}
				this.oldMesage = this.message; // 用来判断用户是否修改过发送内容文本中的内容
				if ((!this._.isEmpty(this.customerList)) && !this.customerList[0].status) { //没有缓存短信模板时 需要获取短信模板后再请求预览 有短信模板 走onShow
					this.getMessageFillTemplate();
				}
				//更新短信内容缓存
				// let obj = this.$storage.getMsgMould();
				// if (obj) {
				// 	obj.messageTemplateContent = this.message
				// 	this.$storage.setMsgMould(obj)
				// }
			} else {
				uni.showToast({
					title: '请添加短信模板',
					icon: 'none'
				})
			}
		}
		//跟新缓存
		this.$storage.setMsgMould(messgeModeArr);
		this.$cw.getRecordsData(); //获取通讯录
	},
	onHide() {
		//页面隐藏时更新缓存
		this.$storage.setCustomers(JSON.stringify(this.customerList));
	},
	onUnload() {
		//清除缓存联系人 +短信内容
		this.$storage.removeCustomers();
		//如果没有短信模板时，也要缓存文字信息
		if (this._.isEmpty(getApp().globalData.sendMsgPageData.MsgMould)) {
			let obj = {
				messageTemplateContent: this.message,
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				messageTemplateType: this.previewData.isClue == 3 ? 1 : 2
			}
			getApp().globalData.sendMsgPageData.MsgMould = obj;
		} else {
			getApp().globalData.sendMsgPageData.MsgMould.storeId = this.$storage.getAppUserInfo().currentStoreId;
			getApp().globalData.sendMsgPageData.MsgMould.messageTemplateType = this.previewData.isClue == 3 ? 1 : 2;

		}
		//更新缓存 
		let messgeModeArr = this.$storage.getMsgMould() || [];
		let findIndex = this._(messgeModeArr).findIndex(x => x.storeId == getApp().globalData.sendMsgPageData.MsgMould.storeId &&
			x.messageTemplateType == getApp().globalData.sendMsgPageData.MsgMould.messageTemplateType);
		if (findIndex != -1) {
			messgeModeArr.splice(findIndex, 1, getApp().globalData.sendMsgPageData.MsgMould);
		} else {
			messgeModeArr.push(getApp().globalData.sendMsgPageData.MsgMould)
		}
		this.$storage.setMsgMould(messgeModeArr);
		getApp().globalData.sendMsgPageData.MsgMould = {};
		// if (this.previewData.isClue == 3 && getApp().globalData.sendMsgPageData.MsgMould && getApp().globalData.sendMsgPageData.MsgMould.messageTemplateType ==
		// 	1) { //从预定台进来并且短信模板类型为预定类型 要清除缓存 防止给非预定台进来的客户发送预定信息
		// 	this.$storage.removeMsgMould();
		// }
		uni.$emit('refreshCustomFollow'); //发短信 微信时 统一页面销毁时刷新跟踪列表；不用区分是哪个入口进入
	},
	onShow(option) {
		//获取通讯录名称
		// if (this.$storage.getMsgMould()) { //获取短信模板-取缓存
		if (getApp().globalData.sendMsgPageData.MsgMould) {
			this.message = getApp().globalData.sendMsgPageData.MsgMould.messageTemplateContent || this.message;
			// this.previewIsActive = this.oldMesage !== this.message;
			this.previewData.messageTemplateID = getApp().globalData.sendMsgPageData.MsgMould.messageTemplateID || this.previewData
				.messageTemplateID;
		}
		if (this.$storage.getCustomers()) { //获取收件人列表
			// alert(this.$storage.getCustomers());
			this.customerList = this.$storage.getCustomers() ? JSON.parse(this.$storage.getCustomers()) : this.customerList;
			if (getApp().globalData.recordsData) {
				this.saveName = getApp().globalData.recordsData;
				this.getSaveName();
			}
		}
		// if (this.message && (!this._.isEmpty(this.customerList)) && !this.customerList[0].status) { //有短信模板+联系人 同时发送状态不为0
		// 	this.getMessageFillTemplate();
		// }
	},
	filters: {
		parseIsCanGroup(item) { //价值客户/是否整理显示
			if (item.isCustomerPoolMarket === null || item.isArrange === null) return;
			let str = '';
			if (item.isCustomerPoolMarket) { //是否价值客户 
				str = item.isArrange ? '价值客户' : '价值客户/未整理'
			} else {
				str = item.isArrange == 0 ? '未整理' : ''
			}
			return str;
		}
	},
	methods: {
		// 导航栏右上角显示提示
		onShowTip() {
			this.isExplain = !this.isExplain
		},
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		// ------------------------------------------短信模板 相关操作----------------------------------------
		getParameter(data) {
			this.insertInputTxt('dxContent', data);
		},
		previewMsg() { //点击预览 更新所有预览信息
			this.isGetAllMsg = true;
			// this.previewIsActive = false;
			this.oldMesage = this.message;
			let isAll = true; //刷新全部短信
			this.getMessageFillTemplate(isAll);
		},
		// // message变化后触发
		// changeMessage(e) {
		// 	const {
		// 		value
		// 	} = e.detail;
		// 	this.previewIsActive = this.oldMesage !== value;
		// },
		bindTextAreaBlur(e) { //textarea失去焦点时记录光标位置,并缓存内容
			const {
				value,
				cursor
			} = e.detail;
			this.cursorPos = cursor;
			//更新短信内容缓存
			let obj = getApp().globalData.sendMsgPageData.MsgMould;
			if (obj) {
				obj.messageTemplateContent = value;
				getApp().globalData.sendMsgPageData.MsgMould = obj;
				// this.$storage.setMsgMould(obj)
			}
		},
		insertInputTxt(id, insertTxt) { //插入参数到指定位置
			const elInput = this.$refs[id];
			if (this.cursorPos == -1) {
				this.message = this.message + insertTxt;
			} else {
				let txt = elInput.value;
				this.message = txt.substring(0, this.cursorPos) + insertTxt + txt.substring(this.cursorPos);
				//更新短信内容缓存
				let obj = getApp().globalData.sendMsgPageData.MsgMould;
				obj.messageTemplateContent = this.message;
				getApp().globalData.sendMsgPageData.MsgMould = obj;
				// this.$storage.setMsgMould(obj)
				this.$nextTick(() => {
					this.cursorPos = this.cursorPos + insertTxt.length;
				});
			}
			// this.previewIsActive = this.message !== this.oldMesage;
		},
		//===========================================获取通讯录名 匹配=========================================================
		getSaveName() {
			// for (let m = 0; m < this.customerList.length; m++) {
			// 	for (let key in this.saveName) {
			// 		if (this.customerList[m].phone == key) {
			// 			this.customerList[m].customSaveName = this.saveName[key];
			// 			this.customerList.splice(m, 1, this.customerList[m]);
			// 			// return
			// 		}
			// 	}
			// }
			for (let [key, value] of Object.entries(this.saveName)) {
				let filter = this.customerList.find(v => v.phone == key);
				if (filter) {
					filter.customSaveName = value;
				}
			}
		},
		jumpCustomerInfo(item) { //点击姓名跳转客户详情
			if (this.isCueCome || !item.customerID) return;
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${item.customerID}`
			})
		},
		delCustomer(id) { //删除联系人
			let that = this;
			for (let n = 0; n < that.customerList.length; n++) {
				if (that.customerList[n].customerID == id) {
					that.customerList.splice(n, 1);
					//跟新缓存收件人
					this.$storage.setCustomers(JSON.stringify(that.customerList));
					return
				}
			}
		},
		// changeMsgName(obj) { //弹出修改尊称
		// 	this.popupIndex = 1;
		// 	this.$refs.delPopup.open();
		// 	this.msgNameQuery.id = obj.customerID;
		// 	this.msgNameQuery.msgName=obj.msgName||'';
		// },
		cancel() { //弹窗关闭
			this.$refs.delPopup.close();
		},
		// -----------------------------------------发送短信/微信按钮操作------------------------------------------------
		async clickSendMsg() { //发送短信按钮
			if (this.$cw.isApp()) {
				// 群发进行弹窗
				if (this.customerList.length > 0 && this.message) { // 收件人数量>0 发送内容不为空
					//this.popupIndex = 2; // 弹出确认窗(现在只有2了)
					// if (!this.isCueCome) {
					// 	let n = 0;
					// 	//获取收件人和尊称和联系人名称(或者客户名称)不一致的数量
					// 	this.customerList.forEach(item=>{
					// 		if(item.msgName !=item.customSaveName && item.msgName !=item.customerName)n++;
					// 	})
					// 	this.num = n;
					// }
					//this.$refs.delPopup.open();
					if (this.customerList.length > 1) {
						let bol = this._.some(this.customerList, x => x.isCustomerPoolMarket || !x.isArrange);
						if (bol) {
							uni.showToast({
								title: '存在价值客户或未整理的客户,不能群发',
								duration: 3000,
								icon: 'none'
							})
							return;
						}
					}
					// 直接发不用弹窗确认 ydm
					let [error, res] = await uni.showModal({
						title: '发送短信前请确认客户姓名，是否确认发送？'
					});
					if (res.confirm) {
						this.confirm();
					}

				} else {
					uni.showToast({
						title: '请选择短信内容或收件人',
						icon: 'none'
					})
				}
			}
		},
		async clickSendWx() { //发送微信按钮
			if (!this.$cw.isApp()) return;
			if (this.customerList.length == 0 || !this.message) {
				uni.showToast({
					title: '请选择短信内容或收件人',
					icon: 'none'
				})
				return
			}
			let customer = [];
			//过滤收件人列表中 isTemp为false的
			// customer = this._.filter(this.customerList, {
			// 	'isTemp': false
			// });
			// if (!this._.isEmpty(customer)) {
			// 	uni.showLoading({
			// 		title: '短信内容生成中...'
			// 	})
			// 	let res = await this.getMessageFillTemplate();
			// 	uni.hideLoading();
			// }
			let bol = this.previewData.isClue == 1 || this.previewData.isClue == 3 ? 1 : 0; //只有宴会和预定进来的 IsNotFollow=1
			this.$cw.sendWeixinText(this.customerList[0].realContent, this.customerList[0].phone, this.customerList[0].customerID,bol);
			if (this.previewData.isClue == 3) { //从预定台进来 需要修改sendMsgType
				let data = {
					id: this.customerList[0].customerID,
					sendMsgType: 20
				}
				await CY20.UpdateByDto(data, null, null, false);
				uni.$emit('todayBookRefresh', 'refresh');
			}
		},
		async confirm() { //弹窗确认按钮
			let customer = [],
				sendRealContent = []; //发送的正式内容用于msgTip页面（电话+短信内容）
			//过滤收件人列表中没有短信内容的  isTemp为false的
			// customer = this._.filter(this.customerList, {
			// 	'isTemp': false
			// });
			// if (!this._.isEmpty(customer)) {
			// 	uni.showLoading({
			// 		title: '短信内容生成中...'
			// 	});
			// 	let res = await this.getMessageFillTemplate();
			// 	uni.hideLoading();
			// }
			//过滤只需要的短信内容及对应的电话号码
			this.customerList.forEach(item => {
				let obj = {};
				obj.phone = item.phone;
				obj.content = item.content; //发送短信后 返回该页面 再次点发送 会没有realContent字段 发送内容为undefined
				obj.realContent = item.realContent;
				obj.customSaveName = item.customSaveName; // iOS用
				obj.customerName = item.customerName; // iOS用
				obj.customerID = item.customerID; // iOS用
				obj.msgName = item.msgName; // iOS用
				obj.status = null; // iOS用
				obj.isTemp = item.isTemp;
				obj.isCustomerPoolMarket = item.isCustomerPoolMarket; //是否是价值客户
				obj.isArrange = item.isArrange; //是否已整理
				sendRealContent.push(obj)
			})
			getApp().globalData.sendMsgPageData.sendRealContent = sendRealContent;
			this.$refs.delPopup.close();
			// if (this.$cw.isiOS()) { // iOS
			if (getApp().globalData.sendMsgPageData.sendRealContent.length > 1) { //如果有价值客户或于未整理的客户就不能群发
				uni.navigateTo({
					url: `/pages/customerSub/iOSSentSMS/iOSSentSMS`
				});
			} else {
				let userInfo = this.$storage.getAppUserInfo();
				let first = getApp().globalData.sendMsgPageData.sendRealContent[0];
				if (!first) return;
				let bol = this.previewData.isClue == 1 || this.previewData.isClue == 3 ? 1 : 0; //只有宴会和预定进来的 IsNotFollow=1
				this.$cw.sentSMS(first, bol, res => {
					switch (res) {
						case 'success': // 发送成功
							uni.showToast({
								title: '短信发送成功!',
								icon: 'none',
								duration: 2000
							});
							first.status = 1;
							this.customerList.splice(0, 1, first);
							if (this.previewData.isClue == 3) { //更改预定列表发送短信方式
								let data = {
									id: this.customerList[0].customerID,
									sendMsgType: 10
								}
								CY20.UpdateByDto(data, null, null, false);
								uni.$emit('todayBookRefresh', 'refresh');
							}
							// //跟新主动跟踪
							this.$cw.followChange(this.customerList[0].phone, () => {
								// 	uni.$emit('refreshCustomFollow'); //跟新跟踪列表
							});
							break;
						case 'fail': // 发送失败
							// first.status = 0;
							uni.showToast({
								title: '发送短信失败!',
								icon: 'none',
								duration: 2000
							});
							break;
						case 'cancel': // 取消了发送
							// first.status = -1;
							break;
						default:
							break;
					}
				});
			}
			// } else { // Android
			// 	if (getApp().globalData.sendMsgPageData.sendRealContent.length > 1) {
			// 		uni.navigateTo({
			// 			url: `/pages/customerSub/msgTips/msgTips`
			// 		});
			// 	}else{//只有一个发件人直接发送 
			// 		uni.showLoading({
			// 			title:'短信正在发送中....'
			// 		})
			// 		this.$cw.sentSMS(getApp().globalData.sendMsgPageData.sendRealContent[0], res => {
			// 		if(res=='success'){
			// 			uni.hideLoading();
			// 			if(this.previewData.isClue == 3){//从预定台进来 需要修改sendMsgType
			// 				let data={
			// 					id:this.customerList[0].customerID,
			// 					sendMsgType:10
			// 				}
			// 				CY20.UpdateByDto(data,null,null,false);
			// 			}
			// 			uni.showToast({
			// 				title:'短信发送成功！'
			// 			})
			// 		}else{
			// 			uni.hideLoading();
			// 			this.$cw.showError('发送失败，请检查是否授权!!')
			// 		}
			// 		//跟新主动跟踪
			// 		if(getApp().globalData.customerPageData.isFollowGo&&getApp().globalData.customerPageData.fllowData.phone==getApp().globalData.sendMsgPageData.sendRealContent[0].phone&&getApp().globalData.customerPageData.fllowData.customerFollowID){
			// 			uni.$emit('refreshCustomFollow');//跟新跟踪列表
			// 		}
			// 		})
			// 	}
			// }
			//暂时注释修改尊称和尊称与客户姓名不一致的提示
			// if (this.popupIndex == 1) { //修改尊称
			// 	let res = await CY19.UpdateByDto(this.msgNameQuery);
			// 	if (res.length != 0) {
			// 		this.$refs.delPopup.close();
			// 		for (let n = 0; n < this.customerList.length; n++) {
			// 			if (this.msgNameQuery.id == this.customerList[n].customerID) {
			// 				this.customerList[n].msgName = this.msgNameQuery.msgName;
			// 				this.customerList[n].isConfirm = 1;
			// 				storage.setCustomers(JSON.stringify(this.customers));
			// 				return
			// 			}
			// 		}
			// 	}
			// } else if (this.popupIndex == 2) {
			// 	if (this.num != 0) {
			// 		this.popupIndex = 3
			// 	} else {
			// 		this.$refs.delPopup.close();
			// 		storage.setCustomers(JSON.stringify(this.customerList));
			// 		//storage.setCustomerIDs(this.customerIdList)
			// 		uni.navigateTo({
			// 			url: `/pages/customerSub/msgTips/msgTips?msg=${this.message}&messageTemplateID=${this.previewData.messageTemplateID}`
			// 		});
			// 	}
			// } else if (this.popupIndex == 3) {
			// 	this.$refs.delPopup.close();
			// 	this.$refs.delPopup.close();
			// 	storage.setCustomers(JSON.stringify(this.customerList));
			// 	//storage.setCustomerIDs(this.customerIdList)
			// 	uni.navigateTo({
			// 		url: `/pages/customerSub/msgTips/msgTips?msg=${this.message}&messageTemplateID=${this.previewData.messageTemplateID}`
			// 	});
			// }
		},
		// -----------------------------------------获取预览相关操作------------------------------------------------
		//获取短信预览数据
		async getMessageFillTemplate(isAll) {
			//1.全部刷新 customerId为所有用户
			//2.只刷新新增的部分 customerId为新增用户id集合
			if (!this.message) {
				uni.showToast({
					title: '请选择或输入短信内容',
					duration: 2000,
					icon: 'none'
				})
				return;
			}
			if (this.customerList.length == 0) {
				uni.showToast({
					title: '请添加收件人',
					duration: 2000,
					icon: 'none'
				})
				return;
			}
			this.previewData.content = this.message;
			if (isAll) { //全部刷新
				uni.showLoading({
					title: '短信内容生成中...'
				})
				this.previewData.customerId = this._.flatMap(this.customerList, 'customerID');
			} else {
				let customer = [];
				//过滤收件人列表中 isTemp为false的
				customer = this._.filter(this.customerList, {
					'isTemp': false
				});
				if (customer.length > 0) {
					uni.showLoading({
						title: '短信内容生成中...'
					})
				}
				this.previewData.customerId = this._.flatMap(customer, 'customerID')
			}
			let result = await CY67.FillRealTemplate(this.previewData);
			if (result.content) {
				let preList = result.content;
				preList.forEach(item => {
					item.isTemp = true;
					isEdit: false
				})
				//预览数据与收件人列表匹配 
				const map2 = this._.keyBy(preList, "phone");
				const customerList = this._(this.customerList).map(m => this._.merge({}, m, map2[m.phone]))
					.concat(this._.differenceBy(preList, this.customerList, "phone"))
					.value();
				this.customerList = customerList;
				console.log(this.customerList)
				uni.hideLoading();
				return result;
			}
		},
	},
	watch: {
		'customerList': { //监听是否有新加入联系人
			handler(val, old) {
				let customer = this._.filter(val, { //更新联系人时，筛选是否有没有预览数据的人
					'isTemp': false
				});
				if (customer.length > 0) {
					this.getMessageFillTemplate(); //当新增收件人时 发请求获取预览数据
				}
			}
		},
		"previewData.messageTemplateID": { //如果更换了短信模板 就要把所有选择的联系人的预览内容再刷一遍
			handler(val, old) {
				this.getMessageFillTemplate(true);
			}
		}
	}
}
