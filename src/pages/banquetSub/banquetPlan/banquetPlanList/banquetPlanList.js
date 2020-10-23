// 作者:覃彬
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';

export default {
	data() {
		return {
			// nowmonth: this.$moment().format('YYYY-MM'), //月份
			orderSumDetail: {
				payDepositAmount: 0,
				totalSaleAmount: 0,
				tableFeeAvgAmount: 0,
				personalFeeAvgAmount: 0,
			}, //页面显示宴会汇总数据
		};
	},
	props: {
		month: { //接收大的月份数据
			type: String,
			default: '2020-06'
		}
	},
	// 页面加载事件
	created() {
		this.getOrderMonthSummaryStat(this.month);
	},
	methods: {
		// 获取宴会月汇总统计
		async getOrderMonthSummaryStat(month) {
			const data = {
				month: month,
				storeId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店id
			};
			let result = await YHBanquetOrder.GetOrderMonthSummaryStat(data);
			this.orderSumDetail = this.$util.null2str(result)
		}
	},
	computed: {
		
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
	},
	watch: {
		"month": {
			handler: function(val, oldval) {
				if (val) {
					this.getOrderMonthSummaryStat(val);
				}
			}
		}
	}
	// ## 方法
};
