// --------- import网络请求 ------------
import CY17 from '@/service/CY/CY17AppService.js';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
// --------- import组件 ---------------
import yytReportTable from "@/components/yyt-report-table/yyt-report-table";
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// ------------- data顶部tab -----------------
			reportTypeArr: [{
					label: '宴会数据',
					selected: true,
					value: 0
				},
				{
					label: '主题数据',
					selected: false,
					value: 1
				},
				{
					label: '套餐数据',
					selected: false,
					value: 2
				}
			], // 顶部订单状态数组
			curTabIdx: 0, // 当前顶部tab索引

			// ------------- data宴会概况 -------------
			curDataType: '状态', // 状态 / 宴会

			// ------------------ data百度eCharts -----------------------
			myCharts: null, // echart
			chartArr: [], // echart原始数据
			// ------------- data宴会数据 --------------
			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: this.$moment().subtract(10, 'years').format('YYYY'),
			endDateStr: this.$moment().add(10, 'years').format('YYYY'),
			// ['2010','01','01','-','2030','01','01']
			defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD').split('-')],
			
			// ------------------- data列表数据请求 ----------------
			queryData: {
				storeID: this.$storage.getAppUserInfo().currentStoreId,
				startDate: this.$moment().format('YYYY-MM'),
				endDate: this.$moment().format('YYYY-MM'),
				type: 1, // 获取类型(1,宴会数据2,主题数据3,套餐数据)
				generalType: 1, // 概况类型(1,状态2,类别)
			},
			result: {}, // 请求数据
			banquetGeneral: {
				executioningCount: 0, // 执行中
				finishCount: 0, // 已执行
				accomplishCount: 0, // 已完成
				cancelCount: 0, // 取消
				addCount: 0, // 新增
			}, // 宴会概况
			marketData: null, // 经理数据

			// -------------- data客户经理详情 -----------
			csTitleList: ['宴会总量', '执行中', '已执行', '已完成', '取消', '新增'],
			csTableDataList: [
				['全部', 1111, 12, 44, 33, 66, 11111],
				['李白', 2111, 22, 44, 33, 66, 2222],
				['杜甫', 3111, 32, 44, 33, 66, 33333],
				['白居易', 4111, 42, 44, 33, 66, 0],
			],
		};
	},
	components: {
		yytReportTable,
	},
	// 页面加载事件
	onLoad() {
		// 用户信息
		const userInfo = this.$storage.getAppUserInfo();
		this.requestData();
	},
	methods: {
		// 切换顶部tab
		reportTypeTabSelect(e, item) {
			if (item.selected) return;
			this.reportTypeArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
			this.curTabIdx = item.value;
			this.queryData.type = this.curTabIdx + 1;
		},
		// 前一月
		getPre() {
			let currentDate = this.queryData.startDate.slice(0, 7);
			let next = this.$moment(currentDate).add(-1, 'months').format('YYYY-MM-DD')
			this.queryData.startDate = next.slice(0, 7);
			this.queryData.endDate = next.slice(0, 7);
			this.defaultDateRangeArr = [...next.split('-'), '-', ...next.split('-')];
		},
		// 后一月
		getNext() {
			let currentDate = this.queryData.startDate.slice(0, 7);
			let next = this.$moment(currentDate).add(1, 'months').format('YYYY-MM-DD')
			this.queryData.startDate = next.slice(0, 7);
			this.queryData.endDate = next.slice(0, 7);
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
			console.log({'确认时间的范围': val});
			this.queryData.startDate = val.from.slice(0, 7);
			this.queryData.endDate = val.to.slice(0, 7);
		},
		// 宴会概况面板数据切换(状态,全部)
		changeDataType(type) {
			if (this.curDataType == type) return;
			this.curDataType = type;
			this.queryData.generalType = this.curDataType == '状态' ? 1 : 2;
		},
		// --------------- methods数据请求 ------------
		async requestData() {
			const result = await YHBanquetOrder.GetBanquetDataReport(this.queryData);
			if (result) {
				const { banquetGeneral, marketData } = result;
				this.result = result;
				if (banquetGeneral) {
					// 不是数组，就是宴会概况，否则是百度图表数据

					!Array.isArray(banquetGeneral) ? 
						this.banquetGeneral = banquetGeneral :
						this.chartArr = banquetGeneral;
						// chartArr = [{
						// 	typeID: 1,
						// 	typeName: '生日宴',
						// 	typeCount: 30
						// }, {
						// 	typeID: 2,
						// 	typeName: '升学宴',
						// 	typeCount: 180
						// },{
						// 	typeID: 3,
						// 	typeName: '婚宴',
						// 	typeCount: 200
						// }];
				}
				let { typeName, markerData } = marketData;
				// console.log({typeName, markerData});
				this.csTitleList = typeName;
				this.csTableDataList = markerData;
			}
		},
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
	},
	watch: {
		"queryData": {
		   handler: function (val, oldval) {
		       if (val) {
				   // console.log(val);
		           this.requestData();
		       }
		   },
		   deep: true,
		}
	}
	// ## 方法
};
