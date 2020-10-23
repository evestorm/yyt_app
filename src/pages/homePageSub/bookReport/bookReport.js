import CY20 from '@/service/CY/CY20AppService.js';
const app = getApp();

function getTimeArr() {
	return [{
			value: '0',
			label: '今日',
			selected: true,
		},
		{
			value: '1',
			label: '昨日',
			selected: false,
		},
		{
			value: '2',
			label: '本周',
			selected: false,
		},
		{
			value: '3',
			label: '本月',
			selected: false
		},
		{
			value: '4',
			label: '自定义',
			selected: false
		}
	];
}

export default {
	data() {
		return {
			navTitle: '预订报表',
			picDomain: app.globalData.PicDomain,
			activeIdx: 0, // 默认展示运营概况[运营概况:0/转化概况:1]
			timeSelected: 0, // 当前选择的日期类型
			operationTimeArr: getTimeArr(),
			conversionTimeArr: getTimeArr(),
			operationsReport: '',
			transforReport: '',
			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: this.$moment().subtract(10, 'years').format('YYYY'),
			endDateStr: this.$moment().add(10, 'years').format('YYYY'),
			defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
				.split('-')
			], //日期区间
			//存储的选择日期的类型
			timeSele: [0],
			tableArr: [{
				name: '客户',
				value: 'cstFeeAmount',
				unit: '(桌/¥)',
				sortDesc: true, // 降序
				selected: 1,
			}, {
				name: '宴会',
				value: 'banquetFeeAmount',
				unit: '(桌/¥)',
				sortDesc: true, // 降序
				selected: 0,
			}
			// ,{
			// 	name: '散客',
			// 	value: 'noCstFeeAmount',
			// 	unit: '(桌/¥)',
			// 	sortDesc: true, // 降序
			// 	selected: 0,
			// },
			],
			tableTransArr: [{
				name: '全部转化',
				value: 'totalFeeAmount',
				unit: '(桌/¥)',
				sortDesc: true, // 降序
				selected: 1,
			}, {
				name: '推荐转化',
				value: 'transforFeeAmount',
				unit: '(桌/¥)',
				sortDesc: true, // 降序
				selected: 0,
			}],
			isFirstLoad: true, // 第一次加载
			
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
		};
	},
	computed: {
		// 排序icon
		sortIcon() {
			return function(sortDesc, isActive) {
				if (isActive) {
					// return sortDesc ? this.picDomain + '/upload/yyticons/1044414441_Arrow-down-active.png' : this.picDomain +
					// 	'/upload/yyticons/1046374637_Arrow-up-active.png';
					return sortDesc ? this.picDomain + '/upload/yyticons/1146454645_Arrow-down.png' : this.picDomain +
							'/upload/yyticons/1146294629_Arrow-up.png';
				} else {
					// return sortDesc ? this.picDomain + '/upload/yyticons/1051445144_Arrow-down.png' : this.picDomain +
					// 	'/upload/yyticons/1051215121_Arrow-up.png';
					return this.picDomain + '/upload/yyticons/1144354435_arrow-default.png';
				}
			}
		},
	},
	components: {},
	onLoad(options) {
		this.urlOption = options;
		let { activeIdx } = this.urlOption;
		if (activeIdx != undefined) {
			this.activeIdx = activeIdx;
			if (activeIdx == 0) {
				this.navTitle = '预订报表';
			} else {
				this.navTitle = '转化报表';
			}
			// debugger
		}
		this.getStoreReport();
	},
	methods: {
		// 排序
		sortOperationsMarketerReports(item) {
			let tableSecArr=[];
			if(this.urlOption.activeIdx==1){//转化报表排序
				tableSecArr=this.transforReport.transforMarketerReports;
			}else{//预定报表排序
				tableSecArr=this.operationsReport.operationsMarketerReports;
			}
			// 之前不是选中状态
			if (!item.selected) {
				if(this.urlOption.activeIdx==1){//转化报表排序
					this.tableTransArr.forEach(v => v.selected = false);
				}else{//预定报表排序
					this.tableArr.forEach(v => v.selected = false);
				}
				item.selected = true;
				let newArr = tableSecArr.sort((a, b) => {
					return item.sortDesc ? b[item.value] - a[item.value] : a[item.value] - b[item.value]
				})
				return newArr
			} else { // 上一次是选中状态
				if (this.isFirstLoad) { // 第一次选中
					let newArr = tableSecArr.sort((a, b) => {
						return item.sortDesc ? b[item.value] - a[item.value] : a[item.value] - b[item.value]
					})
				} else {
					item.sortDesc = !item.sortDesc
					let newArr = tableSecArr.sort((a, b) => {
						return item.sortDesc ? b[item.value] - a[item.value] : a[item.value] - b[item.value]
					})
				}
			}
		},
		//获取时间
		onConfirm(e) {
			let start = e.from + ' 00:00:00';
			let end = e.to + ' 00:00:00';
			this.getStoreReport(start, end);
			if (this.activeIdx == 0) {
				if (e.from == e.to) {
					this.operationTimeArr[4].label = e.from
				} else {
					this.operationTimeArr[4].label = e.from + " - " + e.to;
				}
			} else if (this.activeIdx == 1) {
				if (e.from == e.to) {
					this.conversionTimeArr[4].label = e.from
				} else {
					this.conversionTimeArr[4].label = e.from + " - " + e.to;
				}
			}
		},
		//取消自定义
		cancelDatePicker() {
			this.timeSele.pop();
			if (this.activeIdx == 0) {
				this.operationTimeArr.forEach((listItem) => {
					listItem.selected = false;
				});
				this.operationTimeArr[this.timeSele[this.timeSele.length - 1]].selected = true;
			} else if (this.activeIdx == 1) {
				this.conversionTimeArr.forEach((listItem) => {
					listItem.selected = false;
				});
				this.conversionTimeArr[this.timeSele[this.timeSele.length - 1]].selected = true;
			}
		},
		//获取数据
		async getStoreReport(e, f) {
			if (this.timeSelected == 4 && e == undefined) return;
			let storeID = this.$storage.getAppUserInfo().currentStoreId;
			/* if(this.timeSelected==0){
				var starttime=this.$moment().format('YYYY-MM-DD')+' 00:00:00';
				var endtime =this.$moment().add(1,'days').format('YYYY-MM-DD')+' 00:00:00';
			 }*/
			let self = this;
			let data = {
				storeId: storeID, //门店id
				reportType: this.activeIdx, //报表类型(0,运营概况;1,转化概况)
				dateType: this.timeSelected, //日期类型(0,今日;1,昨日;2,本周;3,本月;4,自定义)
				startDate: e || "", //开始时间2020-01-09 00:00:00
				endDate: f || "" //结束时间
			}
			let result = await CY20.GetAppBookStoreReport(data);
			self.operationsReport = result.operationsReport;
			self.transforReport = result.transforReport;
			if(this.urlOption.activeIdx==1){//转化报表排序
				this.sortOperationsMarketerReports(this.tableTransArr[0]);
			}else{//预定报表排序
				this.sortOperationsMarketerReports(this.tableArr[0]);
			}
			this.isFirstLoad = false;

		},
		// --------------------- methods导航 -----------------
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		// --------------------- methods页面切换 -----------------

		// 显示运营概况
		showOperationDashboard() {
			this.activeIdx = 0;
			this.timeSelected = 0;
			this.operationTimeArr[4].label = "自定义";
			this.operationTimeArr.forEach((listItem) => {
				listItem.selected = false;
			});
			this.operationTimeArr[0].selected = true;
			this.getStoreReport();
		},
		// 显示转化概况
		showConversionDashboard() {
			this.activeIdx = 1;
			this.timeSelected = 0;
			this.conversionTimeArr[4].label = "自定义";
			this.conversionTimeArr.forEach((listItem) => {
				listItem.selected = false;
			});
			this.conversionTimeArr[0].selected = true;
			this.getStoreReport();
		},

		// 时间切换
		timeTabSelect(who, item) {
			if (item.selected && item.value != 4) return;
			this.operationTimeArr[4].label = "自定义";
			this.conversionTimeArr[4].label = "自定义";
			this.timeSele.push(item.value);
			who.forEach((listItem) => {
				listItem.selected = false;
			});
			this.timeSelected = item.value;
			if (item.value == 4) {
				this.$refs.range.show()
			}
			item.selected = true;
		}
	},
	watch: {
		operationTimeArr: { // 运营时间选择
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected) {
						this.isFirstLoad = true;
						this.getStoreReport()
					}
				})
			}
		},
		conversionTimeArr: { // 转化时间选择
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected) {
						this.isFirstLoad = true;
						this.getStoreReport()
					}
				})
			}
		},
	}
}
