// 作者:杨亮

//------------------------------mock数据引入---------------------------
import seeTodayBookMock from './seeTodayBook_mock.js';

//------------------------------组件引入-------------------------------
import todayBook from '@/pages/homePageSub/reserve/todayBook/todayBook.vue';


export default {
    // 组件放在data前面
    components: {
    	todayBook
    },
    data() {
        return {
        };
    },
    // 页面加载事件
    async onLoad(options) {
        this.urlOption = options;
		this.payload = this.urlOption;
    },
    methods: {
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
    }
};
