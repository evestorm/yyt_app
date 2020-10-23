// --------------------------- import组件 -------------------
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';

// --------------------------- import库 ------------------------
import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';
import appConfig from '@/common/config/config.js'; //用于提示测试版本
// ---------------------------- import网络请求 -----------------------
import CY17 from '@/service/CY/CY17AppService.js'; // 获取/更新用户资料

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

import uniPopup from '@/components/uni-popup/uni-popup.vue';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// 客户信息customeritem
			customeritem: {
				customerName: storage.getAppUserInfo() ? storage.getAppUserInfo().userName : '',
				imgUrl: storage.getAppUserInfo().imgUrl_ImgServer
			},
			// StoreData: [], // 门店数据
			// 当前店铺信息
			currentStore: {
				branchName: '',
				storeId: ''
			},
			salesAuthority: {
				isAdjustMarket: 0,
				// isSeeAll: 0
			}, // 权限
			// app信息
			appInfo: {
				// 是否显示当前版本信息
				isSHowCurrentVersion: false,
				// app版本
				appVersionText: ''
			},
			// 列表信息
			list: [{
					url: '/pages/mySub/updatePwd/updatePwd',
					title: '修改密码',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/changePassword.png',
					isShow: storage.getSalesAuthority().isShowResetPwd
				},
				{
					url: '/pages/mySub/SMSTemplet/SMSTemplet',
					title: '短信话术模板',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/message-template.png',
					isShow: storage.getSalesAuthority().isMessageTemplate
				},
				{
					url: '/pages/mySub/SearchComment/SearchComment',
					title: '评价查询',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/EvaluationQuery.png',
					isShow: storage.getSalesAuthority().isViewComments
				},
				{
					url: '上传通话',
					title: '上传通话',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/SpeakUpload.png',
					isShow: storage.getSalesAuthority().isUploadCallRecords
				},
				{
					url: '/pages/mySub/downLoadQR/downLoadQR',
					title: '下载分享码',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/Download-Code.png',
					isShow: storage.getSalesAuthority().isShowDownload
				},
				{
					url: '/pages/mySub/homeSetting/homeSetting',
					title: '首页设置',
					thumb: app.globalData.PicDomain + '/upload/yytApp/my/Home-page-setting.png',
					isShow: storage.getSalesAuthority().isHomeSet
				},
			]

		};
	},
	computed: {
		...mapState(['storeData']),
		...mapState({
			userInfo: state => state.user.userInfo,
			isShowTest() { //是否显示测试版提示
				let bool = appConfig.domain == 'https://tapi.yunyutian.cn' ? true : false;
				return bool
			}
		}),
	},
	components: {
		uniList,
		uniListItem,
		uniPopup
	},
	onShow() {
		//更新头像
		if (storage.getAppUserInfo().imgUrl_ImgServer) {
			this.customeritem.imgUrl = storage.getAppUserInfo().imgUrl_ImgServer;
		} else {
			this.getProfile();
		}
	},
	onLoad() {
		this.getStores();
		this.getUserInfo();
		// 如果是在APP里面那么就展示当前app版本信息
		if (this.$cw.isApp(false)) {
			this.appInfo.isSHowCurrentVersion = true;
			this.appInfo.appVersionText = this.$cw.getVersion();
		}
	},
	methods: {
		...mapMutations(['setCurrentTagsObj', 'setCurrentCompanyObj']),
		...mapMutations(['setStoreInfo', 'setUserInfo', 'setSalesAuthority', 'setStoreData']),
		...mapActions(['getMarketData', 'getSalesAuthority', 'getSwOptions']),
		//跳转页面
		goto(url) {
			if (url == "上传通话") {
				if (this.$cw.isApp()) {
					uni.showToast({
						title: '操作成功',
						icon: 'none',
						duration: 2000
					});
					this.$cw.uploadCall();
				}
			} else {
				uni.navigateTo({
					url: url
				});
			}
		},
		//获取个人资料
		async getProfile() {
			const data = {
				id: storage.getAppUserInfo().marketerId,
			};
			let result = await CY17.GetViewDto(data);
			result = this.$util.null2str(result)
			if (result) {
				this.customeritem.id = result.marketerID;
				this.customeritem.imgUrl = result.imgUrl;
				this.customeritem.customerName = result.name;
				this.customeritem.email = result.email;
				this.customeritem.desc = result.desc;
				//缓存图片
				let userInfo = storage.getAppUserInfo();
				userInfo.imgUrl_ImgServer = result.imgUrl;
				userInfo.desc = result.desc;
				userInfo.email = result.email;
				storage.setAppUserInfo(userInfo);
			}

		},
		// 去编辑个人资料页面
		gotoEditProfile() {
			let userInfo = storage.getAppUserInfo();
			uni.navigateTo({
				url: `/pages/mySub/editProfile/editProfile?id=${userInfo.id}&imgUrl=${userInfo.imgUrl_ImgServer}&email=${userInfo.email}&desc=${userInfo.desc}`
			})
		},
		logOut() {
			//清空vuex客户列表标签状态
			this.$storage.removeCurrentTagList();
			this.setCurrentTagsObj({
				content: '',
				ids: '',
			});
			cw.logout();
		},
		// 展示切换门店的弹窗
		showMore() {
			this.$refs.morePopup.open();
		},
		// 获取门店信息
		getStores() {
			// 从本地拿
			let result = storage.getStoreData();
			this.setStoreData(result);
			this.checkCanViewStore();
		},
		getUserInfo() {
			// 从本地拿
			var userInfo = storage.getAppUserInfo();
			this.setUserInfo(userInfo);
		},
		// 检查用户能否查看至少一个门店信息,如果没权限查看则登出
		checkCanViewStore() {
			var self = this;
			// 看当前客户经理门店是否存在
			var userInfo = storage.getAppUserInfo();
			if (userInfo) {
				// 如果当前用户没权查看任何一个门店,则直接登出
				var isExists = self._.some(self.storeData, function(item, index, lst) {
					return item.storeId == userInfo.currentStoreId;
				})
				if (!isExists) {
					self.logoOut();
				}
			}
		},
		// 门店切换
		async chgStore(item) {
			uni.$emit('change-store', {
				...item,
				cb: () => {}
			});
			this.$refs.morePopup.close();
			// if (!item) return;

			// if (item.storeId != this.userInfo.currentStoreId) {
			// 	// 更新 userInfo 中的当前所处门店信息
			// 	var userInfo = storage.getAppUserInfo();
			// 	userInfo.currentStoreName = item.branchName;
			// 	userInfo.currentStoreId = item.storeId;

			// 	// 更新本地和vuex的 userInfo
			// 	storage.setAppUserInfo(userInfo);
			// 	this.setUserInfo(userInfo);
				
			// 	// 更新当前人销售员的默认门店的ID
			// 	var data = {
			// 		id: userInfo.marketerId,
			// 		defaultStoreID: item.storeId
			// 	};
			// 	let res = await CY17.UpdateByDto(data);

			// 	// 切换门店后再重新获取一次用户在当前门店所拥有的的权限,客户经理列表以及首页数据
			// 	this.getMarketData();
			// 	this.getSwOptions({
			// 		isGetAll: getApp().globalData.isGetAll
			// 	});
			// }
			// this.$refs.morePopup.close();
		},
	},
	watch: {
		"userInfo.currentStoreId": {
			handler: function(val, oldval) {
				if (val) {

				}
			},
		},
	}
};
