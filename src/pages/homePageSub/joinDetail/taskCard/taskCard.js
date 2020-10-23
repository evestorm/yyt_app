// 作者:杨亮

//------------------------------mock数据引入---------------------------
import taskCard from './taskCard_mock.js';

export default {
    name: 'taskCard',
    // 注册属性
    props: {
        taskDetail: {
            type: Object,
            require: true,
            default: () => ({}),
        },
    },
    created() {
	},
	mounted() {
	},
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
		// 确认
		_confirm() {
			this.$emit('onConfirm');
		},
		// 查看报表
		_gotoReport() {
			this.$emit('gotoReport');
		},
		// 去上报
		_report() {
			this.$emit('report');
		},
		// 去预订台列表页
		checkOrderList() {
			uni.navigateTo({
				url: `/pages/homePageSub/seeTodayBook/seeTodayBook?selectDate=${this.basicInfo.taskShortName}`
			});
		}
    },
    computed: {
        type() {
			let type = "";
			let taskType = this.taskDetail.taskType;
			switch (taskType){
				case 10: // 每日预订
					type = "每日预订";
					break;
				case 20: // 每月跟踪
					type = "每月跟踪";
				default:
					break;
			}
			return type;
		},
		// 任务详情基本信息
		basicInfo() {
			let { xtTaskFollowDetails, xtTaskOrderDetails, xtTaskReplyDetails, ...rest } = this.taskDetail;
			return rest;
		},
		// 跟踪上报明细
		followDetail() {
			return this.taskDetail.xtTaskFollowDetails;
		},
		// 预订单确认明细
		orderDetail() {
			return this.taskDetail.xtTaskOrderDetails;
		},
		// 聊天信息
		replyList() {
			return this.taskDetail.xtTaskReplyDetails;
		},
		taskStatus() {
			return this.taskDetail.taskStatus != '10';
		}
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
