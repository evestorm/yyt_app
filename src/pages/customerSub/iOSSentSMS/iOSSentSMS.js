// 作者:杨亮
// https://www.kancloud.cn/cewei/yytapi/1847715 发送短信后要掉的接口

//------------------------------mock数据引入---------------------------
import iOSSentSMSMock from './iOSSentSMS_mock.js';

//------------------------------组件引入-------------------------------
import smsItem from './smsItem/smsItem.vue';

//-------------------------Service引入----------------------------------
import CY57 from '@/service/CY/CY57AppService.js';
import CY20 from '@/service/CY/CY57AppService.js';
import CY61 from '@/service/CY/CY61AppService.js';

export default {
	// 组件放在data前面
	components: {
		smsItem, // 每个客户的状态
		canExit: false, // 默认不许退出
	},
	data() {
		return {
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
			smsList: [], // 要发送短信的客户列表
			// --------------------------------------安卓相关参数---------------------------
			androidAllState: 10, //群发状态(10:未发送；20：发送中，30发送完成)
		};
	},
	// 页面加载事件
	onLoad(options) {
		this.urlOption = options;
		// this.smsList = iOSSentSMSMock.customerList;
		this.smsList = getApp().globalData ?
			getApp().globalData.sendMsgPageData.sendRealContent : [];
		if (this.$cw.isApp(false) && this.$cw.isAndroid()) {
			this.androidSendAllMsg();
		}
	},
	onUnload() {
		this.$storage.setCustomers(JSON.stringify(this.smsList)); //更新发送的短信
	},
	onBackPress() {
		// 全部发送完毕或者用户主动确认退出，才退出
		if (this.remainCount == 0 || this.canExit) {
			return false;
		} else {
			// 否则询问
			this.$refs.cancelPopup.open();
			return true;
		}
	},
	methods: {
		// 按钮单独发送短信
		onClick(item) {
			let userInfo = this.$storage.getAppUserInfo();
			// iOS调用message发短信
			this.$cw.sentSMS(item,0, (res) => {
				switch (res) {
					case 'success': // 发送成功 刷新视图
						item.status = 1;
						uni.showToast({
							title: '发送短信成功!',
							duration: 2000,
						});
						break;
					case 'fail': // 发送失败
						item.status = 2;
						uni.showToast({
							title: '发送短信失败!',
							icon: 'none',
							duration: 2000,
						});
						break;
					case 'cancel': // 取消了发送
						item.status = -1;
						break;
					default:
						item.status = 0; //发送中
						break;
				}
			});
		},
		// --------------------------------------安卓操作---------------------------
		androidSendAllMsg() {
			//安卓群发发送短信
			let that = this;
			this.androidAllState = 20;
			//给每一个收件人添加发送状态status=0
			this.smsList.forEach((item) => {
				this.$set(item, 'status', 0);
				this.$set(item, 'isSended', false); //是否已发送短信
				//判断是否有跟踪列表进来的 给他添加参数
				if (
					getApp().globalData.customerPageData.isFollowGo &&
					item.phone == getApp().globalData.customerPageData.fllowData.phone
				) {
					this.$set(item, 'isFllowSended', false); //是否已发送短信
				}
			});
			let data = getApp().globalData ?
				getApp().globalData.sendMsgPageData.sendRealContent :
				''; //获取发送短信的电话+内容数组
			// 开始发送短信任务
			YYT.BeginSendSSMS();
			// 循环发送短信YYT.SendSSMS()
			data.forEach((item) => {
				YYT.SendSSMS(item.phone, item.realContent);
			});
			let endTime = this.$moment().add(this.smsList.length * 4, 'seconds'); // 每条短信给4s的反应时间
			// 每1s获取发送短信结果:YYT.GetSendResult() 每个短信有3秒的反应时间
			// 0发送中，1已发送，其他2-5：发送失败
			let msgTime = setInterval(() => {
				try {
					// let sendResult = iOSSentSMSMock.str;
					let strSendResult = YYT.GetSendResult(); // 返回数据格式 "{'13110185464':2,'13362937181':1,}
					let sendResult = JSON.parse(strSendResult);
					//this.smsList 循环遍历赋值
					this._.forEach(sendResult, (value, key) => {
						//当有发送状态 即value！=0 更改当前发送的结果
						this.smsList.forEach((item) => {
							if (item.phone == key) {
								item.status = value;
								if (item.status == 1) {
									this.msgSuccess(item);
								}
							}
						});
					});
					// 没有成功的短信列表
					let failSmssList = this.smsList.filter((x) => x.status != 1);
					//获取正在发送的短信列表
					let doingSmssList = this.smsList.filter((x) => x.status == 0);
					if (doingSmssList.length == 0) {
						//所有的已发送完
						overSendMsg();
					}
					if (this.$moment() > endTime) {
						//超时
						overSendMsg();
					}
					// 结束获取短信 进行页面最终展示
					function overSendMsg() {
						clearInterval(msgTime); //清除定时器
						// 拿到发送失败的列表 调用单发的接口进行确认
						failSmssList.forEach((item) => {
							// // 调用单个发送接口获取结果
							// let isSucees = 'success';
							let isSucees = YYT.getSendSMSResult(item.phone);
							// 没有成功 标志发送失败
							item.status = isSucees == 'success' ? 1 : 2; //赋值 终于success的 才会赋1
							let findItem = that
								._(that.smsList)
								.find((x) => x.phone == item.phone);
							findItem.status = item.status;
						});
						console.log('所有的完成', that.smsList, failSmssList);
						// 结束发送短信任务
						that.androidAllState = 30;
						YYT.EndSendSSms();
					}

					this.$storage.setCustomers(JSON.stringify(that.smsList)); //更新发送的短信
				} catch (e) {}
			}, 3000);
		},
		// 短信发送成功后处理，item 是没条短信的Item
		msgSuccess(item) {
			if (item.status == 1 && !item.isSended) {
				// 只有发送成功并且isSended为false(之前没有发送过)
				item.isSended = true;
				this.createByDto(item.customerID, item.phone, item.realContent);
				// if (item.isFllowSended === false) {
				// 	item.isFllowSended = true;
				// 	uni.$emit('refreshCustomFollow'); //跟新跟踪列表
				// }
			}
		},
		// 弹窗点击取消
		cancel() {
			this.$refs.cancelPopup.close();
		},
		// 弹窗点击确认
		confirm() {
			this.$refs.cancelPopup.close();
			this.canExit = true;
			uni.navigateBack({
				delta: 1,
			});
		},
		// 添加通讯记录
		createByDto(customerID, phone, realContent) {
			let cy57Data = {
				customerId: customerID,
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				cWCompanyId: this.$storage.getAppUserInfo().userCWCompanyID,
				marketerId: this.$storage.getAppUserInfo().marketerId,
				callType: 3, // 1-呼入，2-呼出，3-短信 4-电话未接通 5-微信发送 6-收到短信
				phone: phone,
				msgContent: realContent, // 消息内容
				beginTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
				endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			let res = CY57.CreateByDto(cy57Data);
		},
	},
	computed: {
		// 未发送成功的短信数量
		remainCount() {
			return this.smsList.filter((v) => v.status != 1).length;
		},
	},
	filters: {},
	watch: {},
};
