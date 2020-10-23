import storage from '@/common/unistorage/index.js';
import UR01 from '@/service/UR/UR01AppService.js';
import CY18 from '@/service/CY/CY18AppService.js';
import Session from '@/service/Session/SessionAppService.js';
import cw from '@/common/ceiwei/common.js';
export default {
	state: {
		// 用户信息
		userInfo: {
			id: '', // UR0100000124
			loginName: '', // 636349
			userName: '', // 王元元
			email: '', // www@ww.ww
			phone: '', // 13917561400
			cwCompanyID: '', // UR0700000012
			currentStoreId: '', // STR00000041
			currentStoreName: '', // 解放路店
			loginId: 0, // 1031
			marketerId: '', // CY1700000023
			// isSeeAll: 0, // 1
			isAdjustMarket: 0, // 1
			imgUrl_ImgServer: "https://pic.cwyyt.cn",
			businessName: '', // 双湖园
			appInJson: {
				configs: []
			}, // 首页版块配置
			userHomeConfig: {
				configs: null,
			}, // 运营数据配置
		},
		// 店铺信息
		storeInfo: {
			storeId: '', // STR00000041
			branchName: '', // 解放路店
			cwCompanyID: '', // UR0700000012
		},
		// // 登录人权限
		// salesAuthority: {
		// 	isSeeAll: 0, // 查看所有
		// 	isAdjustMarket: 0, // 调整客户经理
		// 	isFinance: 0,
		// 	isCustomerTrack: 0,
		// 	isCompleteTarget: 0,
		// 	isTodayScheduled: 0,
		// 	isShowCustomerPool: 0,
		// 	isMonthlyStatistics: 0,
		// 	isMessageTemplate: 0,
		// 	isRefreshTrace: 0,
		// 	isViewComments: 0,
		// },
		// 登录状态
		isLogin: storage.getAppUserId() ? true : false,
		// 客户经理列表(仅展示app端需要显示的)
		chooseMarketData: [{
			value: '', // SL9449800000125
			text: '', // 01
			salseImg: '', // https://pic.yunyutian.cn//upload/img/20190704/1521362136_003.jpg
		}],
		// 所有客户经理列表（app和非app）带客户数
		AllChooseMarketData: [{
			value: '', // SL9449800000125
			text: '', // 01(16)
		}]
	},
	mutations: {
		// 设置登录状态
		setLoginState(state, b) {
			state.isLogin = b;
		},
		setUserInfo(state, data) {
			state.userInfo = data;
		},
		setStoreInfo(state, data) {
			state.storeInfo = data;
		},
		// setSalesAuthority(state, data) {
		// 	state.salesAuthority = data;
		// },
		setChooseMarketData(state, data) {
			state.chooseMarketData = data;
		},
		setAllChooseMarketData(state, data) {
			state.allChooseMarketData = data;
		}
	},
	actions: {
		// 登录请求
		async login({
			dispatch,
			commit
		}, payload) {
			const {
				userLoginInfo, // 用户信息
				//checked // 14天免登陆
			} = payload
			let result = await UR01.UserLogin(userLoginInfo);
			let {
				userInfo,
				myStoreDtos,
				// saleAuthority
			} = result;
			commit("setLoginState", true);
			let userId = result.userInfo.id;
			//checked ?
				storage.setAppUserId(userId, 14 * 60 * 60 * 24) ;
				//storage.setAppUserId(userId);
			// 对快速菜单的权限判断
			// if (!saleAuthority.isRefreshTrace) { // 刷新跟踪机会
			// 	userInfo.appInJson.configs = userInfo.appInJson.configs.filter(v => v.name != '刷新跟踪机会');
			// 	console.log(userInfo);
			// }
			// if (!saleAuthority.isCompleteTarget) { // 完成目标
			// 	userInfo.appInJson.configs = userInfo.appInJson.configs.filter(v => v.name != '完成目标');
			// }
			// 对运营概况的权限判断

			// 存储当前用户信息到storage+vuex
			storage.setAppUserInfo(userInfo);
			commit('setUserInfo', userInfo);
			// 登陆时设置为首页加载为true
			// getApp().globalData.homePageData.isLoad = true;
			// // // 存储权限到本地+vuex
			// storage.setSalesAuthority(saleAuthority);
			// commit('setSalesAuthority', saleAuthority);
			
			// 从 home.js 中获取
			await dispatch('getSwOptions', {
				// isGetAll: 0, // 0:获取个人;1:获取全部
			})

			// 门店列表存储到本地+vuex
			storage.setStoreData(myStoreDtos);
			// storeData存储在vuex的index.js中
			commit('setStoreData', myStoreDtos);
		},
		// 新获取当前用户信息
		async getCurrentUser({
			commit
		}) {

			// const userInfo = storage.getAppUserInfo();
			// 本地没有用户详细信息则重新请求设置,否则直接设置
			// if (!userInfo) {
			var self = this;
			let result = await Session.GetCurrentAppUserAsync({});

			// console.log({
			// 	"[Login登录页]GetCurrentAppUserAsync": result
			// });
			// 存储到storage+vuex
			storage.setAppUserInfo(result);
			commit('setUserInfo', result);

			// } else {
			// 	// 本地如果有,currentStore门店就是上次登录最后设置的门店					
			// 	resolve(userInfo);
			// }
		},
		// 获取当前用户信息
		// getCurrentUser({
		// 	commit
		// }) {
		// 	return new Promise((resolve, reject) => {
		// 		// const userInfo = storage.getAppUserInfo();
		// 		// 本地没有用户详细信息则重新请求设置,否则直接设置
		// 		// if (!userInfo) {
		// 		var self = this;
		// 		Session.GetCurrentAppUserAsync({}, (result) => {
		// 			console.log({
		// 				"[Login登录页]GetCurrentAppUserAsync": result
		// 			});
		// 			// 存储到storage+vuex
		// 			storage.setAppUserInfo(result);
		// 			commit('setUserInfo', result);



		// 			resolve(result);
		// 		}, err => {
		// 			reject('获取用户信息失败');
		// 		});
		// 		// } else {
		// 		// 	// 本地如果有,currentStore门店就是上次登录最后设置的门店					
		// 		// 	resolve(userInfo);
		// 		// }
		// 	});
		// },
		// 获取权限信息
		async getSalesAuthority({
			commit,
			state
		}) {

			const userInfo = storage.getAppUserInfo();
			const data = {
				storeId: userInfo.currentStoreId,
				marketerId: userInfo.marketerId
			}
			let result = await CY18.GetSalesAuthority(data);
			// console.log({
			// 	'[Login]salesAuthority': result
			// });
			// 存储本地+vuex
			storage.setSalesAuthority(result);
			commit('setSalesAuthority', result);
			return result;
		},
		// 获取客户经理列表(app或非app列表都拿到)
		async getMarketData({
			commit,
			state
		}) {

			var self = this;
			let result = (await CY18.GetStoreManager({StoreID:storage.getAppUserInfo().currentStoreId})).result;;
			let allMarketData = result.dataList;
			let marketDatas = [];
			let allMarketDatas = [];
			allMarketData.forEach((item, index) => {
				let obj = {
					value: item.marketerID,
					text: item.marketerName,
					salseImg: item.imgUrl ? cw.ImgServerUrl + "/" + item.imgUrl : "https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png"
				};
				marketDatas.push(obj);
				if (item.customerPoolCount > 0) {
					let obj2 = {
						value: item.marketerID,
						text: item.marketerName + `(${item.customerPoolCount})`
					};
					allMarketDatas.push(obj2);
				}
			})
			storage.setChooseMarketData(marketDatas);
			storage.setAllChooseMarketData(allMarketDatas);
			commit('setChooseMarketData', marketDatas);
			commit('setAllChooseMarketData', allMarketDatas);
		},
		removeSwMenuList({
			commit
		}) {
			// 清缓存
			storage.removeSwMenuList();
			// 重置快速菜单
			commit("setSwMenuList", []);
		}
	}
};
