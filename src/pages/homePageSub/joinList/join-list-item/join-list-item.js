// 作者:覃彬

//------------------------------mock数据引入---------------------------
import joinListItem from './join-list-item_mock.js';

export default {
	name: 'join-list-item',
	// 注册属性
	props: {
		listData: { //接收父组件传来的数组
			type: Array,
			require: false,
			default: () => [{}],
		},
		month:{
			type:String,
			require:true,
			default:'',
		}
	},
	created() {},
	data() {
		return {};
	},
	methods: {},
	computed: {
		showList() { //页面显示的数组
			return this.listData;
		},
		parseConfirmText() { //格式化显示完成确认人数
			return function(obj) {
				let html = '';
				switch (obj.taskType) { //任务类型(10,每日预订;20,每月跟踪)
					case 10:
						if (obj.notConfirmCompleteCount > 0) {
							html += `<span>${obj.confirmCompleteCount}人已确认</span>`;
							if (obj.myIsNeedConfirm && !obj.myIsConfirmComplete) {//我需要确认（myIsNeedConfirm）&&我还未确认（myIsConfirmComplete）
								html += '，';
								html += `<span style="color:#fb4349">你还未确认</span>`;
							} else if (obj.notConfirmCompleteCount) {
								html += '，';
								html += `<span>${obj.notConfirmCompleteCount}人未确认</span>`;
							}
						} else {
							html += `<span>${obj.confirmCompleteCount}人全部确认</span>`;
						}
						break;
					case 20:
						if (obj.notConfirmCompleteCount > 0) {
							html += `<span>${obj.confirmCompleteCount}人已完成</span>`;
							if (obj.myIsNeedConfirm && !obj.myIsConfirmComplete) {
								html += '，';
								html += `<span style="color:#fb4349">你还未完成</span>`;
							} else if (obj.notConfirmCompleteCount) {
								html += '，';
								html += `<span>${obj.notConfirmCompleteCount}人未完成</span>`;
							}
							break;
						} else {
							html += `<span>${obj.confirmCompleteCount}人全部完成</span>`;
						}
					default:
						break;
				}
				return html;
			}
		}
	},
	filters: {
		parseType(value) { //格式化类型(10,每日预订;20,每月跟踪)
			switch (value) {
				case 10:
					return '预订';
					break;
				case 20:
					return '跟踪';
					break;
				default:
					break;
			}
		},

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
