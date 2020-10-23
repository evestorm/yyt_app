import uniPopup from '@/components/uni-popup/uni-popup.vue';

import YHClue from '@/service/YH/YHClueAppService.js';

import cw from '@/common/ceiwei/common.js';
const app = getApp();
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			isActiveH: true, //历史记录 跟踪记录切换
			isActiveT: false,
			yhClue: {}, //用户线索信息
			followHistoryLogs: [], //跟踪记录
			yhClueHistoryLogs: [], //历史纪录
			banquetInfo: {}, //线索详情
			banquetId: '', //传给跟进页面的id
			changeMsg: '', //弹窗文字
			imageList: [], //图片数组
			//发送短信
			msgIsShow: false, // 短信模板是否打开
			nameIsShow: false, // 设置客户尊称是否打开
			//点击发送短信顾客信息
			cusotmerInfo: {},
			//短信模板默认隐藏
			showModal: false,
			//模板短信标题默认第一个高亮
			selected: 0,
			// 版本短信文本域
			textAreaText: "",
			//发送短信的内容
			sendMessageInfo: [],
			CustomPoolData: [],
			// botBthShow:false,//底部按是否取消钮切换
			msg: '' //显示桌数

		}
	},
	onLoad(option) {
		let self = this;
		// console.log('option',option);
		this.getClueDetail(option);
		this.banquetId = self._.cloneDeep(option.id);
	},
	mounted() {
		uni.$on('reloadMyBanquePage', res => {
			if (res == 'refresh') {
				this.getClueDetail({
					id: this.banquetId
				});
			}
		})
	},
	methods: {
		//获取我的线索详情
		async getClueDetail(id) {
			let res = await YHClue.GetClueDetail(id);
			let self = this;
			if (res.length != 0) {
				res = self.$util.null2str(res);
				self.banquetInfo = self._.cloneDeep(res);
				self.yhClue = self._.cloneDeep(res.yhClue);
				self.followHistoryLogs = self._.cloneDeep(res.followHistoryLogs);
				self.yhClueHistoryLogs = self._.cloneDeep(res.yhClueHistoryLogs);
				self.msg = `${self.yhClue.clueTableCount}桌备${self.yhClue.bakTableCount}`
				self.banquetId = self._.cloneDeep(self.banquetInfo.yhClue.id);
				for (let key in self.yhClueHistoryLogs) {
					if (self.yhClueHistoryLogs[key].historyLogImgUrls) {
						self.yhClueHistoryLogs[key].historyLogImgUrls = self.yhClueHistoryLogs[key].historyLogImgUrls.split(",");
						self.imageList = self.imageList.concat(self.yhClueHistoryLogs[key].historyLogImgUrls);
					}
				}
			}

		},
		//跳转客户详情 customerId
		goCustomerInfo(id) {
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${id}`
			});
		},
		telPhoneRecode() { //跳转拨号页面
			// console.log(this.yhClue.clueUserPhone)
			this.$util.baiduEvent('打电话', '我的线索顶部打电话');
			let self = this;
			this.$cw.callPhone(self.yhClue.clueUserPhone,1);
		},
		// 选择生日
		chooseDate(e) {
			this.yhClue.clueUserBirthdayDate = e.target.value;
		},
		//选择档期
		chooseScheduleDate(e) {
			this.yhClue.clueScheduleDate = e.target.value;
		},
		changCustomer() { //转化为客户
			this.changeMsg = '您确定要将该线索转化为客户？'
			this.$refs.changCustomer.open();
		},
		qxChangCustomer() { //取消转化为客户
			this.$refs.changCustomer.close();
		},
		async qdChangCustomer() { //确定转化为客户
			//请求
			this.$refs.changCustomer.close();
			if (this.changeMsg == '您确定要将该线索转化为客户？') {
				// console.log('发送转化为客户请求')
				let self = this;
				let customInfo = JSON.stringify(this.banquetInfo.yhClue)
				uni.navigateTo({
					url: `/pages/_common/addCustomerInfo/addCustomerInfo?bcustomInfo=${customInfo}`
				})
			} else if (this.changeMsg == '您确定要激活该线索？') {
				// console.log('发送激活线索请求')
				let data = {};
				data.clueStatus = 1;
				data.id = this.yhClue.id;
				data.modifiedName = this.$storage.getAppUserInfo().userName;
				let res = await YHClue.UpdateByDto(data);
				if (res) {
					let data = {};
					data.id = this.banquetId
					this.getClueDetail(data);
				}


			}
		},
		selHistory() { //历史记录 跟踪记录切换
			this.isActiveH = true;
			this.isActiveT = false;
		},
		selTrack() { //历史记录 跟踪记录切换
			this.isActiveH = false;
			this.isActiveT = true;
		},
		//预览图片
		previewImg(img) {
			uni.previewImage({
				current: img,
				urls: this.imageList,
				indicator: 'default'
			})
		},
		//线索跟进按钮 banquetInfoFllow/banquetInfoFllow
		banquetInfoFllow() {
			getApp().globalData.banquetFllowPageData.pageData=this.banquetInfo;
			uni.navigateTo({
				url: `/pages/banquetSub/banquetFllow/banquetFllow`,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		//取消线索
		cancelBanquet() {
			uni.navigateTo({
				url: `/pages/banquetSub/cancelBanquet/cancelBanquet?id=${this.banquetId}&clueCancleReason=${this.yhClue.clueCancleReason}`,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		//激活按钮
		jihuoBanquet() {
			this.changeMsg = '您确定要激活该线索？'
			this.$refs.changCustomer.open();
		},
		//成交
		async sucBanquet() {
			//有宴会订单权限的才跳转 否则直接成交
			// console.log(this.$storage.getSalesAuthority().isShowYHBanquetOrder)
			if (this.$storage.getSalesAuthority().isShowYHBanquetOrder) {
				uni.navigateTo({
					url: `/pages/banquetSub/addBanquetOrder/addBanquetOrder?clueGUID=${this.banquetId}`
				});
			} else {
				let data = {};
				data.clueStatus = 3;
				data.id = this.yhClue.id;
				data.modifiedName = this.$storage.getAppUserInfo().userName;
				let res = await YHClue.UpdateByDto(data);
				if (res) {
					this.yhClue.clueStatus = 3
				}
			}

		},
		//跟进线索请求
		async updateByDto(data) {
			data.id = this.yhClue.id;
			let res = await YHClue.UpdateByDto(data);
			uni.switchTab({
				url: '/pages/banquet/banquetCue/banquetCue'
			})

		},
		// 跳转发送短信页面
		sendMSM: function(customPoolDataItem) {
			this.$util.baiduEvent('发短信', '我的线索顶部发短信');
			let ct = {};
			ct.isClue = 1;
			// ct.customerID = customPoolDataItem.customerID;
			ct.id = customPoolDataItem.id;
			ct.clueUserPhone = customPoolDataItem.clueUserPhone;
			ct.clueUserName = customPoolDataItem.clueUserName;
			//没有客户id 用手机号码代替,将客户姓名/手机号传递

			let url =
				`/pages/customerSub/sendMsg/sendMsg?id=${ct.id}&phone=${ct.clueUserPhone}&isClue=${ct.isClue}&customerName=${ct.clueUserName}`;
			uni.navigateTo({
				url,
			});
		}

	}
}
