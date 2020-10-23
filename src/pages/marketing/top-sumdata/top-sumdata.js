// 作者:覃彬
//------------------------------mock数据引入---------------------------
import topSumdata from './top-sumdata_mock.js';

export default {
	name: 'top-sumdata',
	// 注册属性
	props: {
		sumData: {
			type: Object,
			require: true,
			default: () => [{

			}],
		},
	},
	created() {},
	data() {
		return {
			title: {},
		};
	},
	methods: {},
	computed: {
		calcSumData() {
			return this.sumData;
		},
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
