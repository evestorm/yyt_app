// 作者:覃彬

//------------------------------mock数据引入---------------------------
import orderList from './order-list_mock.js';

export default {
	name: 'order-list',
	// 注册属性
	props: {
		dataList: {
			type: Array,
			require: false,
			default: () => [{}],
		},
	},
	created() {},
	data() {
		return {};
	},
	methods: {},
	computed: {
		calcDataList() {
			return this._.cloneDeep(this.dataList);
		},
	},
	filters: {
		parseTel(tel) { //隐藏手机号中间四位
			let reg = /^(\d{3})\d{4}(\d{4})$/;
			return tel.replace(reg, "$1****$2");
		}
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {
		//        }
		//    }
		// }
	},
};
