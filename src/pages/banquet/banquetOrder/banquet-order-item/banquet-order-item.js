// 作者:覃彬
//------------------------------mock数据引入---------------------------
import banquetCueItem from './banquet-order-item_mock.js';

export default {
	name: 'banquet-order-item',
	// 注册属性
	props: {
		banquetOrderlist: {
			type: Array,
			require: false,
			default: () => [{}],
		},
	},
	created() {},
	data() {
		return {
			picDomain: getApp().globalData.PicDomain,
		};
	},
	methods: {},
	computed: {},
	watch: {},
};
