// 作者:{Author}
import CY17 from '@/service/CY/CY17AppService.js';

export default {
	data() {
		return {
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.urlOption=options;
		await getApp().globalData.verifyAu(); // 验证权限获取用户信息
	},
	methods: {
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
	computed: {
		// fullName(){
		//	return this.items
		//}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {

		//        }
		//    }
		// }
	}
};
