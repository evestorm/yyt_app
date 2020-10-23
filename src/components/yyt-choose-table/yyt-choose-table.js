// 作者:覃彬

//------------------------------mock数据引入---------------------------
import yytChooseTable from './yyt-choose-table_mock.js';

export default {
	name: 'yyt-choose-table',
	// 注册属性
	props: {
		readyTableNum: { //桌数限制
			type: Number,
			require: false,
			default: 100
		},
		readyTableNumLen: { //备用桌数限制
			type: Number,
			require: false,
			default: 100
		}
	},

	data() {
		return {
			isChecked: 0, //控制选中class
			isShowLen: true, //调换桌数和备桌数
			tableNum: '', //桌数
			tableLenNum: '', //备用桌数
		};
	},
	created() {},
	methods: {
		openPopup() { //打开选择桌数弹窗
			this.$refs.tableCount.open();
		},
		selectExtraDesknum(num) { //选择桌数
			if (this.isShowLen) {
				if (this.tableNum + num < this.readyTableNum) {
					this.tableNum += num
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					})
				}
			} else {
				if (this.tableLenNum + num < this.readyTableNumLen) {
					this.tableLenNum += num
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					})
				}
			}
		},
		_confirm() { //选择桌数确认键
			if (this.isShowLen) {
				this.isShowLen = false;
			} else {
				let obj = {
					tableNum: this.tableNum * 1,
					tableLenNum: this.tableLenNum * 1,
				}
				this.$emit('tableNum', obj)
				this.cancel();
			}
		},
		cancel() { //选择桌数取消键
			this.$refs.tableCount.close();
			this.tableNum = '';
			this.tableLenNum = '';
			this.isShowLen = true;
		}
	},
	computed: {},
	watch: {
		// "date": {
		// 	handler(val, oldval) {
		// 		if (val) {
		// 			this.$emit('chooseRangeDate', val);
		// 		}
		// 	},
		// 	deep: true
		// }
	},
};
