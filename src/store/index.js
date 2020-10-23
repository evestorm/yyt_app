import Vue from 'vue';
import Vuex from 'vuex';
import CY16 from '@/service/CY/CY16AppService.js';
import cw from '@/common/ceiwei/common.js';
import storage from '@/common/unistorage/index.js';

import home from '@/store/home.js';
import user from '@/store/user.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		home,
		user,
	},
	state: {
		hasLogin: false,
		loginProvider: '',
		openid: null,
		area: [],
		// 机会备注(今日预订)
		todayChance: {
			customerSource: '',
			chanceNote: '',
		},
		// 机会备注(批量移入跟踪)
		cstListRemark: {
			chanceNote: '',
		},
		// 存储今日预订默认页顶部picker选项
		todayOptions: {
			date: cw.pikerGetDate(), // 选中时间
			curMealIdx: -1, // 选中餐别索引
			curFloorIdx: 1, // 选中区域ID
		},
		// 存储今日预订用户选择的桌台
		curSelectedTable: {
			// TB171100000353: true
		},
		// 首页侧边栏筛选条件
		sidebarFilter: {
			levelID: '', // 客户等级ID
			sellerID: storage.getAppUserInfo() ?
				storage.getAppUserInfo().marketerId : '', // 客户经理ID
			sellerName: storage.getAppUserInfo() ?
				storage.getAppUserInfo().userName : '', // 客户经理名称
			wajueID: '', // 挖掘条件
			tags: '', // 标签
			startDate: '', // 时间区间
			endDate: '',
			//endDate: moment().format('YYYY-MM-DD') + " 00:00:00",
			minMoney: '', // 人均消费范围
			maxMoney: '',
			minCount: '', // 消费频次范围
			maxCount: '',
			companyID: '', // 单位id
		},
		// 侧边栏选中的标签们
		currentTagsObj: {
			content: '',
			ids: '',
		},
		// 侧边栏选中的公司
		currentCompanyObj: {
			name: '',
			id: '',
			keyword: '',
		},
		// 预订台侧边栏标签
		currentReserveTagsObj: {
			content: '',
			ids: '',
		},
		// 客户跟踪侧边栏标签
		currentFollowTagsObj: {
			content: '',
			ids: '',
		},
		// 添加收件人侧边栏标签
		currentAddReceiveTagsObj: {
			content: '',
			ids: '',
		},
		currentCustomerItem: {}, // 当前客户item
		customerTab: 0, // 客户tab页面的index(客户跟踪:0,客户列表:1)
		reserveTab: -1, // 预订tab页面的index(卡片模式:0,列表模式:1)
		storeData: [], // 门店列表信息
		bookerInfo: {
			// uniapp不支持switchTabBar传参,保存一份到vuex临时存着
			// 预订人信息（客户id，客户姓名，客户电话, 宴会单id）
			customerID: '',
			bookerName: '',
			bookerPhone: '',
			banquetId: '',
		},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false;
			state.openid = null;
		},
		setOpenid(state, openid) {
			state.openid = openid;
		},
		setArea(state, area) {
			state.area = JSON.parse(JSON.stringify(area));
		},
		setTodayChance(state, todayChance) {
			state.todayChance = todayChance;
		},
		setCstListRemark(state, cstListRemark) {
			state.cstListRemark = cstListRemark;
		},
		setTodayOptions(state, todayOptions) {
			state.todayOptions = todayOptions;
		},
		setSidebarFilter(state, sidebarFilter) {
			state.sidebarFilter = sidebarFilter;
		},
		setCurrentTagsObj(state, currentTagsObj) {
			state.currentTagsObj = currentTagsObj;
		},
		setCurrentCompanyObj(state, currentCompanyObj) {
			state.currentCompanyObj = currentCompanyObj;
		},
		setCurrentCustomerItem(state, currentCustomerItem) {
			state.currentCustomerItem = currentCustomerItem;
		},
		setCurrentReserveTagsObj(state, currentReserveTagsObj) {
			state.currentReserveTagsObj = currentReserveTagsObj;
		},
		setCurrentFollowTagsObj(state, currentFollowTagsObj) {
			state.currentFollowTagsObj = currentFollowTagsObj;
		},
		setCurrentAddReceiveTagsObj(state, currentAddReceiveTagsObj) {
			state.currentAddReceiveTagsObj = currentAddReceiveTagsObj;
		},
		setCustomerTab(state, data) {
			state.customerTab = data;
		},
		setReserveTab(state, data) {
			state.reserveTab = data;
		},
		setStoreData(state, data) {
			state.storeData = data;
		},
		setCurSelectedTable(state, data) {
			state.curSelectedTable = data;
		},
		setBookerInfo(state, data) {
			state.bookerInfo = data;
		},
		initBookerInfo(state) {
			state.bookerInfo = {
				// uniapp不支持switchTabBar传参,保存一份到vuex临时存着
				// 预订人信息（客户id，客户姓名，客户电话, 宴会单id）
				customerID: '',
				bookerName: '',
				bookerPhone: '',
				banquetId: '',
			}
		}
	},
	actions: {
		async getArea({
			commit,
			state
		}, data) {
			let res = await CY16.GetAreaInAPP({
				storeID: data.storeID,
				dinnerType: data.dinnerType,
				bookOn: data.bookOn,
			},null,null,false);
			res.tableAreaList.forEach((area) => {
				area.selected = false;
				area.advance = false;
				area.tableList.forEach((table) => {
					table.selected = false;
				});
			});
			commit('setArea', res.tableAreaList);
			return res.tableAreaList;
		}
	},
});

export default store;
