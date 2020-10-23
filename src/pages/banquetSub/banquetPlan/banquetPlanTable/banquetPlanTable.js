// 作者:覃彬
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';

export default {
	data() {
		return {
			pageDetail: {}, //页面数据
			datas: 0, //动态获取厅别高度
			cells: 0, //tab小块的宽度 
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
		this.getBanquetOrderStat(this.month)
		// if (CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky')) {
		// 	alert('>>>>>>>>> sticky is supported')
		// } else {
		// 	alert('<<<<<<<<< does not support')
		// }
	},
	methods: {
		// 获取宴会单统计
		async getBanquetOrderStat(month) {
			const data = {
				month: month,
				storeId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店id
			};
			let result = await YHBanquetOrder.GetBanquetOrderStat(data);
			if (result) {
				this.pageDetail = result;
				let [err, res] = await uni.getSystemInfo(); //动态获取厅别高度
				if (res) { // res - 各种参数
					this.$nextTick(() => {
						let info = uni.createSelectorQuery().select(".date-meal");
						info.boundingClientRect((datas) => { //data - 各种参数
							this.datas = datas.height;
						}).exec();
						uni.createSelectorQuery().select(".cell").boundingClientRect((datas) => { //data - 各种参数
							this.cells = datas.width + uni.upx2px(8);
						}).exec();
					}, 0)
				}
			}
		},
	},
	computed: {
		colorDocList() { //顶部颜色-文本介绍
			let arr = [{ //状态0,未预订;1,预订（已交定金）;2,预订（未交定金）
					color: "#FA601C",
					label: '预订(已交定金)',
					bgColor: '#D9D9D9', //0,未预订;
				},
				{
					color: "#3399FF",
					label: '预订(未交定金)',
					bgColor: '#FA601C' //1,预订（已交定金）;
				},
				{
					color: "#D9D9D9",
					label: '未预订',
					bgColor: '#3399FF' //2,预订（未交定金）
				}
			]
			return arr;
		},
		dateH() { //动态获取高度
			return this.datas.height + 10
		},
		cellW() {//厅别宽度
			return this.cells;
		}
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
					this.getBanquetOrderStat(val);
				}
			}
		}
	}
	// ## 方法
};
