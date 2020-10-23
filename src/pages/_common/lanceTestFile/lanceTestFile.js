export default {
	data() {
		return {
			title: 'TITLE', // 页面的title
		};
	},
	// 页面加载事件
	onLoad(options) {},
	methods: {
		selectDate(e, item) {
			// console.log(e, item);
		},
		confirmDateRange(val) {
			// console.log(val);
		},
		cancelPickerSelect() {
			console.log('点击了取消');
		}
	},
	filters: {
	},
	watch: {
	}
	// ## 方法
};
