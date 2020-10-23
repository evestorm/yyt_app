// 三方插件
import uniPopup from '@/components/uni-popup/uni-popup.vue';

// 页面组件
import customFollow from './customFollow/customFollow.vue';
import customList from './customList/customList.vue';

import cw from '@/common/ceiwei/common.js';
import moment from '@/lib/moment/moment.min.js';
import storage from '@/common/unistorage/index.js';

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

import CY61 from '@/service/CY/CY61AppService.js'; // 刷新跟踪机会
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			payload: {}, // 模拟接收的tabbar过来的参数
			isactive: 0, // 切换页面
			isShowMore: false, // 默认不显示右上角弹出的更多菜单
			// 【刷新跟踪机会】默认时间及范围限定
			startYear: '',
			endYear: '',
			defaultYear: [], // 数组形式

			windowHeight: '', // tabbar被顶起
			salesAuthority: storage.getSalesAuthority(), //权限
			// customerkey:1,
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
		}),
		ttl() {
			const {
				isCustomerTrack,
				isShowCstList
			} = storage.getSalesAuthority();
			let arr = [{
				title: '客户列表',
				display: isShowCstList,
				idx: 0
			}, {
				title: '客户跟踪',
				display: isCustomerTrack,
				idx: 1
			}];
			arr = arr.filter(v => v.display == 1);
			this.isactive = this.isactive == 0 ? arr[0].idx + '' : this.isactive;
			return arr;
		}
	},
	onLoad(option) {

		// 监听客户详情点击返回时,刷新列表页
		uni.$on('the-list-should-be-refreshed', data => {
			if (data.fromPage == 'follow-list') { // 从客户跟踪来
				this.$refs.followList && (this.$refs.followList.refresh());
			} else if (data.fromPage == 'customer-list') { // 从客户列表来
				this.$refs.customList && (this.$refs.customList.refresh());
			}
		});
		// 刷新跟踪机会picker的时间初始化
		this.initTimePicker();
		// 初始化选中状态 并切控制加载
		// 从未打开过客户tab时，从首页的顶部快速导航过来
		let payload = storage.getTabBarPayload();
		if (payload) {
			this.isactive = payload.tabIndex;
			this.payload = payload;
		}
		this.onactive(this.isactive);

		this.chgToolBar();
	},
	onShow() {
		let payload = storage.getTabBarPayload();
		// 如果从调用 tabBar 页面过来,才有payload
		if (payload) {
			this.isactive = payload.tabIndex;
			storage.setTabBarPayload();
			this.payload = payload;
			this.onactive(this.isactive);
		}
	},
	components: {
		customFollow, // 客户跟踪
		customList, // 客户列表
		uniPopup,
	},
	methods: {
		...mapMutations(['setCurrentTagsObj', 'setCurrentCompanyObj', 'setCustomerTab']),

		// 监听页面隐藏展示toolbar 用于解决input 获取焦点 被顶起的问题
		chgToolBar() {
			// 监听键盘弹起导致的resiez事件
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight;
				}
			});
			uni.onWindowResize(res => {
				// #ifndef H5
				// let explorer = window.navigator.userAgent;
				// // 苹果下面不联动
				// if(explorer.indexOf("Safari")== -1){
				// 	if (res.size.windowHeight < this.windowHeight) {
				// 		uni.hideTabBar({});
				// 	} else {
				// 		uni.showTabBar({});
				// 	}
				// }
				// #endif
			});
		},
		// 切换页面
		onactive(data) {
			// 说明要加载客户列表
			if (!getApp().globalData.customerPageData.isLoadList && data == 0) {
				getApp().globalData.customerPageData.isLoadList = true;
				// 改变进入才需要刷新,控制第一次进入刷新
				if (this.isactive != data) {
					this.$refs.customList && (this.$refs.customList.refresh());
				}
			}

			// 说明是要加载客户跟踪
			if (!getApp().globalData.customerPageData.isLoadFollow && data == 1) {
				getApp().globalData.customerPageData.isLoadFollow = true;
				// 改变进入才需要刷新,控制第一次进入刷新
				if (this.isactive != data) {
					this.$refs.followList && (this.$refs.followList.refresh());
				}
			}

			// 刷新客户顶部高度 刷新客户跟踪顶部高度
			setTimeout(() => {
				this.$refs.customList && (this.$refs.customList.calcMescrollTop());
				this.$refs.followList && (this.$refs.followList.calcMescrollTop());
			}, 500);

			this.isactive = data;
			this.setCustomerTab(data);
		},
		//初始化picker时间范围
		initTimePicker() {
			// exp: 2019-11 => [2019, 11]
			let now = moment().format('YYYY-MM').split('-');
			this.startYear = parseInt(now[0]) - 6;
			this.endYear = parseInt(now[0]) + 6;
			this.defaultYear = now; // 数组形式
		},
		// 确定了年份选择
		async onConfirmYear(e) {
			// e:
			// 	checkArr: ["2022", "11"]
			// 	result: "2022-11"
			// console.log(e);
			const chooseDate = e.result;
			const data = {
				month: chooseDate,
				storeId: storage.getAppUserInfo().currentStoreId,
				cwCompanyId: storage.getAppUserInfo().cwCompanyID
			};
			let result = await CY61.CalculaSalesForecast(data);
			// console.log(result);
			let info = result;
			if (info) {
				this.$refs.followList.refresh();
				var text = '环比上升' + info.chainRelativePercentage ;
				if (info.chainRelativePercentage < 0) {
					text = '环比下降' + info.chainRelativePercentage * -1 ;
				}
				text=text+'%';
				uni.showModal({
					content: `客户池新增${info.addpeople || 0}人，减少${info.decreasepeople || 0}人，达到${info.reachpeople || 0}人，${text}；${info.month ? info.month.slice(5, 7) : '?'}月A类${info.alevel || 0}人，B类${info.blevel || 0}人，C类${info.clevel || 0}人。`
				});
			}

		},
		// navbar右上角弹出{更多}菜单
		showMore() {
			this.$refs.morePopup.open();
		},
		// 添加客户
		addCustomer() {
			this.$refs.morePopup.close();
			uni.navigateTo({
				url: '/pages/_common/addCustomerInfo/addCustomerInfo',
			})
		},
		//群发信息
		sendMsgAll() {
			this.$util.baiduEvent('发短信', '客户页顶部群发短信');
			this.$refs.morePopup.close();
			uni.navigateTo({
				url: '/pages/customerSub/sendMsg/sendMsg',
			})
		},
		// // 设置跟踪清单
		// setTraceList() {
		// 	this.$refs.morePopup.close();
		// 	uni.navigateTo({
		// 		url: '/pages/_common/setFollowList/setFollowList',
		// 	})
		// },
		// 点击刷新跟踪机会
		refreshTraceOpt() {
			this.$refs.morePopup.close();
			this.$refs.yearMonth.show();
		},
		// 标签管理
		labelManagement() {
			this.$refs.morePopup.close();
			uni.navigateTo({
				url: '/pages/customerSub/labelManagement/labelManagement',
			})
		},
		// 隐藏客户列表的下拉框+遮罩
		hideMask() {
			this.$refs.customList && this.$refs.customList.hideDropdownAndMask();
		},
	},
	watch: {
		"userInfo.currentStoreId": {
			handler: function(val, oldval) {
				if (val) {
					// 重新获取客户经理列表和客户跟踪列表
					this.$refs.followList && (this.$refs.followList.CustomFollowQuery.storeId = val);
					this.$refs.customList && (this.$refs.customList.customerListQuery.storeId = val);
				}
			},
		},
	}
};
