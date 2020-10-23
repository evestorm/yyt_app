// 作者:杨亮

//------------------------------mock数据引入---------------------------
import yytPieChart from './yyt-pie-chart_mock.js';
// -----------------------------import三方库---------------------------
import * as echarts from '@/lib/echarts/echarts.min.js';

export default {
	name: 'yyt-pie-chart',
	// 注册属性
	props: {
		isShow: false,
		chartData: { // 图表数据
			type: Array,
			require: false,
			default: () => {
				return [{
						color: "#79c3f2",
						desc: "客户 ¥16 (16%)",
						name: "客户",
						proportion: 53,
						value: 16,
					},
					{
						color: "#e6f279",
						desc: "宴会 ¥10 (10%)",
						name: "宴会",
						proportion: 33,
						value: 10,
					},
					{
						color: "#da79f2",
						desc: "散客 ¥2 (2%)",
						name: "散客",
						proportion: 6,
						value: 2,
					},
				]
			},
		},
	},
	data() {
		return {
			// ------------------ data百度eCharts -----------------------
			myCharts: null, // echart
			pieData: {}, // 组建内部使用数据
		};
	},
	mounted() {
		this.handleData();
	},
	methods: {
		// 处理数据
		handleData() {
			this.pieData.data = this._.cloneDeep(this.chartData); // 构造数据
			this.pieData.colorList = this.pieData.data.map(v => v.color); // 颜色list
			this.pieData.legendList = this.pieData.data.map(v => v.name); // 文字种类
			this.renderEcharts(); //绘e-charts
		},
		// 渲染echarts
		renderEcharts() {
			this.myCharts = echarts.init(this.$refs.pieChart.$el, null, {
				renderer: 'svg'
			});
			let option = {
				color: this.pieData.colorList,
				legend: {
					type: 'scroll',
					orient: 'vertical',
					left: '31%',
					top: '28%',
					itemWidth: uni.upx2px(24), // 图例图形宽度
					itemHeight: uni.upx2px(24), // 图例图形高度
					padding: 0, // 图例内边距，单位px，默认各方向内边距为5
					itemGap: uni.upx2px(20), // 各个item之间的间隔，单位px，默认为10，
					data: this.pieData.legendList,
					formatter: (name) => { //饼图描述富文本
						let dCount, dProportion, dDesc;
						let data = this.pieData.data;
						let descStr = '';
						for (let i = 0; i < data.length; i++) {
							if (data[i].name === name) {
								dCount = data[i].value;
								dProportion = data[i].proportion;
								dDesc = data[i].desc;
							}
						}
						// let desc = `{a|${name}}{b|${dProportion}}{c|  %}{d|${dCount}}`;
						// abc代表文字样式的名称（见下）
						let arr = [dDesc];
						return arr.join("\n")
					},
					textStyle: {
						rich: {
							a: {
								color: '#595959',
								fontSize: uni.upx2px(28),
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
							},
							e: {
								color: '#595959',
								fontSize: uni.upx2px(24),
								fontWeight: 'bold',
								fontFamily: 'PingFang-SC'
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					left: 'left',
					radius: '64%',
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

			//设置动态高度。
			this.$refs.pieChart.$el.style.height = 120 + 'px';
			this.myCharts && this.myCharts.resize();
		},
	},
	computed: {},
	filters: {},
	watch: {
		"chartData": {
		   handler(val, oldval) {
		       this.$nextTick(() => {
				   this.handleData();
			   });
		   },
		   deep: true,
		},
		isShow: {
			handler() {
				this.handleData();
			},
			deep: true,
		}
	},
};
