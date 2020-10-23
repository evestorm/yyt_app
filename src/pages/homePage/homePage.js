// 作者:杨亮

//------------------------------mock数据引入---------------------------
import homePageMock from './homePage_mock.js';

//------------------------------组件引入-------------------------------
import overview from './overview/overview.vue';
import gridMenu from './gridMenu/gridMenu.vue';
import reminder from './reminder/reminder.vue';

//-------------------------Service引入----------------------------------
import CY17 from '@/service/CY/CY17AppService.js'; // 更新当前人销售员的默认门店的ID
import UR01 from '@/service/UR/UR01AppService.js'; // 获取运营数据
import CY61 from '@/service/CY/CY61AppService.js'; // 刷新跟踪机会
import YHClue from '@/service/YH/YHClueAppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';
import moment from '@/lib/moment/moment.min.js';

// 常量
let PageConstData = {
	userInfo: storage.getAppUserInfo(), // 当前登陆人信息
	app: getApp(), // 全局app信息
	moduleEnum: { // 运营板块枚举类型
		reserve: '预订情况',
		customer: '客户情况',
		banquet: '宴会情况',
		marketing: '营销情况'
	},
	colorList: ['#FCB8A1', '#5294FA', '#73DEB3', '#fbc2eb', '#fda085', '#8fd3f4'], // 图表颜色
}

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

export default {
	// 组件放在data前面
	components: {
		overview, // 首页概况
		gridMenu, // 入口菜单
		reminder, // 提醒
	},
	data() {
		return {
			//---------------------常量------------------------
			PageConstData,
			picDomain: PageConstData.app.globalData.PicDomain,
			bookSelectType: '昨日', // 预订选中的状态 三种 昨日 今日 一个月内 默认是昨日
			dataType: '个人', // 默认展示个人所有数据, 两种:个人,全部
			//---------------------接口输入输出 接口名称+in/out 命名 列如接口名称是getStudentList----------------------

			getHomeDetailOut: {}, // 获取首页数据

			getOverViewDataIn: { // 顶部运营组件请求参数
				code: -1, // 运营code
				isGetAll: 0, // 0:个人 1:全店
				marketerID: this.$storage.getAppUserInfo().marketerId,
				storeID: this.$storage.getAppUserInfo().currentStoreId,
			},

			getOverViewDataOut: {}, // 顶部运营组件数据

			cacheOverViewData: {}, // 缓存运营数据

			// --------------------------------------页面参数---------------------------

			// 导航栏参数
			tabNavSelected: { // 当前选中导航
				name: null,
				code: null,
			},
			tabNavScrollLeft: 0, // 顶部tab的x轴偏移
			isShow: false, // 首页是否显示,解决在「我的页面」切换门店后，返回首页顶部运营的echarts图表为白板问题

			urlOption: {}, // url参数

			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: false, // 是否启用上拉加载; 默认true
				onScroll: true,
			},
			mescrollTopY: '44', // mescroll顶部距离页面顶部的距离
			mescrollSingle: null, // 刷新实例

			// 【刷新跟踪机会】默认时间及范围限定
			dateRange: { //picker组件选择时间范围
				startDate: this.$moment().subtract(10, 'years').format('YYYY'), //开始时间
				endDate: this.$moment().add(10, 'years').format('YYYY'), //结束时间
				defaultDateRangeArr: this.$moment().format('YYYY-MM').split('-'),
			},
			homePageAuth: { //首页/tab控制的权限
				isTodayScheduled: '', //是否有查看今日预订权限
				isMonthlyStatistics: '', //是否有查看月统计权限
				// isShowHome: '', //是否显示首页
				isShowTrackTop: '', //是否显示跟踪排行
				isShowYHClue: '', //是否显示宴会线索
				isShowYHBanquetOrder: '', //是否显示宴会单
				isShowCstList: '', //是否显示客户列表
				isShowCY57Track: '', //是否显示设置跟踪清单 
				isCustomerTrack: '', //是否有客户跟踪权限
				// isShowBookOrder: '', //是否显示预订单 
				isCompleteTarget: '', //是否有查看完成目标权限
				isShowCustomerPool: '', //客户池
				isRefreshTrace: '', //是否有刷新跟踪机会权限
				isViewComments: '', //是否有查看评论权限
				isUploadCallRecords: '', //是否查看上传通话记录
				isShowCompleteTarget: '', //是否显示完成目标
			},
			scrollTop: 0, // 吸顶距离
		}
	},
	computed: {
		...mapState(['storeData', 'hasLogin']),
		...mapState({
			// 顶部快速菜单列表
			menuList: state => {
				// return state.user.userInfo.appInJson.configs.filter(v => v.isOpen == '1').slice(0, 6);
				// return state.user.userInfo.appInJson.configs.filter(v => v.isOpen == '1');

				let configs = state.user.userInfo.appInJson.configs.sort((a, b) => {
					return Number(b.isOpen) - Number(a.isOpen)
				});
				let isOpens = configs.filter(v => v.isOpen == 1).sort((a, b) => Number(a.sort) - Number(b.sort));
				let isUnOpens = configs.filter(v => v.isOpen == 0).sort((a, b) => Number(a.sort) - Number(b.sort));
				let concat = [...isOpens];
				return concat;
			},
			// 运营板块列表
			operateList: state => {
				return state.user.userInfo.userHomeConfig.configs
			},
			// 提醒
			noticeList: state => {
				return state.user.userInfo.userHomeConfig.noticeConfigs
			},
			notificationCount: state => { //右上角 角标
				return state.user.userInfo.notificationCount
			},
			userInfo: state => state.user.userInfo
		}),
		calcTabNavigatorArr() { // 计算顶部导航
			// 首页数据发生变化，就会重新计算 calcTabNavigatorArr
			let tabNavigatorArr = this.operateList;
			let tabNarArr = this._.cloneDeep(tabNavigatorArr);
			let data = this._(tabNarArr).chain()
				.map((x, idx) => ({
					...x,
					idx,
					selected: x.code == this.tabNavSelected.code, // 是否选中
					isGetAll: this.getOverViewDataIn.isGetAll, // 是否获取全店
				})).value();
			// 如果数组长度大于0，且原始数据没有为true的项，设置第一项高亮
			if (data.length > 0 && !data.some(v => v.selected)) {
				data[0].selected = true;
				// TODO: data.id到时候要替换成dataType
				this.getOverViewDataIn.code = data[0].code;
			}
			return data;
		},
		calcUserInfo() {
			return this._.cloneDeep(this.userInfo);
		},
		// 当前跳转传参
		currentJumpParams() {
			return function(isObj = false) {
				// console.log(this.dataType);
				let type = this.dataType;
				if (isObj == true) {
					return {
						dataType: type
					}
				} else {
					return `?dataType=${type}`;
				}
			}
		},
	},
	onShow() {
		this.isShow = true;
	},
	onHide() {
		this.isShow = false;
	},
	async onLoad() {
		this.authChangeTab();
		// 如果是手机端嵌壳访问那么需要设置手机端AppId并且上传通话记录
		if (this.$cw.isApp(false)) {
			const userId = storage.getAppUserId();
			this.$cw.setLoginUser(userId); // 设置手机APPID
			if (this.$cw.isAndroid()) {
				let beginDate = this.$moment(new Date())
					.subtract(2, 'weeks')
					.format('YYYY-MM-DD HH:mm:ss');
				this.$cw.getPhoneCallResult(beginDate);
				this.$cw.uploadCall(); //上传通话记录
			}
		}
		// 根据本地是否有userId判断当前用户是否登录
		let userId = storage.getAppUserId();
		if (!userId) {
			// debugger
			cw.logout();
			return;
		} else {
			let isLoad = getApp().globalData.homePageData.isLoad;
			// 解决登陆后，杀死程序再进来没有重新获取首页数据bug
			if (!isLoad) {
				getApp().globalData.homePageData.isLoad = true;
				this.getHomeDetail();
			}
		}
		// 有则获取用户详细信息
		this.getUserInfo(() => {
			// 底部watch userInfo.currentStoreId 时,会调用下面注释的代码
			this.getStores();
		});

		// 刷新跟踪机会picker的时间初始化
		// this.initTimePicker();

		//刷新右上角角标
	},
	mounted() {
		// 监听是否要切换门店
		uni.$on('change-store', (item) => {
			this.chgStore(item, item.cb);
		});
		uni.$on('homePageRefresh', () => {
			this.downCallback(this.mescrollSingle);
		});
	},
	methods: {
		...mapMutations([
			'setUserInfo', 'setStoreInfo', 'setSalesAuthority', 'setStoreData',
			'setCustomerTab', 'setReserveTab',
			'setChooseMarketData', 'setAllChooseMarketData', 'setReserveTab',
		]),
		...mapActions(['getSwOptions']),
		...mapActions(['login', 'getCurrentUser', 'getSalesAuthority', 'getMarketData']),
		mescrollInit(mescroll) {
			this.mescrollSingle = mescroll;
		},
		// ------------------ 请求顶部overview数据 -----------------
		async reqOverView() {
			let params = this.getOverViewDataIn;
			let data = await UR01.GetHomeOperateDetail(params);
			if (data) {
				this.getOverViewDataOut = data;
				this.setCacheOverViewData();
			}
		},
		// --------------- navBar 左右弹窗 start -------------------------
		tabNavSelect(code) {
			this.calcTabNavigatorArr.forEach(v => v.selected = false);
			let find = this.calcTabNavigatorArr.find(v => v.code == code);
			find.selected = true;
			this.tabNavSelected = {
				...find,
			}

			this.getOverViewDataIn.isGetAll = this.cacheOverViewData[find.name].isGetAll;
			this.getOverViewDataIn.code = find.code;
		},
		changeOverViewData(isGetAll) { // 切换个人/全部
			let find = this.calcTabNavigatorArr.find(v => v.selected);
			find.isGetAll = isGetAll;
			this.getOverViewDataIn.isGetAll = find.isGetAll;
			// debugger
		},
		seeMore(curTabNav) { // 查看更多
			console.log(curTabNav);
			this.overviewNavigateTo(curTabNav.name);
		},
		/**
		 * @description 运营板块跳转页面
		 * @param {Object} name 运营板块名称
		 */
		overviewNavigateTo(name) {
			var overview = {
				[this.PageConstData.moduleEnum.reserve]: () => {
					// 预订报表
					uni.navigateTo({
						url: `/pages/homePageSub/bookReport/bookReport?activeIdx=0`
					});
				},
				[this.PageConstData.moduleEnum.customer]: () => {
					// 月统计
					uni.navigateTo({
						url: `/pages/homePageSub/monthSummary/monthSummary`
					});
				},
				[this.PageConstData.moduleEnum.banquet]: () => {
					// 宴会报表
					uni.navigateTo({
						url: `/pages/banquetSub/banquetReport/banquetReport`
					});
				},
				[this.PageConstData.moduleEnum.marketing]: () => {
					// 分享码数据
					uni.navigateTo({
						url: `/pages/mySub/shareCodeReport/shareCodeReport`
					})
				},
			};
			// debugger
			return overview[name]();
		},
		// 去月统计
		goYueTongJi() {
			uni.navigateTo({
				url: '/pages/homePageSub/monthSummary/monthSummary'
			});
			this.$refs.reportPopup.close();
		},
		// 去跟踪排行
		goGenZongPaiHang() {
			uni.navigateTo({
				url: '/pages/homePageSub/trackList/trackList'
			});
			this.$refs.reportPopup.close();
		},
		// 右上角门店选择的弹窗显示
		showMore() {
			this.$refs.morePopup.open();
		},
		// 门店切换
		async chgStore(item, cb = null) {
			if (!item) return;
			if (item.storeId != this.userInfo.currentStoreId) {
				let res = await YHClue.GetClueSourceOfSearch({
					storeId: item.storeId
				});
				this.$storage.setBanquetMarketers(res.clueOfMarketers);
				// uni.setStorage({ //缓存跟进人
				// 	key: 'marketers',
				// 	data: res.clueOfMarketers
				// })
				// console.log(item);
				// 更新 userInfo 中的当前所处门店信息
				getApp().globalData.isLogin = false;
				var userInfo = storage.getAppUserInfo();
				userInfo.currentStoreName = item.branchName;
				userInfo.currentStoreId = item.storeId;

				// 更新本地和vuex的 userInfo
				storage.setAppUserInfo(userInfo);
				this.setUserInfo(userInfo);

				// 更新当前人销售员的默认门店的ID
				var data = {
					id: userInfo.marketerId,
					defaultStoreID: item.storeId
				};
				await CY17.UpdateByDto(data);

				// 切换门店后再重新获取一次用户在当前门店所拥有的的权限,客户经理列表以及首页数据
				this.getMarketData();
				// this.getSalesAuthority();
				// console.log("切换门店");
				await this.getHomeDetail(() => {
					this.cacheOverViewData = {};
					if (this.calcTabNavigatorArr.length > 0) {
						let find = this.calcTabNavigatorArr.find(v => v.selected);
						this.tabNavSelected = {
							name: find.name,
							code: find.code,
						};
						let data = {
							code: this.calcTabNavigatorArr[0].code, // 运营code
							isGetAll: 0, // 0:个人 1:全店
							marketerID: this.$storage.getAppUserInfo().marketerId,
							storeID: this.$storage.getAppUserInfo().currentStoreId,
						}
						this.getOverViewDataIn = data;
					}
				});
				// 执行回调
				cb && cb();
			} else {
				cb && cb();
			}
			this.$refs.morePopup.close();
		},

		// 缓存顶部数据（getOverViewDataOut变化后调用）
		/**
		 * @description 缓存顶部数据
		 * @param {Boolean} 是否重置数据
		 */
		setCacheOverViewData() {
			// {
			// 	'客户情况': {
			// 		all: {
			// 			data: null,
			// 			overview: null,
			// 		},
			// 		self: {
			// 			data: null,
			// 			overview: null
			// 		}
			// 	}
			// }

			if (JSON.stringify(this.cacheOverViewData) == '{}') {
				// debugger
				// 首页导航数据变化，重新缓存
				this.cacheOverViewData = this.calcTabNavigatorArr.reduce((acc, cur) => {
					acc[cur.name] = {
						self: {
							overview: null,
							data: null,
						},
						all: {
							overview: null,
							data: null,
						},
						isGetAll: 0,
					};
					return acc;
				}, {});
			}
			let find = this.calcTabNavigatorArr.find(v => v.selected);
			for (const [key, value] of Object.entries(this.cacheOverViewData)) {
				if (find.name == key) { // '预订情况' == '预订情况'
					if (find.isGetAll) { // 全部
						value.isGetAll = this.getOverViewDataIn.isGetAll;
						value.all = this.getOverView(find.name, value.all);
					} else if (!find.isGetAll) { // 个人
						value.isGetAll = this.getOverViewDataIn.isGetAll;
						value.self = this.getOverView(find.name, value.self);
					}
				}
			}
		},

		// 是否需要更新运营板块数据
		shouldUpdateCacheOverviewData(find) {
			let cacheObj = this.cacheOverViewData[find.name];
			let isGetAll = find.isGetAll || 0;
			if (!cacheObj) return true;
			if (isGetAll) { // 全部
				cacheObj.isGetAll = isGetAll;
				return !cacheObj.all.data;
			} else if (!isGetAll) { // 个人
				cacheObj.isGetAll = isGetAll;
				return !cacheObj.self.data;
			}
			return true;
		},

		/**
		 * @param {Object} name 运营板块名称
		 * @param {Object} oldData 旧的数据
		 */
		getOverView(name, oldData) {
			var overview = {
				[this.PageConstData.moduleEnum.reserve]: () => {
					let {
						appBookOrderConfig
					} = this.getOverViewDataOut;
					let data = this._.cloneDeep(appBookOrderConfig);
					data.chartStats.forEach((v, idx) => {
						v.color = this.PageConstData.colorList[idx];
					});
					let isIosApp = this.$cw.isiOS(); // IOS会有空行的问题 所以在IOS做了特殊处理
					if (JSON.stringify(oldData) != JSON.stringify(data)) { // 不等
						return {
							data: this._(data.chartStats).chain()
								.map(x => ({
									name: x.name || '',
									proportion: x.per || 0,
									value: x.value || 0,
									desc: `{e|${x.name}}  {e|¥${this.$options.filters['formatMoney'](x.value)+ (isIosApp?'   ':'')}}{e|${x.extValue?'/'+x.extValue+'桌':''}}  {e|(${x.per})}`,
									color: x.color,
								})).value(),
							overview: {
								...data
							}
						};
					} else { // 相等
						return oldData;
					}
				},
				[this.PageConstData.moduleEnum.customer]: () => {
					let {
						appHomeCstConfig
					} = this.getOverViewDataOut;
					let data = this._.cloneDeep(appHomeCstConfig);
					data.chartStats.forEach((v, idx) => {
						v.color = this.PageConstData.colorList[idx];
					});

					if (JSON.stringify(oldData) != JSON.stringify(data)) { // 不等
						return {
							data: this._(data.chartStats).chain()
								.map(x => ({
									name: x.name || '',
									proportion: x.per || 0,
									value: x.value || 0,
									desc: `{e|${x.name}}   {e|${x.value}人}   {e|(${x.per})}`,
									color: x.color,
								})).value(),
							overview: {
								...data,
							}
						}
					} else {
						return oldData;
					}
				},
				[this.PageConstData.moduleEnum.banquet]: () => {
					let {
						appBanquetConfig
					} = this.getOverViewDataOut;
					let data = this._.cloneDeep(appBanquetConfig);
					if (JSON.stringify(oldData) != JSON.stringify(data)) { // 不等
						return {
							data: this._(data.chartStats).chain()
								.map(x => ({
									typeName: x.name || '',
									typeCount: x.value || 0,
								})).value(),
							overview: {
								...data
							}
						};
					} else { // 相等
						return oldData;
					}
				},
				[this.PageConstData.moduleEnum.marketing]: () => {
					let {
						appMarketingConfig
					} = this.getOverViewDataOut;
					let data = this._.cloneDeep(appMarketingConfig);
					if (JSON.stringify(oldData) != JSON.stringify(data)) { // 不等
						return {
							data: {
								visitCount: data.visitCount, // 访问次数
								visitPeople: data.visitPeople, // 访问人数
							},
							overview: {
								...data
							}
						};
					} else { // 相等
						return oldData;
					}
				},
			};
			// debugger
			return overview[name]();
		},


		// --------------- navBar 左右弹窗 end -------------------------

		// 获取当前用户信息
		getUserInfo(cb) {
			let userInfo = storage.getAppUserInfo();
			this.setUserInfo(userInfo);
			cb && cb();
		},
		// 获取门店信息
		getStores() {
			let result = storage.getStoreData();
			// console.log(result);
			this.setStoreData(result);
			this.checkCanViewStore();
		},
		// 检查用户能否查看至少一个门店信息,如果没权限查看则登出
		checkCanViewStore() {
			var self = this;
			// 看当前客户经理门店是否存在
			var userInfo = storage.getAppUserInfo();
			if (userInfo) {
				// 如果当前用户没权查看任何一个门店,则直接登出
				var isExists = self._.some(self.storeData, function(item, index, lst) {
					// console.log(item.storeId, userInfo.currentStoreId)
					return item.storeId == userInfo.currentStoreId;
				})
				if (!isExists) {
					self.logoOut();
				}
			}
		},
		// ---------------- 下拉刷新请求逻辑 -------------------
		async downCallback(mescroll) {
			try {
				// 刷新首页
				await this.getSwOptions({
					// isGetAll: getApp().globalData.isGetAll
				});
				// 刷新顶部navbar
				this.reqOverView();
				this.authChangeTab(); //重新获取权限
				// 成功隐藏下拉加载状态
				mescroll.endSuccess();
			} catch (e) {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// mescroll的scroll滚动
		onScroll(mescroll) {},
		// 首页配置及其板块顺序信息
		async getHomeDetail(cb) {
			console.log("getHomeDetail被调用");
			let {
				saleAuthority,
			} = await this.getSwOptions({
				// isGetAll: getApp().globalData.isGetAll
			});
			this.authChangeTab();
			cb && cb();
			return saleAuthority;
		},
		authChangeTab() { //更新权限后 更新页面和tab
			//调试style隐藏tab 可行 但是会最先出现所有tabbar 然后再进行隐藏
			this.homePageAuth = this.$storage.getSalesAuthority();
			console.log('首页获取权限：', this.homePageAuth)
			//-----------------------------------------控制Tab的显示--------------------------------------
			//客户
			if (this.homePageAuth.isShowCstList == 0 && this.homePageAuth.isCustomerTrack == 0) {
				let CuTab = document.querySelector('.uni-tabbar__item:nth-child(3)').style;
				this.$nextTick(() => {
					CuTab.display = 'none'
				})
			} else {
				document.querySelector('.uni-tabbar__item:nth-child(3)').style.display = 'block';
			}
			//营销
			if (this.homePageAuth.isShowMarketingCenter == 0) {
				let MarkTab = document.querySelector('.uni-tabbar__item:nth-child(4)').style;
				this.$nextTick(() => {
					MarkTab.display = 'none'
				})
			} else {
				document.querySelector('.uni-tabbar__item:nth-child(4)').style.display = 'block';
			}
			//宴会
			if (this.homePageAuth.isShowYHClue == 0 && this.homePageAuth.isShowYHBanquetOrder == 0) {
				let YHTab = document.querySelector('.uni-tabbar__item:nth-child(5)').style;
				this.$nextTick(() => {
					YHTab.display = 'none'
				})
			} else {
				this.$nextTick(() => {
					document.querySelector('.uni-tabbar__item:nth-child(5)').style.display = 'block';
				})
			}
		},
		// 去搜索页
		gotoSearch() {
			this.$util.baiduEvent('客户搜索', '首页顶部客户搜索');
			uni.navigateTo({
				url: `/pages/_common/searchRecord/searchRecord`
			});
		},
		// 去客户跟踪界面
		getoCustomerFollow(status = '') {
			this.$cw.setSwitchTo({
				url: '/pages/customer/customer',
				payload: {
					tabIndex: 1,
					status,
					...this.currentJumpParams(true)
				}
			});
		},
		// 去客户列表界面
		gotoCustomer() {
			this.$cw.setSwitchTo({
				url: '/pages/customer/customer',
				payload: {
					tabIndex: 0,
					...this.currentJumpParams(true)
				}
			});
		},
		// 去宴会线索(那个筛选条件，值多少)
		gotoBanquet(target, value) {
			let clueLevel = null; // 线索成交率
			let clueStatus = null; // 线索状态
			switch (target) {
				case '线索成交率':
					clueLevel = value;
					break;
				case '线索状态':
					clueStatus = value;
					break;
				default:
					break;
			}
			this.$cw.setSwitchTo({
				url: '/pages/banquet/banquet',
				payload: {
					tabIndex: 0,
					clueLevel: clueLevel ? value : null,
					clueStatus: clueStatus ? value : null,
					...this.currentJumpParams(true)
				}
			});
		},
		// (废弃)去今日预订
		// gotoReserve() {
		// 	this.setReserveTab(1);
		// 	this.$cw.setSwitchTo({
		// 		url: '/pages/reserve/reserve',
		// 		payload: {
		// 			tabIndex: 1,
		// 			...this.currentJumpParams(true),
		// 			selectDate: this.bookSelectType
		// 		}
		// 	});
		// },
		// 去目标完成情况页面
		gotoSaleTarget() {
			uni.navigateTo({
				url: `/pages/homePageSub/saleTarget/saleTarget${this.currentJumpParams()}`
			});
		},
		// 首页顶部快速菜单跳转
		goNaviPage(item) {
			switch (item.name) {
				case '预订台':
					uni.navigateTo({
						url: '/pages/homePageSub/reserve/reserve'
					});
					break;
				case '预订订单':
					uni.navigateTo({
						url: '/pages/homePageSub/reserve/reserve?tabIndex=1'
					});
					break;
				case '宴会线索':
					this.$cw.setSwitchTo({
						url: '/pages/banquet/banquet',
						payload: {
							tabIndex: 0,
						}
					});
					break;
				case '宴会订单':
					this.$cw.setSwitchTo({
						url: '/pages/banquet/banquet',
						payload: {
							tabIndex: 1,
						}
					});
					break;
				case '客户跟踪':
					this.$cw.setSwitchTo({
						url: '/pages/customer/customer',
						payload: {
							tabIndex: 1,
						}
					});
					break;
				case '客户列表':
					this.$cw.setSwitchTo({
						url: '/pages/customer/customer',
						payload: {
							tabIndex: 0,
						}
					});
					break;
				case '上传通话':
					if (this.$cw.isApp()) {
						uni.showToast({
							title: '操作成功',
							icon: 'none',
							duration: 2000
						});
						this.$cw.uploadCall();
					}
					break;
				case '短信话术模板':
					uni.navigateTo({
						url: '/pages/mySub/SMSTemplet/SMSTemplet'
					});
					break;
					// case '设置跟踪清单':
					// 	uni.navigateTo({
					// 		url: '/pages/_common/setFollowList/setFollowList'
					// 	});
					// 	break;
				case '刷新跟踪机会':
					this.$refs.yearMonth.show();
					// 锁定下拉刷新
					this.$refs.mescrollRef.mescroll.lockDownScroll(true);
					break;
				case '完成目标':
					uni.navigateTo({
						url: '/pages/homePageSub/saleTarget/saleTarget'
					});
					break;
				case '评价查询':
					uni.navigateTo({
						url: '/pages/mySub/SearchComment/SearchComment'
					});
					break;
				case '协同中心':
					uni.navigateTo({
						url: '/pages/homePageSub/joinList/joinList'
					});
					break;
				case '统计报表':
				case '统计分析':
					uni.navigateTo({
						url: `/pages/_common/statList/statList`
					});
					break;
			}
		},
		// 提醒click方法
		clickReminderItem(item) {
			this.reminderNavigateTo(item);
		},
		// 提醒要跳转的页面
		reminderNavigateTo(item) {
			let num = JSON.parse(item.operationParamJson).needHandleCount;
			let tipList = {
				'客户跟踪': () => {
					this.getoCustomerFollow();
				},
				'宴会任务': () => {
					this.$cw.setSwitchTo({
						url: '/pages/banquet/banquet',
						payload: {
							tabIndex: 1,
						}
					});
				},
				'宴会线索': () => {
					this.gotoBanquet();
				},
				'目标': () => {
					uni.navigateTo({
						url: '/pages/homePageSub/saleTarget/saleTarget'
					});
				}
			};
			tipList[item.name]();
		},
		//初始化picker时间范围
		initTimePicker() {
			// exp: 2019-11 => [2019, 11]
			let now = this.$moment().format('YYYY-MM').split('-');
			this.startYear = this.$moment().subtract(10, 'years').format('YYYY');
			this.endYear = this.$moment().add(10, 'years').format('YYYY');
			this.defaultYear = now; // 数组形式
			// alert(`${this.startYear}${this.endYear}` + JSON.stringify(this.defaultYear));
		},
		onCancelYear(e) {
			this.$refs.mescrollRef.mescroll.lockDownScroll(false);
		},
		// 刷新跟踪记录 => 确定了年份选择
		onConfirmYear(e) {
			this.$refs.mescrollRef.mescroll.lockDownScroll(false);
			// e:
			// 	checkArr: ["2022", "11"]
			// 	result: "2022-11"
			// console.log(e);
			const chooseDate = e.result;
			uni.showModal({
				content: `确定要刷新${chooseDate}的跟踪记录？`,
				success: async ({
					confirm,
					cancel
				}) => {
					if (confirm) {
						const data = {
							month: chooseDate,
							storeId: storage.getAppUserInfo().currentStoreId,
							cwCompanyId: storage.getAppUserInfo().cwCompanyID
						};
						let result = await CY61.CalculaSalesForecast(data);
						let info = result;
						if (info) {
							// this.getHomeDetail(); // 改为刷新整个页面
							this.downCallback(this.mescrollSingle);
							setTimeout(() => {
								if (info.chainRelativePercentage == null) {
									info.chainRelativePercentage = 0;
								}
								let huanbi = info.chainRelativePercentage >= 0 ? '，环比上升' + info.chainRelativePercentage + '%' : info.chainRelativePercentage <
									0 ? '，环比下降' + Math.abs(info.ChainRelativePercentage) + '%' : '';
								uni.showModal({
									content: `客户池新增${info.addpeople || 0}人，减少${info.decreasepeople || 0}人，达到${info.reachpeople || 0}人${huanbi}；${info.month ? info.month.slice(5, 7) : '?'}月A类${info.alevel || 0}人，B类${info.blevel || 0}人，C类${info.clevel || 0}人。`
								});
							});
						}
					}
				},
				fail: () => {
					console.log('取消了刷新')
				}
			})
		},
		// 登出
		logoOut: function() {
			cw.logout();
		},
		// 预订切换
		tabBook(type) {
			this.bookSelectType = type;
		},
		// 刷新列表
		refresh() {
			// this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
			this.$refs.mescrollRef.mescroll.resetUpScroll();
		},
	},
	watch: {
		"userInfo.userHomeConfig.configs": {
			handler: function(val, oldVal) {
				if (val) {
					let configs = val;
					console.log('watch=>[首页]userInfo');
					// console.log(configs, oldVal);
					if (JSON.stringify(configs) != JSON.stringify(oldVal)) { // 刷新页面
						// debugger
						// 不相等，说明有变化，设置第一项为默认项
						if (configs.length > 0) {
							let curTabNav = this._.cloneDeep(configs)[0];
							this.tabNavSelected = {
								...curTabNav,
							};
							// 重置overview的请求类型为当前类型
							this.getOverViewDataIn = {
								...this.getOverViewDataIn,
								code: this.tabNavSelected.code,
							};
						}
					} else { // 重新登陆
						let isLogin = getApp().globalData.isLogin;
						if (!isLogin) {
							getApp().globalData.isLogin = true;
							if (configs.length > 0) {
								let curTabNav = this._.cloneDeep(configs)[0];
								this.tabNavSelected = {
									...curTabNav,
								};
								// 重置运营板块的请求类型为当前类型
								this.getOverViewDataIn = {
									...this.getOverViewDataIn,
									code: this.tabNavSelected.code,
								};
							}
						}
					}
				}
			},
			deep: true,
		},
		"userInfo.currentStoreId": {
			handler: function(val, oldVal) {},
		},
		menuList: {
			handler: function(val, oldVal) {
				if (val.toString() != oldVal.toString()) {}
			},
			deep: true,
		},
		getOverViewDataIn: { // 每次改变顶部overview请求参数后，获取新的overview数据
			handler: function(val) {
				let find = {
					name: this.tabNavSelected.name,
					isGetAll: val.isGetAll,
				};
				if (this.shouldUpdateCacheOverviewData(find)) {
					// debugger
					this.reqOverView();
				}
			},
			deep: true,
		},
	}
};

/**
 * 刷新页面，homeDetail刷新
 * 	tabnav变化
 * 		设置第一项为默认项，重置cacheOverviewData，请求overview数据，设置新的cacheOverviewData
 * 	tabnav没有变化
 * 		查找当前选中项，更新cacheOverviewData中对应数据
 * 不刷新页面，改变tanav默认项
 * 	cacheOverviewData没有当前项数据
 * 		请求overview数据
 * 	cacheOverviewData有当前项
 * 		不请求接口
 */
