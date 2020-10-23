import CY17 from '@/service/CY/CY17AppService.js'; // 更新当前人销售员的默认门店的ID
import CY61 from '@/service/CY/CY61AppService.js'; // 刷新跟踪机会

import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';
import moment from '@/lib/moment/moment.min.js';

import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
const app = getApp();
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

import YHClue from '@/service/YH/YHClueAppService.js'

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			bookSelectType: '昨日', // 预订选中的状态 三种 昨日 今日 一个月内 默认是昨日
			dataType: '个人', // 默认展示个人所有数据, 两种:个人,全部
			//  --------------------- 刷新配置 ------------------
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
			mainTitleEles: [], // 所有mainTitle标题对象集合
			mainEles: [], // 所有板块对象集合
			ot: [], //存储每个标题的offsetTop
			len: 0, // 标题的个数
			searchBottomY: 0, // 搜索view底部距离页面顶部的距离
			mescrollSingle: null, // 刷新实例
			isGetAll: getApp().globalData.isGetAll, // 默认请求个人的首页数据
			isFirstLoadAll: false,

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
	components: {
		uniPopup,
		uniTag,
	},
	computed: {
		...mapState(['storeData', 'hasLogin']),
		...mapState({
			// 顶部快速菜单列表
			menuList: state => {
				// (不限制了)最多显示6个(配置信息存储在userInfo中)
				// return state.user.userInfo.appInJson.configs.filter(v => v.isOpen == '1').slice(0, 6);
				return state.user.userInfo.appInJson.configs.filter(v => v.isOpen == '1');
			},
			// 运营板块列表
			operateList: state => {
				return state.user.userInfo.userHomeConfig.configs
			},
			// [我的]数据
			operate: state => state.home.swOperate,
			// [全店]数据
			operateAll: state => state.home.swOperateAll,
			userInfo: state => state.user.userInfo
		}),
		// 动态计算,当前板块是否展示,且顺序如何
		targetOperation() {
			return function(name, key) {
				return this.operateList.length > 0 ? this.operateList.filter(v => v.name == name).length ? this.operateList.filter(
					v => v.name == name)[0][key] : '0' : '0';
			}
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
		}
	},
	async onLoad() {
		this.authChangeTab();
		// 如果是手机端嵌壳访问那么需要设置手机端AppId并且上传通话记录
		if (this.$cw.isApp(false)) {
			const userId = storage.getAppUserId();
			this.$cw.setLoginUser(userId); // 设置手机APPID
			if(this.$cw.isAndroid()){
				let beginDate = this.$moment(new Date())
					.subtract(2, 'weeks')
					.format('YYYY-MM-DD HH:mm:ss');
				this.$cw.getPhoneCallResult(beginDate);
			}
			
			this.$cw.uploadCall(); // 上传手机通话记录
		}
		// 根据本地是否有userId判断当前用户是否登录
		let userId = storage.getAppUserId();
		if (!userId) {
			cw.logout();
			return;
		} else {
			// 解决登陆后，杀死程序再进来没有重新获取首页数据bug
			if (!getApp().globalData.homePageData.isLoad) {
				this.getHomeDetail();
				getApp().globalData.homePageData.isLoad = false;
			}
		}
		// 有则获取用户详细信息
		this.getUserInfo(() => {
			// 底部watch userInfo.currentStoreId 时,会调用下面注释的代码
			this.getStores();
		});

		// 刷新跟踪机会picker的时间初始化
		// this.initTimePicker();
	},
	onShow() {
		setTimeout(() => {
			// 计算mescroll距离顶部高度
			let searchRefRect = this.$refs.searchRef.$el.getBoundingClientRect();
			this.searchBottomY = (searchRefRect.top + searchRefRect.height + 10).toString();
			// 初始化吸顶
			this.initFixedTopNew();
		});
	},
	mounted() {
		// 监听是否要切换门店
		uni.$on('change-store', (item) => {
			this.chgStore(item, item.cb);
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
		// --------------- 监听 mescroll 页面滚动 ------------------------
		initFixedTopNew() {
			// 计算顶部快捷入口菜单高度，赋值给scrollTop
			let menuRefRect = this.$refs.menuRef.$el.getBoundingClientRect();
			this.scrollTop = menuRefRect.height;
		},
		// 初始化吸顶标题的工作
		initFixedTop() {
			this.ot = [];
			this.mainTitleEles = [];
			this.mainEles = [];
			let searchRefRect = this.$refs.searchRef.$el.getBoundingClientRect();
			let mescrollRefRect = this.$refs.mescrollRef.$el.getBoundingClientRect();
			// 根据search搜索栏高度,计算mescroll top的值
			this.searchBottomY = (searchRefRect.top + searchRefRect.height + 10).toString();
			// console.log({searchBttomY: this.searchBottomY});
			// 获取所有需要吸顶效果的标题
			this.mainTitle = uni.createSelectorQuery().selectAll('.main-title');
			uni.createSelectorQuery().selectAll('.main-title').fields({
				rect: true,
				dataset: true
			}, res => {
				this.mainTitleEles = res;
				console.log({mainTitleEles: this.mainTitleEles})
				// 标题的个数
				this.len = this.mainTitleEles.length;
				for (let i = 0; i < this.len; i++) {
					this.ot.push(this.mainTitleEles[i].top); //获取每个标题的offsetTop
				}
				// 获取所有需要吸顶的板块
				uni.createSelectorQuery().selectAll('.main').fields({
					rect: true,
					dataset: true,
					size: true
				}, res => {
					this.mainEles = res;
					console.log({mainEles: this.mainEles});
					// if (!this.mainEles.length) return;
					// 存储每个标题的offsetTop（只读属性，返回当前元素相对于其 offsetParent 元素的顶部内边距的距离）
					// 加上 最后一个吸顶板块的高度. 解决滚动到最后一个标题（i）时，无法获取（i+1）的offsetTop
					this.ot.push(this.mainEles[this.len - 1].top + this.mainEles[this.len - 1].height);
				}).exec();
			}).exec();
		},
		onScroll(mescroll) {
			const st = mescroll.scrollTop;
			// 当mescroll的scrollTop大于吸顶scrollTop距离，吸顶；否则跟随滚动
			if (st > this.scrollTop) {
				this.$refs.operationRef.$el.className = 'main-title fixed';
			} else {
				this.$refs.operationRef.$el.className = 'main-title';
			}
			// console.log(mescroll)
			// // 获取滚动的高度
			// const st = mescroll.scrollTop + Number(this.searchBottomY);
			// // const st = mescroll.scrollTop;
			// console.log({scrollTop: mescroll.scrollTop, ot: this.ot, searchBottomY: this.searchBottomY});
			// for (let i = 0; i < this.len; i++) {
			// 	// 滚动时监听位置，为标题的吸顶设置一个显示范围
			// 	console.log({
			// 		'ot1': this.ot[i], 
			// 		'$ot2': this.ot[i + 1]
			// 	})
			// 	if (st > this.ot[i] && st < this.ot[i + 1]) {
			// 		this.$refs[this.mainTitleEles[i].dataset.id].$el.className = 'main-title fixed';
			// 	} else {
			// 		this.$refs[this.mainTitleEles[i].dataset.id].$el.className = 'main-title';
			// 	}
			// }
		},
		// --------------- navBar 左右弹窗 start -------------------------
		// 左上角报表类弹窗显示
		showReport() {
			this.$refs.reportPopup.open();
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
			// alert(item.storeId);
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
				this.isFirstLoadAll = false; // 切换门店,重置isFirstLoadAll为false,代表watch isGetAll 时,需要重新请求
				// console.log("切换门店")
				await this.getHomeDetail({
					isGetAll: getApp().globalData.isGetAll
				});
				// alert(JSON.stringify(userInfo));
				// 执行回调
				cb && cb();
			} else {
				cb && cb();
			}
			this.$refs.morePopup.close();
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
				// console.log('downCallback');

				await this.getSwOptions({
					isGetAll: getApp().globalData.isGetAll
				});
				// 成功隐藏下拉加载状态
				mescroll.endSuccess();
			} catch (e) {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// 首页配置及其板块顺序信息
		async getHomeDetail() {
			console.log("getHomeDetail被调用");
			let {
				saleAuthority
			} = await this.getSwOptions({
				isGetAll: getApp().globalData.isGetAll
			});
			this.authChangeTab();
			return saleAuthority
		},
		authChangeTab() { //更新权限后 更新页面和tab
			//调试style隐藏tab 可行 但是会最先出现所有tabbar 然后再进行隐藏
			this.homePageAuth = this.$storage.getSalesAuthority();
			console.log('首页获取权限：', this.homePageAuth)
			//-----------------------------------------控制Tab的显示--------------------------------------
			//宴会
			if (this.homePageAuth.isShowYHClue == 0 && this.homePageAuth.isShowYHBanquetOrder == 0) {
				let YHTab = document.querySelector('.uni-tabbar__item:nth-child(3)').style;
				this.$nextTick(() => {
					YHTab.display = 'none'
				})
			} else {
				this.$nextTick(() => {
					document.querySelector('.uni-tabbar__item:nth-child(3)').style.display = 'block';
				})
			}
			//客户
			if (this.homePageAuth.isShowCstList == 0 && this.homePageAuth.isCustomerTrack == 0) {
				let CuTab = document.querySelector('.uni-tabbar__item:nth-child(4)').style;
				this.$nextTick(() => {
					CuTab.display = 'none'
				})
			} else {
				document.querySelector('.uni-tabbar__item:nth-child(4)').style.display = 'block';
			}
			//预订台
			if (this.homePageAuth.isTodayScheduled == 0) {
				let BookTab = document.querySelector('.uni-tabbar__item:nth-child(5)').style;
				this.$nextTick(() => {
					BookTab.display = 'none'
				})
			} else {
				document.querySelector('.uni-tabbar__item:nth-child(5)').style.display = 'block';
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
		// 去今日预订
		gotoReserve() {
			this.setReserveTab(1);
			this.$cw.setSwitchTo({
				url: '/pages/reserve/reserve',
				payload: {
					tabIndex: 1,
					...this.currentJumpParams(true),
					selectDate: this.bookSelectType
				}
			});
		},
		// 去目标完成情况页面
		gotoSaleTarget() {
			uni.navigateTo({
				url: `/pages/homePageSub/saleTarget/saleTarget${this.currentJumpParams()}`
			});
		},
		// 首页顶部快速菜单跳转
		goNaviPage(item) {
			switch (item.name) {
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
					// console.log(this.$refs.mescrollRef);
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
			}
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
							this.getHomeDetail();
							setTimeout(() => {
								if (info.chainRelativePercentage == null) {
									info.chainRelativePercentage = 0;
								}
								let huanbi = info.chainRelativePercentage >= 0 ? '，环比上升' + info.chainRelativePercentage +'%': info.chainRelativePercentage <
									0 ? '，环比下降' + Math.abs(info.chainRelativePercentage) +'%': '';
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
		// 面板数据切换(个人,全部)
		changeDataType(type) {
			if (this.dataType == type) return;
			this.dataType = type;
			this.isGetAll = getApp().globalData.isGetAll == 1 ? 0 : 1;
			getApp().globalData.isGetAll = this.isGetAll;
			// console.log(this.isGetAll, getApp().globalData.isGetAll)
		},
		// 预订切换
		tabBook(type) {
			this.bookSelectType = type;
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
	},
	watch: {
		"userInfo": {
			handler: function(val, oldVal) {
				if (val) {
					console.log('watch=>[首页]userInfo');
					// this.isFirstLoadAll = false;
					// this.getSwOptions({
					// 	isGetAll: this.isGetAll
					// });
				}
			},
			deep: true
		},
		"userInfo.currentStoreId": {
			handler: function(val, oldVal) {

			},
		},
		isGetAll(val, oldVal) {
			if (!this.isFirstLoadAll) { // 第一次请求[全部]的数据
				console.log("watch:isGetAll");
				this.isFirstLoadAll = true;
				this.getHomeDetail();
			}
		},
		menuList: {
			handler: function(val, oldVal) {
				if (val.toString() != oldVal.toString()) {
					// this.$nextTick(() => {
					// 	this.initFixedTop();
					// });
				}
			},
			deep: true
		}
	}
};
