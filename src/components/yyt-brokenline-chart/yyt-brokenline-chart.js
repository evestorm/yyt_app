// 作者:杨亮
// ------------ import三方库 --------------
import * as echarts from '@/lib/echarts/echarts.min.js';

export default {
	name: 'yyt-brokenline-chart',
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
		color: { // 折线的颜色
			type: String,
			require: false,
			default: '#48b3FF'
		},
		showDataZoom: false, // 是否显示底部滑块
		yMinInterval: {
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
			// 	'style': this.$refs.brokenlineChart.$el.style
			// });
			if (this.chartData[0].length == 0) {
				this.$refs.brokenlineChart && (this.$refs.brokenlineChart.$el.style.height = '0px')
			}
			this.renderEcharts();
		},
		// 渲染echarts
		renderEcharts() {
			let self = this;
			this.myCharts = echarts.init(this.$refs.brokenlineChart.$el, null, {
				renderer: 'svg'
			});
			let option = {
				backgroundColor: '#fff',
				tooltip: { // 提示框
					show: false,
					trigger: 'axis',
					backgroundColor: 'rgba(0,0,0,0.5)',
					axisPointer: { // 折线所占区域的渐变颜色
						type: 'cross',
						lineStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: '#ffffff'
								}, {
									offset: 0.5,
									color: '#435ff2',
								}, {
									offset: 1,
									color: '#ffffff'
								}],
								global: false
							}
						},
					},
				},
				dataZoom: [{ // 底部滑动条，不过移动端无效
					show: this.showDataZoom ? true : false,
					type: "slider",
					/*类型*/
					xAxisIndex: 0,
					/*对应的轴*/
					bottom: "0",
					/*位置，定位*/
					start: 0,
					/*开始*/
					end: 100,
					/*结束*/
					handleIcon: "M0,0 v9.7h5 v-9.7h-5 Z",
					handleStyle: { /*手柄的样式*/
						color: "#40bcf9",
						borderColor: "#1fb2fb"
					},
					backgroundColor: "#e2f3ff",
					/*背景 */
					dataBackground: { /*数据背景*/
						lineStyle: {
							color: "#000000"
						},
						areaStyle: {
							color: "#d4d9dd"
						}
					},
					fillerColor: "rgba(31,178,251,0.2)",
					/*被start和end遮住的背景*/
					bottom: '0'
				}],
				grid: {
					top: '10%',
					left: '5%',
					right: '10%',
					bottom: this.showDataZoom ? '20%' : '0',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					color: '#59588D',
					axisLine: {
						show: true,
						lineStyle: {
							// 设置x轴颜色
							color: '#f2f2f2'
						}
					},
					axisLabel: {
						color: '#282828',
						// clickable: true, //并给图表添加单击事件  根据返回值判断点击的是哪里
						interval: 0,
						// formatter: function(params, index) {
						// 	// return params.split("").join("\n"); // 竖着显示文字
						//	// 隔一个换行
						// 	if (index % 2 != 0) {
						// 		return '\n\n' + params;
						// 	} else {
						// 		return params;
						// 	}
						// }
						formatter: function(params, index) {
							if (self.dataLen > 4) {
								return index == 0 || index == self.dataLen - 1 ? params : '';
							} else {
								return params;
							}
						}
					},
					splitLine: {
						// show: true
						// lineStyle: {
						// 	color: '#DBDBDB'
						// },
					},
					axisTick: {
						show: false
					},
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				}],
				yAxis: [{
					minInterval: this.yMinInterval,
					type: 'value',
					min: 0,
					splitNumber: 6, // 为y轴设置多少个刻度
					splitLine: {
						show: true,
					},
					axisLine: {
						show: false, // y轴不显示竖着的横线
					},
					axisLabel: {
						show: true,
						// margin: 20,
						textStyle: {
							color: '#737373',
						},
					},
					axisTick: {
						show: false,
					},
					splitLine: { // 平行于x轴的分隔线
						lineStyle: {
							color: '#F2F2F2',
							type: 'solid', // dashed 虚线
						}
					}
				}],
				series: [{
					name: '',
					type: 'line',
					// smooth: true, //是否平滑
					showAllSymbol: true,
					symbol: 'circle',
					symbolSize: 5,
					lineStyle: {
						normal: {
							color: this.color
						},
					},
					label: {
						show: false,
						position: 'top',
						textStyle: {
							color: this.color,
						}
					},
					itemStyle: {
						color: "#FFF",
						borderColor: this.color,
						borderWidth: 2,
					},
					tooltip: {
						show: false,
					},
					areaStyle: {
						// normal: {
						// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						// 			offset: 0,
						// 			color: 'rgba(195,230,255,1)'
						// 		},
						// 		{
						// 			offset: 1,
						// 			color: 'rgba(195,230,255,0.1)'
						// 		}
						// 	], false),
						// 	shadowColor: 'rgba(195,230,255,0.1)',
						// 	shadowBlur: 20
						// }
					},
					data: [55, 35, 62, 55, 97, 64, 44, 66, 78, 82, 33, 77],
				}]
			};
			option.xAxis[0].data = this.chartData[0];
			option.series[0].data = this.chartData[1];
			// 使用刚指定的配置项和数据显示图表。
			this.myCharts.setOption(option);

			// //设置动态高度。
			this.$refs.brokenlineChart.$el.style.height = 200 + 'px';
			this.myCharts && this.myCharts.resize();
		},
	},
	computed: {
		dataLen(val) { // x轴数据长度
			return this.chartData[0].length || 0;
		}
	},
	filters: {},
};
