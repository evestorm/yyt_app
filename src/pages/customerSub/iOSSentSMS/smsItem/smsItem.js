// 作者:杨亮

//------------------------------mock数据引入---------------------------
import smsItem from './smsItem_mock.js';

export default {
	name: 'sms-item',
	// 注册属性
	props: {
		item: {
			type: Object,
			require: true,
			default: () => {},
		},
		androidAllState: { //安卓群发按钮状态 
			type: Number,
			require: false,
			default: 10
		}
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
			this.$set(this.item, 'status', 0);
			this.$emit('onClick', this.item);
		},
	},
	computed: {
		statusDesc() {
			// 0发送中，1已发送，其他2-5：发送失败
			return this.item.status == 0 ? '发送中' : this.item.status == 1 ? '已发送' : (this.item.status > 1 && this.item.status < 6) ?
				'发送失败' : '';
		},
		disabled() { //item发送短信按钮是否可以点击
			return this.androidAllState == 20 ? true : this.item.status == 0 || this.item.status == 1 ? true : false;
		}
	},
	filters: {},
	watch: {},
};
