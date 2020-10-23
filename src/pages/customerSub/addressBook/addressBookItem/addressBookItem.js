// 作者:杨亮

//------------------------------mock数据引入---------------------------
const app = getApp()

export default {
	name: 'address-book-item',
	// 注册属性
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
		};
	},
	mounted() {
		// this.$emit('addItemInfo', this, this.id);
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		},
		_onAddTheClue() {
			this.$emit('onAddTheClue', this.item);
		},
		_onGoCustomerInfo(id) {
			this.$emit('onGoCustomerInfo', id);
		},
		_onGoMessage(item) {
			this.$emit('onGoMessage', item);
		},
		_onGoCall(item) {
			this.$emit('onGoCall', item);
		},
		_onGoAdd(item) {
			this.$emit('onGoAdd', item);
		}
	},
	computed: {},
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
