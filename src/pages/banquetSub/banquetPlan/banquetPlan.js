// 作者:覃彬
// 引入组件 
import banquetPlanList from './banquetPlanList/banquetPlanList.vue'
import banquetPlanTable from './banquetPlanTable/banquetPlanTable.vue'
export default {
	data() {
		return {
			month: this.$moment().format('YYYY-MM'), //月份
			pageStyle:1,//页面显示是列表2 还是 图表1
		};
	},
	components:{banquetPlanList,banquetPlanTable},
	// 页面加载事件
	methods: {
		chooseDate(e){//更改日期
			this.month=e.detail.value
		},
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
