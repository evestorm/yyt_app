import YHClue from '@/service/YH/YHClueAppService.js'

import yytReportTable from "@/components/yyt-report-table/yyt-report-table.vue"
import * as echarts from '@/lib/echarts/echarts.min.js'; //引入echarets
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			queryData: { //请求参数
				startDate: '', //开始时间
				endDate: '', //结束时间
				storeID: this.$storage.getAppUserInfo().currentStoreId, //,门店ID
				isGetAllData: 1, //是否获取概况数据
				type: 1 //获取类型(1,等级2来源3状态)
			},
			dateRange: { //picker组件选择时间范围
				startDate: this.$moment().subtract(10, 'years').format('YYYY'), //开始时间
				endDate: this.$moment().add(10, 'years').format('YYYY'), //结束时间
				defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
					.split('-')
				],
			},
			general: {}, //线索概况数据
			echartsOfType: [{ //查询数据类型数组集合
					text: '等级',
					colorList: ['#f00', '#FF4E00', '#FFAE00'], //用于e-charts颜色显示
					tableHead: ['客户经理', '线索总量', 'A', 'B', 'C'] //用于table表头显示
				},
				{
					text: '来源',
					colorList: ['#FFAE00', '#0183FF', '#4ECB73'],
					tableHead: ['客户经理', '客户总量', '手动录入', '营销页', '三方平台'] //用于table表头显示
				},
				{
					text: '状态',
					colorList: ['#FDA51B', '#FF4E00', '#D9D9D9'],
					tableHead: ['客户经理', '全部', '跟进中', '成交', '取消', '成交率(%)'] //用于table表头显示
				}
			],
			pieData: {}, // echart数据
			myCharts: null, // echart
			titleList: ['客户经理', '线索总量', 'A', 'B', 'C'], //表格表头
			tableDataList: [], //表格内容
		};
	},
	components: {
		yytReportTable
	},
	// 页面加载事件
	onLoad() {
		//请求接口的时间范围
		this.queryData.startDate = this.$moment().format('YYYY-MM');
		this.queryData.endDate = this.$moment().format('YYYY-MM');
		this.getLeadReportData();
	},
	methods: {
		//选择切换月份范围
		selDataRange() {
			this.$nextTick(() => {
				this.$refs.dateRange.show();
			});
		},
		onConfirmDateRange(val) { //确认选择时间范围
			this.queryData.startDate = val.from.slice(0, 7);
			this.queryData.endDate = val.to.slice(0, 7);
		},
		// 前一月
		getPre() {
			this.queryData.startDate = this.$moment(this.queryData.startDate).subtract(1, 'months').format('YYYY-MM');
			this.queryData.endDate = this.$moment(this.queryData.endDate).subtract(1, 'months').format('YYYY-MM');
		},
		// 后一月
		getNext() {
			this.queryData.startDate = this.$moment(this.queryData.startDate).add(1, 'months').format('YYYY-MM');
			this.queryData.endDate = this.$moment(this.queryData.endDate).add(1, 'months').format('YYYY-MM');
		},
		//获取线索报表数据
		async getLeadReportData() {
			let rdata = await YHClue.GetLeadReportData(this.queryData);
			if(rdata){
				this.general = this.$util.null2str(rdata.general); //线索概况数据
				let index = this.queryData.type - 1; //获取类型(1,等级2来源3状态)
				let statistics = rdata.statistics.reverse(), //echarts饼图数据
					colorList = this.echartsOfType[index].colorList, //echarts饼图颜色选择
					legendList = [];
				legendList = this._.map(statistics, 'name');
				this.pieData = {
					data: statistics,
					color: colorList,
					legendList: legendList
				}
				this.titleList = this.echartsOfType[index].tableHead; //表头
				this.tableDataList = rdata.marketerData.markerData;
				this.renderEcharts(); //绘e-charts
			}
		},
		// 渲染echarts
		renderEcharts() {
			this.myCharts = echarts.init(this.$refs.orderChart, null, {
				renderer: 'svg'
			});
			let option = {
				color: this.pieData.color,
				legend: {
					type: 'scroll',
					orient: 'vertical',
					left: '40%',
					top: '20%',
					itemWidth: 8, // 图例图形宽度
					itemHeight: 8, // 图例图形高度
					padding: 0, // 图例内边距，单位px，默认各方向内边距为5
					itemGap: uni.upx2px(40), // 各个item之间的间隔，单位px，默认为10，
					data: this.pieData.legendList,
					formatter: (name) => { //饼图描述富文本
						let dCount, dProportion;
						for (let i = 0; i < this.pieData.data.length; i++) {
							if (this.pieData.data[i].name === name) {
								dCount = this.pieData.data[i].value;
								dProportion = this.pieData.data[i].proportion;
							}
						}
						let arr = [`{a|${name}}{b|${dProportion}}{c|  %}{d|${dCount}}`];
						return arr.join("\n")
					},
					textStyle: {
						rich: {
							a: {
								color: '#595959',
								fontSize:uni.upx2px(28),
								width: uni.upx2px(120),
							},
							b: {
								color: '#0183FF',
								fontSize: uni.upx2px(40),
								fontWeight: 'bold',
								fontFamily: 'PingFang-SC-Bold'
							},
							c: {
								color: '#0183FF',
								fontSize: uni.upx2px(22),
								width: uni.upx2px(80)
							},
							d: {
								color: '#0183FF',
								fontSize: uni.upx2px(40),
								fontWeight: 'bold',
								fontFamily: 'PingFang-SC-Bold'
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					left: 'left',
					radius: '70%',
					data: this.pieData.data,
					center: ['17%', '50%'],
					label: { //去除饼图的指示折线label
						normal: {
							show: false,
							position: 'inside',
							formatter: "{b}:{d}%"
						},
					},
				}]
			};
			this.myCharts.setOption(option);
		}
	},
	watch: {
		"queryData": {
			handler: function(val, oldval) {
				if (val) {
					this.getLeadReportData();
				}
			},
			deep: true,
		}
	}
	// ## 方法
};
