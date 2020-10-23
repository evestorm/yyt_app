import short from '@/components/yyt-short/yyt-short.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import CY56 from '@/service/CY/CY56AppService.js';
import CY77 from '@/service/CY/CY77AppService.js';

import swIcon from '@/components/uni-icon/uni-icon.vue';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			dateShow: {
				star: {
					color: false,
					title: '全部评价',
					img: 'down.png'
				},
				reply: {
					color: false,
					title: '全部状态',
					img: 'down.png'
				}
			},
			replyList: [
				//回复状态
				{
					text: '全部',
					value: ''
				},
				{
					text: '已回复',
					value: 1
				},
				{
					text: '未回复',
					value: 2
				}
			],
			starlist: [
				//评价等级
				{
					text: '全部',
					value: 0
				},
				{
					text: '五星',
					value: 5
				},
				{
					text: '四星',
					value: 4
				},
				{
					text: '三星',
					value: 3
				},
				{
					text: '二星',
					value: 2
				},
				{
					text: '一星',
					value: 1
				}
			],
			replyIndex: '0', // 模板类型索引
			scoreIndex: '0', // 是否启用类型
			customTitle: '评价查询',
			score: '', //综合评分
			searchObj: {
				month: '',
				score: 0, // 分数
				reply: 0,
				textReply: 0,
				beginTime: '', // 开始时间
				endTime: this.$moment().format('YYYY-MM'), //结束时间
				MarketerID: '' //销售员
			},
			replyContents: '', //单独存储的回复内容
			templetTitle: '', //模板标题
			templetPopuInfo: [], //弹框（是否回复/星级评价）
			searchCommentInfo: {
				pageIndex: 1,
				pageSize: 10,
				order: 'time desc'
			},
			isLoadFinish: true,
			pageText: '我也是有底线的',
			commentInfo: [], // 评论数据
			replyModal: false, // 回复模板默认隐藏
			replyTitleModal: false, // 是否回复默认隐藏
			starScoreModal: false, // 星级评价默认隐藏
			//获取回复模板需要传的值
			templateParams: {
				pageIndex: 1,
				pageSize: 5,
				order: 'CreateOnDateTime desc',
				StoreID:JSON.parse(window.localStorage.getItem('CW.YYT.App.UserInfo')).data.data.currentStoreId,
			},
			replyTemplateInfo: [], // 回复模板数据
			templetIndex: '', // 选择回复索引
			show: false, //删除模板
			commentID: '', //待删除的id
			isBottom: false, // 页面是否触底
			rowCount: 0, //总共多少条数据
			replayInfo: {
				reply: ''
			}, //底部回复信息
			replayId: '', //回复id
			isMonthCom: false, //是否是月统计跳转
			marketerID: '', //月统计传入经理id
		};
	},
	components: {
		short,
		uniPopup,
		swIcon,
	},
	onReachBottom() {
		// console.log(this.isBottom);
		if (this.isBottom) return;
		++this.searchCommentInfo.pageIndex;
		this.getCommentInfo(this.searchCommentInfo.pageIndex);
	},
	onLoad(option) {
		// console.log(option)
		if (option.month) {
			this.searchObj.month = option.month;
			this.searchObj.MarketerID = option.MarketerID;
			this.customTitle = '评价-' + option.marketerName;
			this.isMonthCom = true;
		} else {
			this.searchObj.month = this.$moment().format('YYYY-MM');
		}
		this.getScore();
		this.getCommentInfo();
	},
	methods: {
		onBack() {
			// 返回上一页
			uni.navigateBack({
					delta:1
				});
		},
		// 关闭删除模板
		close() {
			this.$refs.popup.close();
		},
		//点击图片预览
		ImgPreviewImage(e, f) {
			uni.previewImage({
				current: e[f],
				urls: e,
				loop: true,
				indicator: 'default'
			});
		},
		//确定删除评价
		async DeleteCY56() {
			let self = this;
			let data = self.commentID;
			// let data = 123456;
			let res = await CY56.Delete(data);
			this.$refs.popup.close();
			uni.showToast({
				title: '删除成功',
				duration: 2000
			});
			let index = this._.findIndex(self.commentInfo, function(item) {
				return item.commentID == self.commentID;
			});
			self.commentInfo.splice(index, 1);
			self.rowCount -= 1;


		},
		//存储当前的回复内容
		StorageRecovery(e) {
			this.replyContents = e.detail.value;
		},
		bindDateChange() {
			this.time = e.target.value;
		},
		// 评价列表绑定的id
		forId(index) {
			return 'reply' + index;
		},
		// 获取综合评分
		async getScore() {
			let self = this;
			let data = {
				shopId: this.$storage.getAppUserInfo().currentStoreId,
				marketerID: this.searchObj.MarketerID,
				month: this.searchObj.month
			};
			let result = await CY56.GetGrade(data);
			self.score = result.average ? result.average.toFixed(1) : '';

		},
		//获取评价数据
		async getCommentInfo(pageIndex) {
			let self = this;
			let data = self.searchCommentInfo;
			data.filter = {
				type: 'and',
				conditions: [{
					attribute: 'shopId',
					datatype: 'nvarchar',
					operatoer: 'eq',
					value: this.$storage.getAppUserInfo().currentStoreId
				}]
			};
			if (this.searchObj.MarketerID && this.searchObj.MarketerID != 'store') {
				data.filter.conditions.push({
					attribute: 'MarketerID',
					datatype: 'nvarchar',
					operatoer: 'eq',
					value: this.searchObj.MarketerID
				});
			}
			data.filter.conditions.push({
				attribute: 'IsDelete',
				datatype: 'tinyint',
				operatoer: 'eq',
				value: 0
			});
			data.filter.conditions.push({
				attribute: 'time',
				datatype: 'datetime2',
				operatoer: 'ge',
				value: this.$moment(this.searchObj.month).format('YYYY-MM-DD')
			});
			data.filter.conditions.push({
				attribute: 'time',
				datatype: 'datetime2',
				operatoer: 'lt',
				value: this.$moment(this.searchObj.month)
					.add(1, 'months')
					.add('days', -1)
					.format('YYYY-MM-DD')
			});
			if (self.searchObj.reply != 0) {
				if (self.searchObj.reply == 1) {
					data.filter.conditions.push({
						attribute: 'Reply',
						datatype: 'nvarchar',
						operatoer: 'not-null',
						value: self.searchObj.reply
					});
				} else {
					data.filter.conditions.push({
						attribute: 'Reply',
						datatype: 'nvarchar',
						operatoer: 'null',
						value: self.searchObj.reply
					});
				}
			}
			if (self.searchObj.score != 0) {
				data.filter.conditions.push({
					attribute: 'score',
					datatype: 'int',
					operatoer: 'eq',
					value: self.searchObj.score
				});
			}
			if (pageIndex) {
				data.pageIndex = pageIndex;
			}
			self.isLoadFinish = false;
			let result = await CY56.GetDataPage(JSON.stringify(data));

			if (self.starScoreModal || self.replyTitleModal) {
				self.starScoreModal = false;
				self.replyTitleModal = false;
			}
			if (pageIndex == 1) {
				self.commentInfo = result.dataList;
			} else {
				self.commentInfo = this._.concat(self.commentInfo, result.dataList);
			}
			self.rowCount = result.rowCount;
			if (result.rowCount > 0) {
				if (result.rowCount == self.commentInfo.length) {
					self.isBottom = true;
					self.pageText = '';
				} else {
					self.pageText = '';
				}
				self.isLoadFinish = true;
			} else {
				self.pageText = '';
			}


		},
		// 回复评论
		repleyComment(item) {
			// console.log(item);
			item = this.$util.null2str(item);
			if (item.reply == '') {
				this.$refs.replayPopup.open();
				this.replayInfo = this._.cloneDeep(item);
			}

			// if (item.active) {
			// 	this.$set(item, 'active', false);
			// 	this.$set(item, 'textReply', '');
			// } else {
			// 	this.$set(item, 'active', true);
			// }
		},
		// 获取回复模板数据
		async getTemplateInfo() {
			let self = this;

			let result = (await CY77.GetQuickReplyFilter(self.templateParams)).result;
			if (result) {
				self.replyTemplateInfo = result.dataList;
			}


		},
		// 选择回复模板
		selectedReplyItem(item, index) {
			let self = this;
			self.replyModal = false;
			self.commentInfo.forEach(function(items, index) {
				if (index == self.templetIndex) {
					self.$set(items, 'textReply', item.replyContent);
					self.replyContents = item.replyContent;
				}
			});
		},
		// 回复模板
		replyCommentModal(index) {
			this.replyModal = true;
			this.templetIndex = index;
			this.getTemplateInfo();
		},
		// 关闭回复模板
		closeReplyBtn() {
			this.replyModal = false;
		},
		// 确定回复
		async confirmReply(item, num) {
			let self = this;
			self.replayId = item.commentID;
			if (!self.replyContents) {
				uni.showToast({
					title: '回复内容不能为空',
					icon: 'none'
				});
				return;
			} else {
				let data = {
					id: item.commentID,
					reply: self.replyContents
				};
				let result = await CY56.UpdateByDto(
					data);

				this.$refs.replayPopup.close();
				self.commentInfo.forEach(function(items, index) {
					if (items.commentID == self.replayId) {
						self.$set(items, 'reply', self.replyContents);
					}
				});
				// self.cancelReply(num);

			}
		},
		// 删除回复
		deleteComment(items) {
			let self = this;
			self.commentID = items.commentID;
			self.$refs.popup.open();
		},
		// 取消回复
		cancelReply(num) {
			let self = this;
			self.commentInfo.forEach(function(items, index) {
				if (index == num) {
					if (items.active) {
						self.$set(items, 'active', false);
						self.$set(items, 'textReply', '');
					} else {
						self.$set(items, 'active', true);
					}
				}
			});
			self.replyContents = '';
		},
		// 模板类型/是否启用
		selectedTemplet(el) {
			let self = this;
			// self.templetPopuInfo = el == 1 ? ['全部', '已回复', '未回复'] : ['全部', '五星 ', '四星', '三星', '二星', '一星'];
			// self.templetTitle = el == 1 ? '回复状态' : '星级评价';
			if (el == 1) {
				self.replyTitleModal = self.replyTitleModal == true ? false : true;
				self.starScoreModal = false;
			} else {
				self.starScoreModal = self.starScoreModal == true ? false : true;
				self.replyTitleModal = false;
			}
		},
		// 选择是否回复标题
		selectReplyTitle(index) {
			let self = this;
			self.replyIndex = index;
			self.closeReplyTitleBtn();
		},
		//关闭筛选
		closeMengBan() {
			this.starScoreModal = false;
			this.replyTitleModal = false;
		},
		//选择星级评价
		selectStarScore(index) {
			let self = this;
			self.scoreIndex = index;
			self.closeStarScoreBtn();
		},
		// 关闭是否回复标题
		closeReplyTitleBtn() {
			let self = this;
			self.replyTitleModal = false;
			self.searchObj.reply = self.replyIndex == 0 ? '0' : self.replyIndex == 1 ? '1' : '2';
			self.searchObj.score = self.scoreIndex == 0 ? '0' : self.scoreIndex;
			let title = self.replyIndex == 0 ? '全部状态' : self.replyIndex == 1 ? '已回复' : '未回复';
			self.dateShow.reply.color = true;
			self.dateShow.reply.title = title;
			self.dateShow.reply.img = 'toBottom.png';
		},
		// 关闭星级评价
		closeStarScoreBtn() {
			let self = this;
			self.starScoreModal = false;
			self.searchObj.reply = self.replyIndex == 0 ? '0' : self.replyIndex == 1 ? '1' : '2';
			self.searchObj.score = self.scoreIndex == 0 ? '0' : self.scoreIndex;
			let title =
				self.scoreIndex == 0 ?
				'全部评价' :
				self.scoreIndex == 5 ?
				'五星' :
				self.scoreIndex == 4 ?
				'四星' :
				self.scoreIndex == 3 ?
				'三星' :
				self.scoreIndex == 2 ?
				'二星' :
				'一星';
			self.dateShow.star.color = true;
			self.dateShow.star.title = title;
			self.dateShow.star.img = 'toBottom.png';
		},
		// 切换下一个月
		getNextMonth() {
			if (this.searchObj.month != this.$moment().format('YYYY-MM')) {
				let currentDate = this.searchObj.month;
				let nextMonth = this.$moment(currentDate)
					.add(1, 'months')
					.format('YYYY-MM');
				this.searchObj.month = nextMonth;
			}
		},
		// 切换上一个月
		getPreMonth() {
			let currentDate = this.searchObj.month;
			let preMonth = this.$moment(currentDate)
				.add(-1, 'months')
				.format('YYYY-MM');
			this.searchObj.month = preMonth;
		},
		// 切换某个月份
		chooseDate(e) {
			this.searchObj.month = e.target.value;
		}
	},
	// 下拉刷新
	// onPullDownRefresh(){
	//  let self =this;
	//  self.commentInfo=[];

	// 		self.getCommentInfo();
	//         uni.stopPullDownRefresh();
	//  },
	// mounted: function() {
	// 	this.getScore();
	// 	this.getCommentInfo();
	// },
	watch: {
		'searchObj.reply': {
			handler: function(val, oldval) {
				if (val !== oldval) {
					this.isBottom = false;
					this.getCommentInfo(1);
				}
			}
		},
		'searchObj.score': {
			handler: function(val, oldval) {
				if (val !== oldval) {
					this.isBottom = false;
					this.getCommentInfo(1);
				}
			}
		},
		'searchObj.month': {
			handler: function(val, oldval) {
				if (val !== oldval && oldval != '') {
					this.isBottom = false;
					this.getCommentInfo(1);
					this.getScore();
				}
			}
		}
	}
};
