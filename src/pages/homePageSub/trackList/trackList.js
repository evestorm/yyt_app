import CY17 from '@/service/CY/CY17AppService.js'; // GetMonthFollowBillboard
import storage from '@/common/unistorage/index.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			//年和月
			month: this.$moment().format('YYYY-MM'),
			monthTop10List: [], // 销售排行
			sellerMonthTop10Query: {
				storeID: storage.getAppUserInfo().currentStoreId,
				cWCompanyID: storage.getAppUserInfo().cwCompanyID,
				month: this.$moment().format('YYYY-MM')
			},
			//手机默认状态栏
			statusBarHeight: 0
		};
	},
	created() {
		this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
	},
	onLoad() {
		this.getTrickListData();
	},
	methods: {
		//切换月份
		chooseDate(e) {
			this.month = e.target.value;
		},
		//上一月
		goleft() {
			let currentDate = this.month + '-01';
			let premonth = this.$moment(currentDate)
				.add(-1, 'months')
				.format('YYYY-MM');
			this.month = premonth;
		},
		//下一月
		goright() {
			let currentDate = this.month + '-01';
			let nextmonth = this.$moment(currentDate)
				.add(1, 'months')
				.format('YYYY-MM');
			this.month = nextmonth;
		},
		// 获取跟踪排行
		async getTrickListData(month) {
			var self = this;
			var data = self.sellerMonthTop10Query;
			if (month) data.month = month;
			let result = await CY17.GetMonthFollowBillboard(data);
			self.monthTop10List = result.results;

		},
		//返回键
		onBack() {
			uni.navigateBack({
					delta:1
				});
		},
	},
	watch: {
		month() {
			this.getTrickListData(this.month);
		}
	}
};
