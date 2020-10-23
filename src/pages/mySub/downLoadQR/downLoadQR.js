import GK10 from '@/service/GK/GK10AppService.js';
import API from '@/common/request.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			pageIndex: 1, //接口需要的页码
			pageSize: 10, //接口需要的每页条数
			currentType: 1, //当前页码
			isLoading: false, //判断是否在加载中，防止重复加载
			isBottom: false, //判断是否显示到达底部
			isDownload: false, //判断是否显示下载二维码页面
			currentQR: '', //存放二维码下载地址
			navList: [{
					name: '营销页',
					type: 1
				},
				{
					name: '会员卡',
					type: 2
				},
				{
					name: '优惠券',
					type: 3
				}
			], //左侧边栏内容与页数
			dataList: [], //存放接口返回的分享信息
			isShowPhoto: false
		};
	},
	mounted: function() {
		this.getList(1); //调用第一页数据
	},
	// uniapp生命周期：监听页面滚动到底部的事件
	// https://uniapp.dcloud.io/api/lifecycle?id=%e9%a1%b5%e9%9d%a2%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f
	onReachBottom() {
		++this.pageIndex;
		this.getList(this.currentType);
	},
	methods: {
		// 返回首页
		goBack() {
			// 返回上一页
			uni.navigateBack({
				delta: 1
			});
		},
		// 去分享码数据页
		toNext() {
			uni.navigateTo({
				url: '/pages/mySub/shareCodeReport/shareCodeReport'
			})
		},
		// 获取列表数据
		async getList(type) {
			if (this.isLoading || this.isBottom) return;
			this.isLoading = true;
			let that = this;
			let array = ['marketSet', 'hyCard', 'smallProgramCard'];
			let userInfo = this.$storage.getAppUserInfo();
			let data = {
				storeId: userInfo.currentStoreId,
				cWCompanyID: userInfo.cwCompanyID,
				type: type,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				codeType: ''
			};
			// console.log(data);
			let res = await GK10.GetShareInfo(
				data);
			if (!res) {
				that.isShowLoading = false;
				return false;
			}
			that.isLoading = false;
			if (res[array[type - 1]].dataList.length != 0) {
				if (that.dataList.length != 0) {
					that.dataList = that.dataList.concat(res[array[type - 1]].dataList);
				} else {
					that.dataList = res[array[type - 1]].dataList;
				}
			} else {
				that.isBottom = true;
			}

		},
		changeNav(type) {
			if (this.currentType == type) return;
			this.currentType = type;
			this.dataList = [];
			this.pageIndex = 1;
			this.isBottom = false;
			this.getList(this.currentType);
		},
		//下载图片
		async showDownLoad(type, item, num) {
			this.currentQR = '';
			let userInfo = this.$storage.getAppUserInfo();
			let array = ['marketSetID', 'hyCardID', 'smallProgramCardID'];
			let name = ['marketSetName', 'hyTypeName', 'cardName'];
			let titleArray = ['营销页', '会员卡', '优惠券'];
			let data = {
				storeId: userInfo.currentStoreId,
				marketerID: userInfo.marketerId,
				type: type,
				iD: item[array[type - 1]],
				codeType: num
			};

			let res = await GK10.DownloadShareQrCode(data);
			if (res) {
				this.currentQR = res.completeCodePath;
				this.isDownload = true;
			}
		},
		hideDownLoad() {
			this.isDownload = false;
		},
		sendWXImg() { //发送给朋友
			this.$cw.sendWXImageMessage(this.currentQR)
		},
		//保存照片
		downLoadR() {
			if (this.$cw.isApp(false)) {
				this.$cw.savePhoto(this.currentQR);
			} else {
				this.isShowPhoto = true;
			}
		},
		// 在app端隐藏图片
		hidePhoto() {
			this.isShowPhoto = false;
			uni.showToast({
				title: '图片已隐藏',
				icon: 'none'
			});
		}
	}
};
