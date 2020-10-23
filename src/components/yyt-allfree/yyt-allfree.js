// 作者:覃彬

//------------------------------mock数据引入---------------------------
import yytAllfree from './yyt-allfree_mock.js';

export default {
	name: 'yyt-allfree',
	// 注册属性
	props: {
		summaryStat: {
			type: Object,
			require: false,
			default: () => {
				return {
					feeFrequency: 0,
					tableAvgFeeAmount: 0,
					totalFeeAmount: 0,
					totalFeeCount: 0
				};
			}
		},
	},
	created() {},
	data() {
		return {
			title: {},
		};
	},
	methods: {

	},
	computed: {

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
	},
};
