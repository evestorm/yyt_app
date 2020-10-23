// ---------------- import三方库 -----------------
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import util from '@/common/util.js';

// ---------------- import组件 --------------
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniDrawer from "@/components/uni-drawer/uni-drawer.vue";

// ------------------ import网络请求 ---------------
import CY20 from '@/service/CY/CY20AppService.js';
import CY08 from '@/service/CY/CY08AppService.js';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';

// ---------------- importVuex ------------------
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

const PAGESIZE = 10;

export default {
	props: {
		payload: {
			type: Object,
			default: function() {
				return {}
			}
		}
	},
	data() {
		return {
			getTodyBook_IsShowLoading:true, // 调用获取列表的数据是否显示现在加载中 控制 预订详情修改后 因该是静默刷新
			picDomain: getApp().globalData.PicDomain,
			notWatch: false, // 不watch,防止改了时间又改markerid导致数据拿错(连续两次请求参数不一致,以后一次为准,但后一次先于前一次返回数据,被覆盖)
			dataType: '个人', // 首页是从[我的 个人]还是[全部]过来
			// ----------------- data顶部筛选 --------------------
			currentUser: {
				value: storage.getAppUserInfo().marketerId,
				label: storage.getAppUserInfo().userName
			}, // 当前登录人信息

			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: moment().subtract(10, 'years').format('YYYY'),
			endDateStr: moment().add(10, 'years').format('YYYY'),
			// ['2010','01','01','-','2030','01','01']
			defaultDateRangeArr: [...moment().format('YYYY-MM-DD').split('-'), '-', ...moment().format('YYYY-MM-DD').split('-')],

			isShowMeals: false, // 筛选列是否显示餐别下拉菜单
			mealsAll: [], // 下拉菜单(餐别选择)

			isCSManagerFilter: false, // 是否显示顶部客服panel
			CSManagerFilterArr: [], // 顶部客户经理列表(预订时间范围内客户经理)

			getSalesAuthority: '', // 当前登录人权限
			isFinance: false, // 是否有权限做关单操作[根据此字段判断UI的展示顺序,和关单权限]

			orderStatusArr: [{
					value: 2,
					label: '未结账',
					selected: true,
					num: 0
				},
				{
					value: 0,
					label: '待关单',
					selected: false,
					num: 0
				},
				{
					value: 1,
					label: '已关单',
					selected: false,
					num: 0
				},
			], // 顶部订单状态数组

			// ----------------- data概览 -----------------
			// GetTodyBookSummaryOutData: {
			// 	feeSum: 0, // 总收入
			// 	allBookTableNumSum: 0, // 总桌数
			// 	customerBookTableNumSum: 0,
			// 	feastBookTableNumSum: 0,
			// 	guestBookTableNumSum: 0,
			// 	followTable: 0,
			// 	followAmount: 0,
			// 	tjFollowTable: 0,
			// 	tjFollowAmount: 0,
			// 	aleadyCloseCount: 0,
			// 	notCloseCount: 0,
			// },
			GetTodyBookSummaryOutData: {
				feeSum: 0, // 总收入
				allBookTableNumSum: 0, // 总桌数
			},
			// ----------------- data卡片 ------------------------
			moreList: [ // 卡片list更多操作
				{
					label: '关单',
					value: 1,
				},
				{
					label: '关单(无绩效)',
					value: 2
				},
				{
					label: '取消关单',
					value: 0
				}
			],
			moreList2: [ // 邀请
				{
					label: '记录',
					value: 'record'
				},
				{
					label: '发送邀请函',
					value: 'wx-invitation',
				},
				{
					label: '邀请评价',
					value: 'wx-evaluation'
				}
			],
			dyncMoreList: [], // 最后动态赋值的更多列表（关单）
			dyncMoreList2: [], // 最后动态赋值的更多列表（邀请）

			// ----------------- data侧边栏抽屉 -------------------
			isShowSidebar: false, // 是否显示侧边栏
			filterQuery: { // 侧边栏筛选参数 和 TodyBookQuery 中参数相同,为了在点击侧边栏完成按钮时再触发更新,先缓存一份
				customerLabel: '', // 标签字符串(,隔开)
				bookOrderTypeType: null, // 预订类型
			},
			orderType: [], // 侧边栏的预订类型

			// ------------------- data列表数据请求 ----------------
			TodyBookQuery: {
				cwCompanyID: storage.getAppUserInfo().cwCompanyID,
				bookOnStart: moment().format('YYYY-MM-DD') + ' 00:00:00',
				bookOnEnd: moment().format('YYYY-MM-DD') + ' 00:00:00',
				currentStoreId: storage.getAppUserInfo().currentStoreId,
				customerLabel: '',
				bookRange: 1, // 1 我的预订 2，全部预订(选择全部就是全部,个人客户经理就是我的预订)
				pageIndex: 1,
				pageSize: PAGESIZE,
				marketerId: storage.getAppUserInfo().marketerId,
				isClose: null, // 关单状态

				// 侧边栏筛选数据
				dinnerType: -1, // 餐别
				bookOrderTypeType: null, // 预订类型
				// 关单状态原来就有,用原来的(上方)
			},
			TodyBookData: [], // 列表数据

			// ---------------------- dataMescroll配置 ---------------------

			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			// mescroll实例
			mescrollSingle: {},
			topFilterWrapperBottom: 288, // 顶部状态栏bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度

			// ------------------- data其他 ---------------------
			currentTodyBookDataItem: {}, // 当前选中的列表item
		}
	},
	filters: {
		getNumber(value) {
			let reg = /\d+/;
			let result = reg.exec(value);
			return result || result != null ? result[0] : "";
		},
		getChinese(value) {
			let reg = /[\u4e00-\u9fa5]+/;
			let result = reg.exec(value);
			return result || result != null ? result[0] : "";
		},
	},
	computed: {
		...mapState(['currentReserveTagsObj']),
		...mapState({
			'currentCustomerItem': state => state.currentCustomerItem,
			'salesAuthority': state => state.user.salesAuthority,
			'userInfo': state => state.user.userInfo,
			'chooseMarketData': state => state.user.chooseMarketData
		}),
		...mapState(['area', 'todayOptions', 'curSelectedTable', 'bookerInfo']),
		// --------------- computed顶部筛选 ---------------
		mealsIsAll() { // 筛选项餐别文字格式化(最多显示4个汉字)
			var filters = this.mealsAll.filter(function(item) {
				return item.selected;
			})[0];
			if (filters) {
				if (filters.label == '全部') {
					return '餐别';
				} else {
					return filters.label.substring(0, 4);
				}
			} else {
				return '';
			}
			// return filters ? filters.label.substring(0, 4) : '';
		},
		// ----------------- computed一键关单 -----------------------
		canICloseAll() {
			this.calcMescrollTop();
			for (let i = 0; i < this.orderStatusArr.length; i++) {
				// 只有当value=0(待关单tab)且已选中且有关单权限(财务)才能显示[一键关单]
				if (this.orderStatusArr[i].value == 0 &&
					this.orderStatusArr[i].selected == true &&
					this.$cw.isFinance() &&
					this.TodyBookData.length > 0) {
					return true;
				}
			}
			return false;
		},
		// --------------------- computed订单列表 ---------------------
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != '' && url != null) {
					return 'url(' + encodeURI(url) + ')';
				} else {
					return 'url("https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png")';
				}
			}
		},
		// 是否显示工具栏(没用到)
		isShowTools() {
			let curTab = this.orderStatusArr.filter(v => v.selected)[0];
			console.log(curTab);
			// tab为待关单且登录人是超管
			if (curTab.value == 0) {
				return true;
			} else {
				return false;
			}
		},
		// （废弃，又要放进气泡菜单了，因为所有人都能显示电话发信息记录，邀请函，评价了）计算当前按钮是否需要显示
		calcTheToolbarIsDisplayed() {
			return function(name) {
				let canISee = false;
				switch (name) {
					case '关单':
						if (cw.isFinance()) {
							let cur = this.orderStatusArr.filter(v => v.selected)[0];
							canISee = cur.value == 0;
						}
						break;
					case '关单(无绩效)':
						if (cw.isFinance()) {
							let cur = this.orderStatusArr.filter(v => v.selected)[0];
							canISee = cur.value == 0;
						}
						break;
					case '取消关单':
						if (cw.isFinance()) {
							let cur = this.orderStatusArr.filter(v => v.selected)[0];
							canISee = cur.value == 1;
						}
						break;
					default:
						break;
				}
				return canISee;
			}
			// [
			// 	{ value: 2, label: '未结账', selected: true },
			// 	{ value: 0, label: '待关单', selected: false },
			// 	{ value: 1, label: '已关单', selected: false },
			// ]
		},
	},
	components: {
		uniPopup,
		uniDrawer, // 抽屉
	},
	mounted() {
		// 如果父组件传递了payload.dataType,证明从首页来,需判断[我的]还是[全店]
		let {
			dataType,
			tabIndex,
			selectDate
		} = this.payload;
		if (dataType && tabIndex == 1) { // 从首页来
			this.dataType = dataType;
			this.fromDate();
		} else if (selectDate) { // 从协同中心详情页来
			this.fromDate('joinDetail');
		}
		// 根据当前人权限判断tab的展示顺序和可操作UI
		this.initTab();
		this.initUserInfo();
		// 监听刷新事件
		uni.$on('todayBookRefresh', res => {
			if (res == 'refresh') {
				this.getTodyBook_IsShowLoading=false;
				this.refresh();
			}
		});
	},
	methods: {
		...mapMutations(['setCurrentCustomerItem']),
		...mapMutations(['setCurrentReserveTagsObj']),
		...mapMutations([
			'setUserInfo', 'setSalesAuthority', 'setStoreData',
			'setChooseMarketData', 'setAllChooseMarketData'
		]),
		// 获取区域
		...mapActions(['getArea']),
		...mapMutations(['setArea', 'setTodayOptions', 'setCurSelectedTable']),
		// ---------------------- methods页面初始化 -----------------
		async initUserInfo(cb) { // 初始化用户的各种信息
			const userInfo = storage.getAppUserInfo();
			// 本地如果有,currentStore门店就是上次登录最后设置的门店
			this.setUserInfo(userInfo);
			// 获取用户可操作性权限
			let salesAuthority = storage.getSalesAuthority();
			this.setSalesAuthority(salesAuthority);

			try {
				// 获取餐别信息
				await this.getSidebarFilterData();
				this.initParams();
				this.getHaveReserveSalesData(() => {
					this.initDataFromHome(this.dataType);
				});
			} catch (e) {
				//TODO handle the exception
				console.log('todayBook initUserInfo 方法获取侧边栏数据失败', e);
			}
		},
		// 初始化[未结账/待关单/已关单]tab顺序
		initTab() {
			// 权限判定
			// 1. 正常:
			// 		tab顺序:未结账/待关单/已关单
			// 		卡片工具栏:[电话/发短信/记录]
			// 2. 财务: isFinance 为 1
			// 		tab顺序:待关单/已关单/未结账
			// 		卡片工具栏:[关单/关单(无绩效)]
			if (!cw.isFinance()) {
				this.orderStatusArr = [{
						value: 2,
						label: '未结账',
						selected: true
					},
					{
						value: 0,
						label: '待关单',
						selected: false
					},
					{
						value: 1,
						label: '已关单',
						selected: false
					},
				];
			} else {
				this.orderStatusArr = [{
						value: 0,
						label: '待关单',
						selected: true
					},
					{
						value: 1,
						label: '已关单',
						selected: false
					},
					{
						value: 2,
						label: '未结账',
						selected: false
					},
				];
			}
		},
		initParams(fromHome = false) {
			this.TodyBookQuery.cwCompanyID = this.userInfo.cwCompanyID;
			this.TodyBookQuery.currentStoreId = this.userInfo.currentStoreId;
			this.TodyBookQuery.marketerId = this.userInfo.marketerId;
			if (fromHome) this.fromDate();
			console.log(this.TodyBookQuery);
			this.cancelReasonQuery = {
				pageIndex: 1,
				pageSize: 1,
				order: "storeId",
				filter: {
					type: "and",
					conditions: [{
							attribute: "tagType",
							datatype: "int",
							operatoer: "eq",
							value: "1"
						},
						{
							attribute: "storeId",
							datatype: "letchar",
							operatoer: "eq",
							value: this.userInfo.currentStoreId
						}
					]
				}
			};
			this.getSalesAuthority = this.salesAuthority;
		},
		// 用来处理跳转到此页面时,顶部展示全部还是当前人. 将dataType传入,可能的值为['个人', '全部']
		initDataFromHome(dataType) {
			let data = this.TodyBookQuery;
			// console.log(dataType);
			if (dataType == '个人') { // 我的
				console.log('传过来的dataType为 [个人]');

				this.currentUser = {
					value: storage.getAppUserInfo().marketerId,
					label: storage.getAppUserInfo().userName
				};

				data.bookRange = 1;
				data.marketerId = storage.getAppUserInfo().marketerId;

				this.CSManagerFilterArr.forEach((v, index) => {
					if (v.value === this.TodyBookQuery.marketerId) { // 如果当前登录人在经理列表中，就选中
						v.selected = true;
					}
				});
			} else if (dataType == '全部') { // 全店
				// 第一个数据是全部
				let item = this.CSManagerFilterArr.length > 0 ? this.CSManagerFilterArr[0] : {
					value: '',
					label: '全部',
					selected: true
				};
				this.currentUser = {
					value: item.value,
					label: item.label,
				};
				data.bookRange = 2;
				data.marketerId = '';
				this.CSManagerFilterArr.forEach(v => v.selected = false);
				this.CSManagerFilterArr.length > 0 ? this.CSManagerFilterArr[0].selected = true : () => {};
			}
		},
		// ---------------------- methods顶部筛选 -----------------
		// 计算从首页过来的日期
		fromDate(from="home") {
			if (from == 'home') { // 首页过来
				let dateStr = this.payload.selectDate;
				switch (dateStr) {
					case '昨日':
						this.TodyBookQuery.bookOnStart = moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00';
						this.TodyBookQuery.bookOnEnd = moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00';
						break;
					case '今日':
						this.TodyBookQuery.bookOnStart = moment().format('YYYY-MM-DD') + ' 00:00:00';
						this.TodyBookQuery.bookOnEnd = moment().format('YYYY-MM-DD') + ' 00:00:00';
						break;
					case '一个月内':
						this.TodyBookQuery.bookOnStart = moment().format('YYYY-MM-DD') + ' 00:00:00';
						this.TodyBookQuery.bookOnEnd = moment().add(1, 'month').format('YYYY-MM-DD') + ' 00:00:00';
						break;
					default:
						break;
				}
			} else if (from == 'joinDetail') { // 协同过来
				let dateStr = this.payload.selectDate.split('.').join('-') + ' 00:00:00';
				this.TodyBookQuery.bookOnStart = dateStr;
				this.TodyBookQuery.bookOnEnd = dateStr;
			}
			
		},
		// 前一天
		getPre() {
			let currentDate = this.TodyBookQuery.bookOnStart.slice(0, 10);
			let next = moment(currentDate).add(-1, 'days').format('YYYY-MM-DD')
			this.TodyBookQuery.bookOnStart = next + ' 00:00:00';
			this.TodyBookQuery.bookOnEnd = next + ' 00:00:00';
			this.defaultDateRangeArr = [...next.split('-'), '-', ...next.split('-')];
		},
		// 后一天
		getNext() {
			let currentDate = this.TodyBookQuery.bookOnStart.slice(0, 10);
			let next = moment(currentDate).add(1, 'days').format('YYYY-MM-DD')
			this.TodyBookQuery.bookOnStart = next + ' 00:00:00';
			this.TodyBookQuery.bookOnEnd = next + ' 00:00:00';
			this.defaultDateRangeArr = [...next.split('-'), '-', ...next.split('-')];
		},
		// 显示时间范围picker
		clickDateRange() {
			this.$nextTick(() => {
				this.$refs.dateRangePicker.show();
			});
		},
		// 确认时间范围
		onConfirmDateRange(val) {
			// console.log(val);
			this.TodyBookQuery.bookOnStart = val.from + ' 00:00:00';
			this.TodyBookQuery.bookOnEnd = val.to + ' 00:00:00';
		},
		mealsAllToggle() {
			this.isCSManagerFilter = false;
			// 触发餐别dropdown的显示隐藏
			this.isShowMeals = !this.isShowMeals;
		},
		seleMealsAll(item) {
			this.isShowMeals = false;
			if (item.selected) return;
			this.mealsAll.forEach(function(listItem) {
				listItem.selected = false;
			});
			item.selected = true;
		},

		// 弹出客户经理panel
		CSManagerFilterToggle() {
			// if (cw.isFinance()) {
			if (this.CSManagerFilterArr.length <= 0) {
				uni.showToast({
					title: '当日暂无其他销售数据',
					icon: 'none'
				});
				return;
			}
			this.isCSManagerFilter = !this.isCSManagerFilter;
			this.isShowMeals = false;
			// }
		},
		// 选择客户经理
		seleCSManagerFilter(item) {
			// item结构:
			// label: "黄芮"
			// value: "SL1855900000069"
			// selected: true
			this.isCSManagerFilter = false;
			if (item.selected) return;
			this.CSManagerFilterArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;

			this.TodyBookQuery.marketerId = item.value;

			this.currentUser = {
				label: item.label,
				value: item.value
			};
			this.TodyBookQuery.bookRange = this.TodyBookQuery.marketerId == '' ? 2 : 1;
		},
		// 获取时间范围内有预订过的客户经理数据
		async getHaveReserveSalesData(cb) {
			let data = {
				storeId: this.TodyBookQuery.currentStoreId,
				bookStartTime: this.TodyBookQuery.bookOnStart,
				bookEndTime: this.TodyBookQuery.bookOnEnd,
			}

			let result = await CY20.GetOrderMarkets(data);
			this.haveReserveSalesDataArr = [];
			let allMarketData = result.cy20MarketDtos;
			// console.log(allMarketData);
			this.CSManagerFilterArr = [];
			allMarketData.forEach((item, index) => {
				let obj = {
					value: item.marketId,
					label: item.marketName,
					selected: false,
				};
				if (obj.value != '' && obj.value != null &&
					obj.label != '' && obj.label != null) {
					this.CSManagerFilterArr.push(obj);
				}
			});
			if (this.CSManagerFilterArr.length > 0) {
				this.CSManagerFilterArr.unshift({
					value: '',
					label: '全部',
					selected: false,
				}); // 这里的全部,其实是对应的 bookRange ,如果用户选择了全部,则把bookRange改为2,否则bookRange为1
			}

			this.CSManagerFilterArr.forEach((v, index) => {
				if (v.value === this.TodyBookQuery.marketerId) { // 如果当前登录人在经理列表中，就选中
					v.selected = true;
				}
			});

			cb && cb();

		},

		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.isShowMeals = false;
			this.isCSManagerFilter = false;
		},

		// 顶部订单状态tab改变
		orderStatusTabSelect(e, item) {
			if (item.selected) return;
			this.orderStatusArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
		},
		// 一键关单
		allPass() {
			this.$util.baiduEvent('一键关单', '预订台列表页中部一键关单');
			let self = this;
			let data = {
				bookOnStart: self.TodyBookQuery.bookOnStart,
				bookOnEnd: self.TodyBookQuery.bookOnEnd,
				currentStoreId: self.TodyBookQuery.currentStoreId,
				bookRange: self.TodyBookQuery.bookRange,
				pageIndex: self.TodyBookQuery.pageIndex,
				pageSize: self.TodyBookQuery.pageSize,
				marketerId: self.TodyBookQuery.marketerId,
				isClose: '',
			}
			let success = function() {
				let obj = data;
				let success = function(result) {
					setTimeout(() => {
						uni.showToast({
							title: '关单成功'
						});
					});
					self.refresh();
					data.isClose = 1;
				};
				cw.allPass(obj, success)
			}

			let currentDate;
			if (self.TodyBookQuery.bookOnStart == self.TodyBookQuery.bookOnEnd) {
				currentDate = self.TodyBookQuery.bookOnStart.slice(0, 10);
			} else {
				currentDate = self.TodyBookQuery.bookOnStart.slice(0, 10) + '到' + self.TodyBookQuery.bookOnEnd.slice(0, 10);
			}
			let currentSalesName = self.TodyBookQuery.bookRange == 1 ? self.currentUser.label : ""
			let content = '是否对' + currentDate + '号' + currentSalesName + '的预订全部进行关单?';
			uni.showModal({
				title: "提示",
				content: content,
				success(res) {
					if (res.confirm) {
						success();
					}
				}
			});
		},
		// （财务）计算每个客户item的morelist菜单有哪些选项
		
		// 财务or有关单权限：关单 关单无绩效 电话 发短信 记录 邀请评价 邀请函
		// 没有上面权限 电话 发短信 记录 邀请评价 邀请函
		calcMoreList() {
			// 1. 财务能关单
			// 2. 待关单显示关单两个按钮,已关单显示取消关单一个按钮,已结账不显示三个点
			if (cw.isFinance()) {
				if (!this.orderStatusArr) {
					return [];
				} else {
					let arr = [];
					for (let i = 0; i < this.orderStatusArr.length; i++) {
						let v = this.orderStatusArr[i];
						if (v.selected && v.value == 0) { // 待关单
							console.log('待关单');
							arr = this.moreList.filter(v => v.label != '取消关单');
						} else if (v.selected && v.value == 1) { // 已关单
							console.log('取消关单');
							arr = this.moreList.filter(v => v.label == '取消关单');
						}
					}
					// console.log(arr);
					return arr;
				}
			} else {
				return [];
			}

			// { value: 2, label: '未结账', selected: true },
			// { value: 0, label: '待关单', selected: false },
			// { value: 1, label: '已关单', selected: false },
		},

		// （非财务）计算每个客户item的morelist菜单有哪些选项
		calcMoreListForInvite() {
			// 1. 是财务才把邀请放气泡
			// <!-- 只有未结账的订单才会有发邀请函，只有待关单的订单才有微信评价 -->
			// <!-- isClose=0 fee=0 未结账
			// isClose=0，fee>0 待关单 -->
			// <!-- 不对 发邀请函做限制了：v-if="!$storage.getSalesAuthority().isFinance && !ct.fee && ct.isClose == 0" -->

			// 对邀请评价做限制了： v-if="!$storage.getSalesAuthority().isFinance && ct.fee > 0 && ct.isClose == 0
			if (cw.isFinance()) {
				let arr = [];
				for (let i = 0; i < this.orderStatusArr.length; i++) {
					let v = this.orderStatusArr[i];
					if (v.selected && v.value == 0) { // 待关单
						console.log('发送邀请函');
						arr = this.moreList2.filter(v => v.label != '发送邀请函');
					} else if (v.selected && v.value == 1) { // 已关单
						console.log('邀请评价');
						arr = this.moreList2.filter(v => v.label == '邀请评价');
					} else if (v.selected && v.value == 2) { // 未结账
						arr = this.moreList2.filter(v => v.label == '发送邀请函');
					}
				}
				console.log(arr);
				return arr;
			} else {
				let arr = [];
				for (let i = 0; i < this.orderStatusArr.length; i++) {
					let v = this.orderStatusArr[i];
					if (v.selected && v.value == 0) { // 待关单
						console.log('发送邀请函');
						arr = [];
					} else if (v.selected && v.value == 1) { // 已关单
						console.log('邀请评价');
						arr = this.moreList2.filter(v => v.label == '邀请评价');
					} else if (v.selected && v.value == 2) { // 未结账
						arr = this.moreList2.filter(v => v.label == '发送邀请函');
					}
				}
				return arr;
			}

			// { value: 2, label: '未结账', selected: true },
			// { value: 0, label: '待关单', selected: false },
			// { value: 1, label: '已关单', selected: false },
		},


		// ---------------------------- methods侧边栏抽屉 -------------------------------
		// 显示抽屉
		showDrawer() {
			this.isShowSidebar = true;
		},
		// 显示抽屉
		closeDrawer() {
			this.isShowSidebar = false;
		},
		// 获取侧边栏需要的数据
		async getSidebarFilterData() {

			let data = {
				storeID: storage.getAppUserInfo().currentStoreId,
			}
			let result = await CY20.GetReserveAdvance(data);
			// 餐别,类型,关单类型
			let {
				dinnerType,
				orderType,
				isClose
			} = result;
			// 处理餐别
			dinnerType = dinnerType.map(v => {
				return {
					label: v.name,
					value: v.value,
					selected: false
				}
			});
			this.mealsAll = [{
				label: '全部',
				value: -1,
				selected: true,
			}];
			this.mealsAll.push(...dinnerType);

			// 处理类型
			this.orderType = orderType.map(v => {
				return {
					value: v.value,
					label: v.name,
				}
			});
		},
		// 去标签选择页
		gotoTagsPage() {
			console.log("去标签选择页");
			uni.navigateTo({
				url: '/pages/_common/editCustomerLabel/editCustomerLabel?sidebar=reserveList'
			});
		},
		// 选择预订类型
		selectOrderType(item) {
			this.filterQuery.bookOrderTypeType = this.filterQuery.bookOrderTypeType !== item.value ? item.value : null;
		},

		// 重置侧边栏数据
		resetSidebar() {
			this.filterQuery.bookOrderTypeType = null;
			this.filterQuery.isClose = null;

			//清空vuex当前标签状态
			this.setCurrentReserveTagsObj({
				content: '',
				ids: ''
			});
		},
		// 确认侧边栏数据
		confirmSidebar() {
			this.isShowSidebar = false;
			this.TodyBookQuery.bookOrderTypeType = this.filterQuery.bookOrderTypeType;
			let customerArr = this.filterQuery.customerLabel.split(',');
			if (customerArr[0] != '' && customerArr.length > 0) {
				this.TodyBookQuery.customerLabel = customerArr;
			} else {
				this.TodyBookQuery.customerLabel = '';
			}
			this.refresh();
		},

		// ------------------- methodsMescroll配置 ------------------------
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			if (this.isShowMeals || this.isCSManagerFilter) return;
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = this.TodyBookQuery;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;

			// 获取客户列表
			let result = await CY20.GetTodyBook(data,null,null,this.getTodyBook_IsShowLoading);
			
			this.getTodyBook_IsShowLoading=true; // 控制详情刷新表格 应该是静默刷新 刷新后 改成显示刷新
			if (result.dataList) {
				this.GetTodyBookSummaryOutData.feeSum = result.feeSum || 0;
				this.GetTodyBookSummaryOutData.allBookTableNumSum = result.allBookTableNumSum || 0;
				this.GetTodyBookSummaryOutData.allBookPeopleNumSum = result.allBookPeopleNumSum || 0;
				this.orderStatusArr.forEach((item, idx) => {
					// value: 2, label: '未结账', CheckedCount
					// value: 0, label: '待关单', ToBeCloseCount
					// value: 1, label: '已关单', ClosedCount
					if (item.value == 2) {
						item.num = result.checkedCount || 0;
					}
					if (item.value == 0) {
						item.num = result.toBeCloseCount || 0;
					}
					if (item.value == 1) {
						item.num = result.closedCount || 0;
					}
				});
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.dataList;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) {
					// 下拉刷新,更新关单面板数据
					this.TodyBookData = []; //如果是第一页需手动置空列表
					// this.getTodyBookSummary();
				}
				this.TodyBookData = this.TodyBookData.concat(curPageData); //追加新数据
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}

		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},

		// -------------------------- methods卡片 ---------------------
		// 去订单详情
		// gotoOrderInfo(tableIndex, order) {
		async gotoOrderInfo(ct) {
			try {
				await this.initAreaAndTable(ct, () => {
					console.log({
						'跳转到bookNow时的area信息': this.area
					});

					let obj = {
						bookID: ct.bookOrderID,
						tableID: ct.tableList[0].tableID,
						bookOn: ct.bookOn.slice(0, 10),
						dinnerType: ct.diningTypeID,
						fromPage: 'todayBook',
					};

					let param = util.urlEncode(obj).substring(1);

					const url =
						`/pages/homePageSub/bookNow/bookNow?${param}`;
					// console.log(url);
					uni.navigateTo({
						url,
					});
				});
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},
		// 初始化区域和桌台
		async initAreaAndTable(ct, cb) {
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				storeID: storeId,
				dinnerType: ct.diningTypeID,
				bookOn: ct.bookOn,
			};

			const tableAreaList = await this.getArea(data);

			this.requestOrders(ct, cb);
		},
		// 请求当前区域下订单
		requestOrders(ct, cb) {
			// 当前区域id
			const areaID = ct.tableAreaID;
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				areaID: [
					areaID
				],
				bookOn: ct.bookOn,
				type: ct.diningTypeID,
				storeID: storeId,
				isNotShowExists: 0, // 不显示已经有订单的桌台(1为不显示)
				isGetOrder: 1,
			};
			// 获取当前区域下所有桌台下的所有订单
			CY08.GetTabelInApp(data, result => {
				// 当前区域
				const areaTable = result.areaTable[0];
				areaTable.datalist.forEach(v => v.selected = false);
				const curArea = this.area.find(v => v.tableAreaID === areaTable.areaID);

				// 下面两个true重要
				curArea.selected = true;
				curArea.advance = true;
				// console.log(curArea);
				curArea.tableList = areaTable.datalist;

				this.setArea(this.area);
				cb && cb();
			});
		},
		// 去客户详情页
		gotoCustomInfo(ct) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(ct);
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${ct.bookOrderCustomerID}&fromPage=todaybook-list`,
			});
		},
		// 获取客户等级
		getCustomLevelImgUrl(item) {
			if (item.customerLevelImgUrl) {
				return cw.ImgServerUrl + item.customerLevelImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/level_D.png"
			}
		},
		// 去打电话
		gotoCallPhone(phone) {
			if (cw.isApp(true)) {
				cw.callPhone(phone,1);
			}
		},
		// 去发信息
		gotoSendMsg(ct) {
			if (ct.msgName == null) {
				ct.msgName = '';
			}
			if (ct.saleForecastLastFollow && ct.saleForecastLastFollow.customSaveName == null) {
				ct.saleForecastLastFollow.customSaveName = '';
			}
			// 尊称:msgName/通讯录名称:customSaveName
			//发短信欻订单id
			let url =
				`/pages/customerSub/sendMsg/sendMsg?isClue=3&customerID=${ct.bookOrderID}&customerName=${ct.bookerName}&phone=${ct.bookerPhone}&msgName=${ct.msgName}&customSaveName=${ct.saleForecastLastFollow ? ct.saleForecastLastFollow.customSaveName : ''}`;
			uni.navigateTo({
				url,
			});
		},
		// 去跟踪记录
		gotoRecord(ct) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(ct);
			// 为了跳转详情后,更改当前用户的[整理]状态后,返回客户列表页,已整理的状态图片即时更新
			cw.currentCustomerPoolItem = ct;
			const url = `/pages/_common/customInfo/customInfo?customerId=${ct.bookOrderCustomerID}&tabIndex=1`;
			uni.navigateTo({
				url,
			});
		},
		// 触发卡片工具栏更多
		triggerMenu(curMenu, curCustomer) {
			this.triggleList(curCustomer);
			switch (curMenu.value) {
				case 'wx-invitation':
					this.gotoMiniP(curCustomer, 'wx-invitation');
					break;
				case 'wx-evaluation':
					this.gotoMiniP(curCustomer, 'wx-evaluation');
					break;
				case 'record':
					this.gotoRecord(curCustomer);
				default:
					this.$util.baiduEvent('关单', '预订台列表卡片页关单');
					// console.log(curMenu, curCustomer);
					const status = curMenu.value;
					this.closeSingle(curCustomer, status);
					break;
			}
		},
		// 单个关单(status:绩效,默认false,有绩效)
		closeSingle(ct, status) {
			const self = this;
			let success = function() {
				// id集合(虽然只有一个)
				let idDtos = [{
					id: ct.bookOrderID,
					isCloseNotMoney: status == 2 ? 1 : 0, // 是否关单(无绩效)默认为0
					isClose: status == 0 ? 0 : 1, // 关单的状态(1,关单0,未关单)
				}];
				// 请求参数
				let obj = {
					idDtos
				};
				const end = function(result) {
					setTimeout(() => {
						uni.showToast({
							title: '操作成功!',
							duration: 2000
						});
					});
					self.refresh();
					cw.removeAaary(self.TodyBookData, ct);
				};
				self.$cw.singlePass(obj, end);
			}

			let tipText = status == 2 ? '无绩效关单' : status == 0 ? '取消关单' : '关单'
			let content = `是否对当前的预订进行${tipText}操作?`;
			uni.showModal({
				title: "提示",
				content: content,
				success(res) {
					if (res.confirm) {
						success();
					}
				}
			});
		},
		// 发送邀请函 & 邀请评价
		async gotoMiniP(ct, value) {
			let id = ct.bookOrderID;
			switch (value) {
				case "wx-evaluation": // 发送微信评价
					if (this.$cw.isApp(true)) {
						let shopId = storage.getAppUserInfo().currentStoreId
						let shopName = storage.getAppUserInfo().businessName + '(' + storage.getAppUserInfo().currentStoreName + ')'
						let salerId = storage.getAppUserInfo().marketerId
						let salerName = storage.getAppUserInfo().userName
						let title = '期待您对我们的服务做出评价';
						let desc = '期待您对我们的服务做出评价';
						let imgUrl = '';
						let int = this.$cw.weixinIntType;
						let webpageurl = "https://mp.weixin.qq.com"
						let pagePath = "pages/myOrderSub/commentsDetail/commentsDetail?id=" + id + "&shopId=" + shopId + "&salerId=" +
							salerId + "&salerName=" + salerName;
						let bgData = {
							shareBgType: 5, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
							banquetOrderGUID: '', // 宴会单id
							banquetProjectGUID: '', // 宴会项目id
							banquetTaskGUID: '', // 宴会任务id
							bookOrderId: id, // 预订单id
						};
						// 获取动态imgUrl
						let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
						const {
							bgUrl
						} = result;
						imgUrl = bgUrl;
						console.log(
							`
								webpageurl: ${webpageurl},
								pagePath: ${pagePath},
								title: ${title},
								desc: ${desc},
								imgUrl: ${imgUrl},
								int: ${int}
							`
						);
						this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int);

					}
					break;
				case "wx-invitation": // 发送微信邀请函
					let area = ct.masterTableName
					if (area.length != 0) {
						if (area.match(/[\u4e00-\u9fa5]+/)) {
							let reg = /[\u4e00-\u9fa5]+/;
							area = reg.exec(area)[0];
						} else {
							area = "";
						}
					} else {
						console.log("没有数据") // .net中就这么写的
					}
					let reg1 = /\d+/;
					// ["8010", index: 3, input: "杨春湖8010", groups: undefined]
					let tableNumberArr = reg1.exec(ct.masterTableName) || [''];
					let table = tableNumberArr && tableNumberArr[0];
					let storename = storage.getAppUserInfo().currentStoreName;
					let date = moment(ct.bookOn).format('YYYY-MM-DD');
					if (this.$cw.isApp(true)) {
						//    //let sendWeiXinInviteInfo = self.sendWeiXinInviteInfo
						let webpageurl = "https://mp.weixin.qq.com"
						let pagePath = "pages/myOrderSub/Invite/Invite?isShare=yes&id=" + id;
						// let title = '您已成功预订' + storename + date + "的" + area + table
						// let desc = '您已成功预订' + storename + date + "的" + area + table
						// let imgUrl = this.$cw.ImgServerUrl + '/upload/img/20200211/1130373037_invitePic.png';
						let title = '您已成功预订，期待您到来';
						let desc = '您已成功预订，期待您到来';
						let imgUrl = '';
						let int = this.$cw.weixinIntType;
						let bgData = {
							shareBgType: 5, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
							banquetOrderGUID: '', // 宴会单id
							banquetProjectGUID: '', // 宴会项目id
							banquetTaskGUID: '', // 宴会任务id
							bookOrderId: id, // 预订单id
						};
						// 获取动态imgUrl
						let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
						const {
							bgUrl
						} = result;
						imgUrl = bgUrl;
						console.log(
							`
								webpageurl: ${webpageurl},
								pagePath: ${pagePath},
								title: ${title},
								desc: ${desc},
								imgUrl: ${imgUrl},
								int: ${int}
							`
						);
						this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int);
					}
					break;
				default:
					break;
			}
		},


		// ---------------------- methods网络请求 ------------------------
		// 今日预订总览(废弃,直接从 CY20/GetTodyBook获取)
		async getTodyBookSummary() {
			let data = this.$cw.deepCopy(this.TodyBookQuery);

			let result = await CY20.getTodyBookSummary(data);
			if (!result) {
				console.log('!!! == todayBook 获取关单面板数据失败,请刷新重新获取 == !!!');
			} else {
				this.GetTodyBookSummaryOutData = result;
			}
		},

		// ---------------------- methodsUI处理 -------------------------
		// 计算mescroll距离顶部距离
		calcMescrollTop() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.top-filter-wrapper').boundingClientRect(data => {
					this.topFilterWrapperBottom = data.bottom.toString();
				}).exec();
			});
		},
		// 触发气泡list弹出
		triggleList(ct) {
			if (ct.isShowBubble == undefined) {
				this.$set(ct, 'isShowBubble', false);
			}
			ct.isShowBubble = !ct.isShowBubble;
		},
	},
	watch: {
		// ------------------- watch顶部筛选 ------------------
		'TodyBookQuery.bookOnStart': {
			handler: function(val, oldval) {
				if (this.notWatch) return;
				this.refresh();
				this.getHaveReserveSalesData();
			},
		},
		'TodyBookQuery.bookOnEnd': {
			handler: function(val, oldval) {
				if (this.notWatch) return;
				if (val == this.TodyBookQuery.bookOnStart) return;
				this.refresh();
				this.getHaveReserveSalesData();
			},
		},
		mealsAll: { // 餐别数组select变化
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected && item.value != this.TodyBookQuery.dinnerType) {
						this.TodyBookQuery.dinnerType = item.value;
						this.refresh();
					}
				})
			}
		},
		orderStatusArr: { // 顶部订单状态数据
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected) {
						this.TodyBookQuery.isClose = item.value;
						// 值变化后动态计算[每个卡片下]三个点显示的列表
						this.dyncMoreList = this.calcMoreList();
						this.dyncMoreList2 = this.calcMoreListForInvite();
					}
				})
			}
		},
		'TodyBookQuery.currentStoreId': {
			handler: function(val, oldval) {
				if (val) {
					this.refresh();
				}
			},
		},
		'TodyBookQuery.marketerId': {
			handler: function(val, oldval) {
				this.refresh();
			}
		},
		'TodyBookQuery.isClose': {
			handler: function(val, oldval) {
				this.refresh();
			}
		},
		// ------------------- watch侧边栏抽屉 --------------------
		"currentReserveTagsObj": {
			handler(val) {
				this.filterQuery.customerLabel = val.ids;
			},
			deep: true
		},

		// --------------------- watch其他 --------------------
		"userInfo.currentStoreId": {
			handler: function(val, oldval) {
				console.log('watch=>[todayBook]userInfo.currentStoreId');
				if (val) {
					this.initUserInfo();
					// 更新切换的店铺id
					this.TodyBookQuery.currentStoreId = val;
				}
			},
		},
		payload: {
			handler(val, oldVal) {
				if (val.tabIndex == 1) {
					this.dataType = val.dataType;
					this.notWatch = true;
					// 切时间
					this.fromDate();
					// 客户经理状态
					this.notWatch = false;
					this.initDataFromHome(this.dataType);
				}
			},
			deep: true
		},
	}
}
