export default {
	name: 'yyt-report-table',
	// 注册属性
	props: {
		title: {
			type: String,
			default: '客户经理详情',
		},
		titleList: { //接收到的表头
			type: Array,
			required: true
		},
		tableDataList: { //接收到的table数据
			type: Array,
			required: true
		}
	},
	data() {
		return {};
	},
	computed: {
		tableTitleFirst() { //左上角固定title
			return this.titleList[0];
		},
		tableTitle() { //表头右边滑动部分
			return this.titleList.slice(1);
		}
	},
	methods: {
		// 注册事件
		// _onClick() {
		// 	this.$emit('onClick');
		// }
	}
};
