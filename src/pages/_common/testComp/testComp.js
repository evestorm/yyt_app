export default {
	data() {
		return {
			title: '模板页', // 页面的title
			pageIndex: 2
		};
	},
	// 页面加载事件
	onLoad(options) {},
	methods: {
		testClick() {
			// alert('23');
			this.pageIndex++;
		},
		// 测试ajax发送
		async testAjax() {
			const data = {
				pageIndex: 1,
				pageSize: 10,
				order: 'StoreID desc'
			};

			let result = await CY17AppService.GetViewPage(data);
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
