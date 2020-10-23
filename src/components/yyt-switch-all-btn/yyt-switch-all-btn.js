// 作者:杨亮

//------------------------------mock数据引入---------------------------
import yytSwitchAllBtn from './yyt-switch-all-btn_mock.js';

export default {
    name: 'yyt-switch-all-btn',
    // 注册属性
    props: {
		change: {
			type: Function,
			require: true,
			default: () => {},
		}
		
    },
    created() { },
    data() {
        return {
            title: {},
			isGetAll: 0, // 默认高亮状态(0:我的；1:全店)
        };
    },
    methods: {
		// 切换我的/全店
		_change() {
			this.isGetAll = !this.isGetAll ? 1 : 0;
			this.$emit('change', this.isGetAll);
		},
    },
    computed: {
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
