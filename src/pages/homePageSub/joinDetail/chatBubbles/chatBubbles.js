// 作者:杨亮

//------------------------------mock数据引入---------------------------
import chatBubbles from './chatBubbles_mock.js';

export default {
    name: 'chatBubbles',
    // 注册属性
    props: {
        chatList: {
            type: Array,
            require: true,
            default: () => [],
        },
    },
    created() { },
	mounted() {
		// setTimeout(() => {
		// 	this.chatList = chatBubbles.chatList;
		// }, 500);
		// setTimeout(() => {
		// 	console.log(this.chatList);
		// }, 500);
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
    },
    computed: {
        items() {
            return this.inputItems;
        },
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url) {
					return "url(" + encodeURI(url) + ")";
				} else {
					return "url('https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png')";
				}
			};
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
