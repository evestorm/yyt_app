// 作者:覃彬

//------------------------------mock数据引入---------------------------
import banquetCueItem from './banquet-cue-item_mock.js';

export default {
    name: 'banquet-cue-item',
    // 注册属性
    props: {
        banquetCuelist: {
            type: Array,
            require: false,
            default: () => [{}],
        },
    },
    created() { },
    data() {
        return {
            picDomain: getApp().globalData.PicDomain,
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
    },
    filters: {
        parseClueLevel(value) {//格式化宴会等级 ABC
			switch (value){
				case 1:
				return 'C';
					break;
				case 2:
				return 'B';
					break;
				case 3:
				return 'A';
					break;
				default:
				return 'C';
					break;
			}
        }
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
