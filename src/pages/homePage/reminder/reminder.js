// 作者:杨亮

//------------------------------mock数据引入---------------------------
import reminder from './reminder_mock.js';

export default {
    name: 'reminder',
    // 注册属性
    props: {
        noticeList: {
            type: Array,
            require: true,
            default: () => [{}],
        },
		clickReminderItem: {
			type: Function,
			require: false,
			default: () => ({}),
		},
    },
    created() { },
    data() {
        return {
            title: {},
        };
    },
    methods: {
        // 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
        _clickReminderItem(item) {
            this.$emit('clickReminderItem', item);
        },
		getTip(item) {
			let num = JSON.parse(item.operationParamJson).needHandleCount;
			let tipList = {
				'客户跟踪': () => {
					return num > 0 ? `本月<text class="mark">${num}</text>个客户待跟踪` : '';
				},
				'宴会任务': () => {
					return num > 0 ? `<text class="mark">${num}</text>个宴会任务待办` : '';
				},
				'宴会线索': () => {
					return num > 0 ? `<text class="mark">${num}</text>个宴会线索待跟进` : '';
				},
				'目标': () => {
					return num > 0 ? `本月<text class="mark">${num}</text>个目标未完成` : '';
				}
			};
			return tipList[item.name]();
		},
    },
    computed: {
       tipHTML() {
		   return (item) => {
			   return this.getTip(item);
		   }
	   }
    },
    filters: {
		// 提示
		
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
