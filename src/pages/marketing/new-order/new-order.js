// 作者:覃彬
import moment from '@/lib/moment/moment.min.js';
//------------------------------mock数据引入---------------------------
import newOrder from './new-order_mock.js';

export default {
	name: 'new-order',
	// 注册属性
	props: {
		orderDetails: {
			type: Array,
			require: false,
			default: () => [{}],
		},
	},
	created() {},
	data() {
		return {
			title: {},
		};
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		},
	},
	computed: {
		calcOrderDetails() {
			return this.orderDetails;
		},
	},
	filters: {
		parseTime(date) {
			return moment(date).format('HH:mm')
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
