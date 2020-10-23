import storage from '@/common/unistorage/index.js';
import {
	swMenuList,
	swOperate
} from '@/static/mock/home.js';
import UR01AppService from '@/service/UR/UR01AppService.js';
import _ from "@/lib/lodash/lodash.js";

export default {
	state: {
		swMenuList: swMenuList, // 顶部快速菜单(默认值)
		// swOperate: swOperate, // 运营概况(个人)
		// swOperateAll: swOperate, // 运营概况(全部)
		// 登录人权限
		salesAuthority: {
			// isSeeAll: 0, // 查看所有
			isAdjustMarket: 0, // 调整客户经理
			isFinance: 0,
			isCustomerTrack: 0,
			isCompleteTarget: 0,
			isTodayScheduled: 0,
			isShowCustomerPool: 0,
			isMonthlyStatistics: 0,
			isMessageTemplate: 0,
			isRefreshTrace: 0,
			isViewComments: 0,
		},
	},
	mutations: {
		setSwMenuList(state, data) {
			state.swMenuList = data;
		},
		// setSwOperate(state, data) {
		// 	state.swOperate = data;
		// },
		// setSwOperateAll(state, data) {
		// 	state.swOperateAll = data;
		// },
		setSalesAuthority(state, data) {
			state.salesAuthority = data;
		},
	},
	actions: {
		// 获取首页板块配置以及对应板块数据
		async getSwOptions({
			commit,
			state
		}, payload) {
			// const {
			// 	isGetAll
			// } = payload; // 0:获取个人;1:获取全部

			const self = this;
			const userInfo = storage.getAppUserInfo();
			const data = {
				uR01ID: userInfo.id,
				storeID: userInfo.currentStoreId,
				cWCompanyID: userInfo.cwCompanyID,
				// isGetAll: isGetAll,
			};

			// const tempOperate = _.cloneDeep(swOperate);
			// const tempAllOperate = _.cloneDeep(swOperate);
			let result = await UR01AppService.GetHomeDetail(data);
			if (!result) {
				return Promise.reject('获取首页信息失败');
			}
			// ---------- 处理快速菜单 ----------
			commit('setSwMenuList', swMenuList);
			storage.setSwMenuList(swMenuList);
			
			// ---------- 把 getHomeDetail 数据嫁接到 appUserInfo 中去
			if (result) {
				// 顶部快速菜单
				userInfo.appInJson.configs = result.appInJson.configs;
				// 顶部tabnav
				userInfo.userHomeConfig.configs = result.appOperateJson.configs;
				// 提醒板块
				userInfo.userHomeConfig.noticeConfigs = result.appOperateJson.noticeConfigs;
				userInfo.notificationCount = result.notificationCount;
				storage.setAppUserInfo(userInfo);
				commit('setUserInfo', userInfo);
			}

			// ---------- 处理运营概况 ----------
			
			// 获取权限（saleAuthority现在从homeDetail中获取）
			// 存储权限到本地+vuex
			console.log(result)
			storage.setSalesAuthority(result.saleAuthority);
			storage.setStoreAuthority(result.storeAuthority);//门店权限
			storage.setNotificationCount(result.notificationCount);//消息通知
			commit('setSalesAuthority', result.saleAuthority);
			
			return {
				saleAuthority: result.saleAuthority
			}
		}
	}
};
