//------------------------------importmock数据---------------------------
import msgTipsMock from './msgTips_mock.js';
import CY20 from '@/service/CY/CY20AppService.js'; //修改预订单发送短信状态
import CY61 from '@/service/CY/CY61AppService.js';

import cw from '@/common/ceiwei/common.js';
const app = getApp();
export default {
	data() {
		return {
			// isClue:0,//3:从预订台进来
			picDomain: getApp().globalData.PicDomain,
			sendState: 1, //页面发送状态 1发送中  2发送完成
			customerList: [], //收件人list
			sendName: '', //正在发送的客户姓名
			num: 0, //已发送多少个
			sucNum: 0, //发送成功数量
			errNum: 0, //发送失败数量
			sucName: [], //发送成功姓名
			errName: [], //发送失败姓名
		};
	},
	async onLoad(option) {
		// this.isClue=option.isClue;
		this.customerList = JSON.parse(this.$storage.getCustomers());
		// this.customerList = msgTipsMock.customerList;
		//给每一个收件人添加发送状态resType=0
		this.customerList.forEach((item) => {
			item.resType = 0;
		});
		let time = 0; //超过15s 还没有发送完成 取消任务 所有未发送的均为失败
		let endTime = this.customerList.length * 4;
		let data = getApp().globalData ?
			getApp().globalData.sendMsgPageData.sendRealContent :
			''; //获取发送短信的电话+内容数组
		// 开始发送短信任务
		YYT.BeginSendSSMS();
		//alert('开始发送');
		// 循环发送短信YYT.SendSSMS()
		data.forEach((item) => {
			YYT.SendSSMS(item.phone, item.content);
		});
		//alert('发送中。。。');
		// 每1s获取发送短信结果:YYT.GetSendResult() 每个短信有3秒的反应时间
		// 0发送中，1已发送，其他2-5：发送失败
		let msgTime = setInterval(() => {
			time += 1;
			try {
				let str1 = YYT.GetSendResult();
				//alert(str1);
				let str = JSON.parse(str1);
				let x = 0,
					y = 0,
					strLength = 0,
					suc = [],
					err = [], //x获取为0的个数 y:已发送个数 suc:获取成功的名单  err 获取失败名单
					sucCustomerId = []; //获取发送成功人id
				this._.forEach(str, (value, key) => {
					strLength++; //获取接口返回来 发送短信数量的长度
					if (value != 0) {
						//当有发送状态 即value！=0 更改当前发送的结果
						y++;
						this.customerList.forEach((item) => {
							if (item.phone == key) {
								item.resType = value;
							}
						});
						//获取发送成功/失败的名单
						suc = this._.filter(this.customerList, {
							resType: 1,
						});
						err = this._.reject(this.customerList, {
							resType: 1,
						});
					} else {
						x++; //获取正在发送中的个数
					}
				});
				this.num = y; //已发送多少个
				if (time > endTime) {
					clearInterval(msgTime); //清除定时器
					x = 0; //未发送的全部变为失败
					y = this.customerList.length; //已发送个数为全部
					strLength = this.customerList.length; //接口返回来后台接收到的发送数量
					this.customerList.forEach((item) => {
						if (item.resType == 0) {
							item.resType = 2;
						}
					});
					//获取发送成功/失败的名单
					suc = this._.filter(this.customerList, {
						resType: 1,
					});
					err = this._.reject(this.customerList, {
						resType: 1,
					});
					//发送成功的短信里  是否有跟踪列表进来的
					if(getApp().globalData.customerPageData.isFollowGo){
						 let findIndex = this._(suc).findIndex(x => x.phone == getApp().globalData.customerPageData.fllowData.phone);
						 if(findIndex!=-1){
							// this.$cw.followChange(getApp().globalData.customerPageData.fllowData.phone,()=>{
								uni.$emit('refreshCustomFollow');//跟新跟踪列表
							// })
						 }
					}
				}
				if (x == 0 && strLength == this.customerList.length) {
					if (msgTime) clearInterval(msgTime); //清除定时器
					// 结束发送短信任务
					YYT.EndSendSSms();
					this.sendState = 2;
					this.sucName = this._.map(suc, 'customerName'); //获取姓名
					this.errName = this._.map(err, 'customerName');
					this.num = y; //更新
					//向后台发送成功的电话列表 sucCustomerId MassTextAddFollow
					let textFollowData = {
						cWCompanyId: this.$storage.getAppUserInfo() ?
							this.$storage.getAppUserInfo().cwCompanyID :
							'', //企业ID.
						storeId: this.$storage.getAppUserInfo() ?
							this.$storage.getAppUserInfo().currentStoreId :
							'', //门店.
						customer: suc.map((x) => ({
							customerId: x.customerID[0],
							phone: x.phone,
							customSaveName: x.customSaveName,
						})), //用户
						marketerId: this.$storage.getAppUserInfo() ?
							this.$storage.getAppUserInfo().marketerId :
							'', //客户经理id
					};
					CY61.MassTextAddFollow(textFollowData, (res) => {
						console.log('发送跟踪结果' + res);
					});
				}
			} catch (err) {
				console.log(err);
			}
		}, 1000);
	},
	watch: {
		customerList: {
			handler: function(val, old) {
				return val;
			},
			deep: true,
		},
	},
	computed: {
		styleLeft() {
			//num位移
			return (this.num / this.customerList.length) * 100 + '%';
		},
		percent() {
			//进度条进度
			return (this.num / this.customerList.length) * 100;
		},
	},
	methods: {
		sucSendMsg() {
			//点击完成
			if (this.$storage.getAddCustomerTagList()) {
				this.$storage.removeAddCustomerTagList();
			} //清除添加收件人所选的标签
			uni.navigateBack({
				delta: 2,
			});
		},
	},
};
