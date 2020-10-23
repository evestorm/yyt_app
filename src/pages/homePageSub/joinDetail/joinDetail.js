// 作者:杨亮

//------------------------------mock数据引入---------------------------
import joinDetailMock from './joinDetail_mock.js';

//------------------------------组件引入-------------------------------
import taskCard from './taskCard/taskCard.vue';
import chatBubbles from './chatBubbles/chatBubbles.vue';
import submitMsg from './submitMsg/submitMsg.vue';


//-------------------------Service引入----------------------------------
import CY17 from '@/service/CY/CY17AppService.js';
import XTTask from '@/service/XT/XTTaskAppService.js';
import XTTaskOrder from '@/service/XT/XTTaskOrderAppService.js';
import XTTaskFollow from '@/service/XT/XTTaskFollowAppService.js';
import XTTaskReply from '@/service/XT/XTTaskReplyAppService.js';
import CY61 from '@/service/CY/CY61AppService.js';

// joinRefresh()
import yytPopupCenter from '@/components/yyt-popup-center/yyt-popup-center';

export default {
	// 组件放在data前面
	components: {
		taskCard, // 任务详情卡片
		chatBubbles, // 气泡聊天item
		submitMsg, // 消息提交
	},
	data() {
		return {
			// --------------------------------------页面参数---------------------------
			urlOption: {
				id: '1', // 任务详情参数
				type: '10', // 10每日预订 20 每月跟踪
				month: 1, // 查询的月份
			}, // url参数
			taskDetail: {}, // 任务详情信息
			chatList: [], // 聊天记录
			selfFollowData: {
				waitFollowCount: 0, // 待跟踪数量
				alreadyFollowCount: 0, // 已跟踪数量
				cancleFollowCount: 0, // 取消跟踪数量
			}, // 个人跟踪详情
			userInfo: this.$storage.getAppUserInfo(), // 登录人信息

			scrollTop: 0,
			old: {
				scrollTop: 0
			}
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.urlOption = options;
		// this.taskDetail = joinDetailMock.taskDetail;
		this.chatList = joinDetailMock.chatList;
		this.reqData();

		uni.$on('onInput', () => {
			this.onInput();
		});
	},
	methods: {
		scroll(e) {
			this.old.scrollTop = e.detail.scrollTop;
		},
		goTop: function(e) {
			this.scrollTop = this.old.scrollTop
			this.$nextTick(function() {
				this.scrollTop = 0
			});
		},
		// 刷新页面
		refresh() {
			this.reqData();
			uni.$emit('joinRefresh');
		},
		// 请求详情数据
		async reqData() {
			const data = {
				id: this.urlOption.id || 'c4a5f8a0-6dea-4fba-af96-08d855fdd6e3',
				marketerId: this.userInfo.marketerId,
				storeId: this.userInfo.currentStoreId,
			};

			let result = await XTTask.GetXTTaskDetail(data);
			if (result) {
				console.log(result);
				this.taskDetail = result;
			}
		},
		// 确认
		onConfirm() {
			// 实例化组件
			const confirmPopup = this.$create(yytPopupCenter, {
				title: "提示",
				desc: "确认后无法撤销，是否确认？",
				success: async () => { // 成功回调
					const data = {
						taskGUID: this.urlOption.id,
						isConfrimeOrder: 1,
						marketerID: this.userInfo.marketerId
					};
					const res = await XTTaskOrder.UpdateByDto(data);
					// 更新数据
					if (res) {
						this.refresh();
					}
				},
				cancel: () => { // 失败回调
					console.log('取消了')
				}
			});
			// 打开
			confirmPopup.open();
		},
		// 获取自己的跟踪详情，然后上报
		async report() {
			const data = {
				marketerId: this.userInfo.marketerId, // 客户经理id
				storeId: this.userInfo.currentStoreId, // 门店id
				month: this.urlOption.month, // 传过来的要查询的月份
			};
			const res = await CY61.GetCurrMonthMyTrackStat(data);
			if (res) {
				this.selfFollowData = res;
				const {
					waitFollowCount,
					alreadyFollowCount,
					cancleFollowCount
				} = this.selfFollowData;
				// 实例化组件
				const confirmPopup = this.$create(yytPopupCenter, {
					title: "提示",
					desc: `你的${this.urlOption.month}月跟踪情况：待跟${waitFollowCount} 已跟${alreadyFollowCount} 取消${cancleFollowCount} 确认上报吗？`,
					success: async () => { // 成功回调
						const data = {
							taskGUID: this.urlOption.id, // 主键
							marketerID: this.userInfo.marketerId, // 客户经理id
							waitFollowCount, // 待跟踪数量
							alreadyFollowCount, // 已跟踪数量
							cancleFollowCount, // 取消跟踪数量
						};
						const res = await XTTaskFollow.UpdateByDto(data);
						// 更新数据
						if (res) {
							this.refresh();
						}
					},
					cancel: () => { // 失败回调
						console.log('取消了')
					}
				});
				// 打开
				confirmPopup.open();

				// this.$refs.followPopup.open();
			} else {
				this.$cw.showError(`获取您的${month}月跟踪情况失败，请稍后重试`);
			}
		},
		// 查看报表
		gotoReport() {
			console.log('查看报表');
			uni.navigateTo({
				url: '/pages/homePageSub/bookReport/bookReport'
			});
		},
		// 发送评价
		async onSendAMsg(msg) {
			console.log(msg);
			if (!msg) {
				this.$cw.showError('评价不能为空');
				return;
			};
			const data = {
				taskReplyName: this.userInfo.userName, // 回复人姓名
				isReplyMessage: 1, // 是否为回复
				replyContent: msg, // 回复内容
				taskGUID: this.urlOption.id, // 任务id
				marketId: this.userInfo.marketerId || this.$storage.getAppUserInfo().marketerId, // 客户经理id
			};
			const res = await XTTaskReply.CreateByDto(data);
			if (res) {
				uni.showToast({
					title: '评价成功！'
				});
				this.$refs.submitMsg.content = '';
				this.refresh();
			}
		},
		onInput() {
			// console.log(content, autoHeight);
			setTimeout(() => {
				let bottomWrapperRefRect = this.$refs.bottomWrapper.$el.getBoundingClientRect();
				this.$refs.joinDetail.$el.style.paddingBottom = bottomWrapperRefRect.height + 'px';
			}, 50);
		},
	},
	computed: {

	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {

		//        }
		//    }
		// }
	}
};
