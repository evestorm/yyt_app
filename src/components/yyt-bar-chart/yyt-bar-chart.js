// 作者:杨亮
// ------------ import三方库 --------------
import * as echarts from '@/lib/echarts/echarts.min.js';

export default {
	name: 'yyt-bar-chart',
	// 注册属性
	props: {
		chartArr: { // 原数组
			type: Array,
			require: true,
			default: () => [
				//e.g.
				//{
				// 	typeID: 1,
				// 	typeName: '生日宴',
				// 	typeCount: 30
				// }
			]
		},
		keyAttr: { // 标签名称 e.g. typeName
			type: String,
			require: true,
			default: 'Name'
		},
		valueAttr: { // 值名称 e.g. typeCount
			type: String,
			require: true,
			default: 'Count'
		},
		xName: { // x轴单位
			type: String,
			require: false,
			default: ''
		},
		xMinInterval: {
			type: [Number, String],
			require: false,
			default: 0, // 设置成1保证坐标轴分割刻度显示成整数
		}
	},
	watch: {
		chartArr: {
			handler: function(val, oldval) {
				this.handleData();
			},
			// immediate: true,
		},
		keyAttr: {
			handler: function(val, oldval) {
				this.handleData();
			},
		},
		valueAttr: {
			handler: function(val, oldval) {
				this.handleData();
			},
		},
	},
	mounted() {
		this.handleData();
	},
	data() {
		return {
			// ------------------ data百度eCharts -----------------------
			myCharts: null, // echart
			chartData: [
				["婚宴", "生日宴"],
				[3, 2]
			], // echart数据
		};
	},
	methods: {
		// 处理数据
		handleData() {
			// let chartArr = [];
			this.chartData = [
				[],
				[]
			];
			this.chartArr.forEach((v, idx) => {
				this.chartData[0].unshift(v[this.keyAttr]);
				this.chartData[1].unshift(v[this.valueAttr]);
			});
			// console.log({
			// 	"chartArr": this.chartArr,
			// 	'chartData': this.chartData,
			// 	'style': this.$refs.barChart.$el.style
			// });
			if (this.chartData[0].length == 0) {
				this.$refs.barChart && (this.$refs.barChart.$el.style.height = '0px')
			}
			this.renderEcharts();
		},
		// 渲染echarts
		renderEcharts() {
			this.myCharts = echarts.init(this.$refs.barChart.$el, null, {
				renderer: 'svg'
			});
			let option = {
				title: {
					text: '',
					subtext: ''
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					bottom: '10px',
					data: []
				},
				grid: {
					left: '0',
					right: '50px',
					bottom: '0',
					top: '10px',
					containLabel: true
				},
				xAxis: {
					minInterval: this.xMinInterval,
					name: this.xName ? `(${this.xName})` : '',
					type: 'value',
					boundaryGap: [0, 0.05],
					splitLine: {
						lineStyle: {
							type: 'solid',
							color: '#F2F2F2'
						}
					},
					"axisLine": {
						lineStyle: {
							color: '#fff'
						}
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(153,153,153,1)',
							fontSize: uni.upx2px(24) //更改坐标轴文字大小，自适应
						}
					},
					nameTextStyle: {
						color: 'rgba(153,153,153,1)'
					},
				},
				yAxis: {
					type: 'category',
					data: [
						'会议', '生日宴',
					],
					splitLine: {
						show: false
					},
					"axisLine": {
						lineStyle: {
							color: '#f2f2f2',
							style: 'solid'
						},
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(89,89,89,1)'
						},
						interval: 0, // 解决只有两条数据时，y轴的第一个label不显示
						formatter: function(data) {
							return data;
						}
					},
					"axisTick": {
						lineStyle: {
							style: 'solid'
						},
					},
				},
				series: [{
					name: '',
					type: 'bar',
					itemStyle: {
						color: '#3aa0ff',
					},
					barWidth: '' + uni.upx2px(20),
					data: [
						1, 2
					],
					label: {
						normal: {
							show: true,
							textStyle: {
								color: 'rgba(66,66,66,1)',
								fontSize: 13,
								fontWeight: 'bold'
							},
							position: 'right',
							formatter: function(data) {
								return data.value;
							}
						}
					},
				}],
			};
			option.yAxis.data = this.chartData[0];
			option.series[0].data = this.chartData[1];
			// 使用刚指定的配置项和数据显示图表。
			this.myCharts.setOption(option);

			//柱状图y轴的长度 option.yAxis.data.length
			var autoHeight = uni.upx2px((option.yAxis.data.length + 1) * 30 * 2);
			// console.log({
			// 	"autoHeight": autoHeight
			// });
			//设置动态高度。
			this.$refs.barChart.$el.style.height = autoHeight + 'px';
			this.myCharts && this.myCharts.resize();
		},
	},
	computed: {},
	filters: {},
};
