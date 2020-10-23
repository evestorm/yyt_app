// 作者:杨亮

//------------------------------mock数据引入---------------------------
import menu from './gridMenu_mock.js';

export default {
    name: 'gridMenu',
    // 注册属性
    props: {
        menuList: {
			type: Array,
			require: true,
			default: () => ([]),
		}
		
    },
    created() { },
    data() {
        return {
            title: {},
        };
    },
    methods: {
		_goNaviPage(item) {
			this.$emit('goNaviPage', item);
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
