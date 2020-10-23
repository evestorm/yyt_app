import uniPopup from '@/components/uni-popup/uni-popup.vue';

import banquetCue from '@/pages/banquet/banquetCue/banquetCue.vue';
import banquetOrder from '@/pages/banquet/banquetOrder/banquetOrder.vue'

import storage from '@/common/unistorage/index.js';
const app = getApp()
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// 当前选中了哪一个 默认是0
			selectIndex: 0,
			// tabbar被顶起
			windowHeight: '',
			banquetReload: {
				banquetIndex: 0, //显示 宴会线索0 宴会订单1
				banquetAuth: '' //宴会线索跟进人显示全部还是登陆人
			},
			storeId: '' ,//门店id，为了监听首页店铺的选择更改
			payload: {}, // 模拟接收的tabbar过来的参数
		};
	},
	components: {
		banquetCue,
		banquetOrder,
		uniPopup
	},
	onLoad(option) {
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
			// if (explorer.indexOf("Safari") == -1) {
			// 	if (res.size.windowHeight < this.windowHeight) {
			// 		uni.hideTabBar({});
			// 	} else {
			// 		uni.showTabBar({});
			// 	}
			// }
			// #endif
		});
		this.storeId = storage.getAppUserInfo().currentStoreId;

	},
	onShow() {
		let selectTabindex = this.selectIndex; // 默认选中为第一个
		let payload = storage.getTabBarPayload();
		// 如果从调用 tabBar 页面过来,才有payload
		if (payload) {
			this.payload = payload;
			this.banquetReload.banquetInde = this.$storage.getTabBarPayload() ? this.$storage.getTabBarPayload().tabIndex : this
				.selectIndex;
			this.banquetReload.banquetAuth = this.$storage.getTabBarPayload().dataType;
			selectTabindex = this.$storage.getTabBarPayload().tabIndex; // 传过来的要显示第几个
			//移除缓存，防止进入新增或详情页面返回时依然取缓存页面
			this.$storage.removeTabBarPayload();
		} else {
			this.banquetReload.banquetInde = 0;
			this.banquetReload.banquetAuth = '个人';
			// this.banquetReload.banquetAuth = this.$storage.getSalesAuthority().isSeeAll ? '全部' : '个人'; //判断该账户是否有查看全部权限 
		}
		this.storeId = storage.getAppUserInfo().currentStoreId;
		// 初始化选中状态 并切控制加载
		this.onactive(selectTabindex);
	},
	// onHide() {
	// 	// 隐藏左上角报表弹窗
	// 	this.$refs.reportPopup.close();
	// },
	computed: {
		//导航栏权限控制
		tabAry() {
			const {
				isShowYHClue,
				isShowYHBanquetOrder
			} = this.$storage.getSalesAuthority();
			let arr = [{
				title: '宴会线索',
				display: isShowYHClue,
				idx: 0
			}, {
				title: '宴会订单',
				display: isShowYHBanquetOrder,
				idx: 1
			}];
			arr = arr.filter(v => v.display == 1);
			this.selectIndex = this.selectIndex == 0 ? arr[0].idx + '' : this.selectIndex;
			return arr;
		},
		leftReport() {
			const {
				isShowYHClue,
				isShowYHBanquetOrder
			} = this.$storage.getSalesAuthority();
			let reportList = [{
					text: '线索报表',
					isShow: isShowYHClue,
					url: `/pages/banquetSub/orderReport/orderReport`,
					icon: 'https://pic.cwyyt.cn/upload/img/20200420/1023502350_clusReport.png',
				},
				{
					text: '宴会报表',
					isShow: isShowYHBanquetOrder,
					url: `/pages/banquetSub/banquetReport/banquetReport`,
					icon: 'https://pic.cwyyt.cn/upload/img/20200420/1024462446_banquetReport.png',
				},
				{
					text: '任务报表',
					isShow: isShowYHBanquetOrder,
					url: `/pages/banquetSub/taskReport/taskReport`,
					icon: 'https://pic.cwyyt.cn/upload/img/20200420/1025292529_taskReport.png',
				},
				{
					text: '宴会排班',
					isShow: isShowYHBanquetOrder,
					url: `/pages/banquetSub/banquetPlan/banquetPlan`,
					icon: 'https://pic.cwyyt.cn/upload/img/20200420/1026222622_banquetschedule.png',
				},
			]
			reportList = reportList.filter(v => v.isShow == 1);
			return reportList
		},
		banquetAuthChange() {
			return this.banquetAuth;
		}
	},
	methods: {
		// 点击tab事件
		addBanquetCue() { //新增宴会线索
			uni.navigateTo({
				url: '/pages/banquetSub/addBanquetInfo/addBanquetInfo'
			});
			this.$refs.morePopup.close();
		},
		addBanquetOrder() { //新增宴会订单
			uni.navigateTo({
				url: '/pages/banquetSub/addBanquetOrder/addBanquetOrder'
			});
			this.$refs.morePopup.close();
		},
		digBanquetClues() {
			uni.navigateTo({
				url: '/pages/banquetSub/digBanquetClues/digBanquetClues'
			})
			this.$refs.morePopup.close();
		},
		// tab改变时候选中
		onactive(data) {
			// 说明是要加载线索数据
			if (!getApp().globalData.banquetPageData.isLoadLead && data == 0) {
				getApp().globalData.banquetPageData.isLoadLead = true;
				// 改变进入才需要刷新,控制第一次进入刷新
				if (this.selectIndex != data) {
					uni.$emit('reloadPage', 'refresh'); // 刷新线索列表
				}
			}
			
			// 说明要加载宴会单数据
			if (!getApp().globalData.banquetPageData.isLoadOrder && data == 1) {
				getApp().globalData.banquetPageData.isLoadOrder = true;
				// 改变进入才需要刷新,控制第一次进入刷新
				if (this.selectIndex != data) {
					uni.$emit('reloadPageOrder', 'refresh');
				}
			}
			
			this.$nextTick(() => { //计算线索额订单mescroll高度
				this.$refs.banquetCue && (this.$refs.banquetCue.calcMescrollTop());
				this.$refs.banquetOrder && (this.$refs.banquetOrder.calcMescrollTop());
			});

			this.selectIndex = data;
			//缓存isactive显示宴会线索还是宴会订单
			storage.setBanquetActive(data);
		},
		//跳转至新增宴会线索页面
		goAddBanquet() {
			this.$refs.morePopup.open();
		},
		// ------------------ 导航栏左上角跳转 -------------
		// // 左上角报表类弹窗显示
		// showReport() {
		// 	this.$refs.reportPopup.open();
		// },
	},
	watch: {
		storeId: {
			handler: function(val) {
				this.storeId = val;
			}
		}
	},
};
