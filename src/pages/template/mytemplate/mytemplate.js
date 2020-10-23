// 作者:{Author}
import CY17 from '@/service/CY/CY17AppService.js';

export default {
	onNavigationBarButtonTap(val) {
		// 打印测试分割
		console.log('{0}')
	},
	data() {
		return {
			title: '模板页' // 页面的title
		};
	},
	// 页面加载事件
	onLoad() {
		// 用户信息
		const userInfo = this.$storage.getAppUserInfo();
		const urlData={
			test:'123',
			id:'5562'
		};
		let url= `https://tapp.yunyutian.cn/${this.$util.urlEncode(urlData,'?')}`;

		const student = [{
				id: 1,
				stuName: 'test',
				age: 10
			},
			{
				id: 2,
				stuName: 'test1',
				age: 5
			},
			{
				id: 3,
				stuName: 'test2',
				age: 4
			},
			{
				id: 3,
				stuName: 'test1',
				age: 4
			},
			{
				id: 3,
				stuName: 'test2',
				age: 18
			},
			{
				id: 4,
				stuName: 'test3',
				age: 11
			},
			{
				id: 4,
				stuName: 'test3',
				age: 20
			}
		];

		const page = 1; // 第一页
		const limit = 5; // 每页多少条

		const k = this._(student).chain()
			.drop((page - 1) * limit) // 跳过前面数据
			.take(limit) // 取几个
			.filter(x => x.age <= 10) // 过滤
			.map(x => ({
				stuName: x.stuName,
				age: x.age
			})) // 隐射数据
			.orderBy(['stuName', 'age'], ['desc', 'asc']) // 排序
			.uniqBy(x => x.stuName) // 去重
			.value();
		console.log(k);
		// find
		let findItem = this._(k).find(x => x.stuName == 'test');
		// findIndex
		let findIndex = this._(k).findIndex(x => x.stuName == 'test');

		// 删除
		let removeDatas = this._(k).remove(x => x.stuName == 'test').value();

		// 分组
		k.push({
			stuName: 'test1',
			age: 20
		})
		const kGroupBy = this._(k).groupBy(x => x.stuName).value();

	},
	methods: {
		// 测试ajax发送
		async testAjax() {
			const data = {
				pageIndex: 1,
				pageSize: 10,
				order: 'StoreID desc'
			};
			
			let result= await CY17AppService.GetViewPage(data);
			debugger;
		}
	},
	computed: {
		// fullName: {
		//    get() {
		//        return this.firstName+this.lastName
		//    },
		//    set(newValue) {
		//        var names = newValue.split(' ')
		//        this.firstName = names[0]
		//        this.lastName = names[names.length - 1]
		//    }
		// }
		//this.fullName = 'John Doe' // set测试
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
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
