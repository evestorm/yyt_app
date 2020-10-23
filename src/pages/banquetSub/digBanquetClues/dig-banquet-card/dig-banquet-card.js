// 作者:杨亮

//------------------------------mock数据引入---------------------------
import digBanquetCard from './dig-banquet-card_mock.js';
const app = getApp()

export default {
    name: 'dig-banquet-card',
    // 注册属性
    props: {
		item: {
			type: Object,
			require: true,
			default: () => {
				return {
					bookOrderID: '1', // 预订id
					customerName: '李明明',
					phone: '15857122899',
					expectOn: '2020-05-28 00:00:00', // 目标日期(机会的时间，卡片右上角)
					bookOn: '2020-05-28 00:00:00', // 预订日期(上一次的订单时间，卡片中间)
					name: '婚宴', // 预订类型名称
					remark: '结婚周年', // 备注（机会时间右边的文字）
					bookTableNum: '18', // 桌数
					fee: '15223.20', // 消费金额 | formatMoney
					isAdded: false, // 是否已添加
				}
			}
		},
		isBatch: {
			type: Boolean,
			require: true,
			default: false,
		}
    },
    data() {
        return {
			picDomain: app.globalData.PicDomain,
        };
    },
    methods: {
        // 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
        _onClick() {
            this.$emit('onClick');
        },
		_onAddTheClue() {
			this.$emit('onAddTheClue', this.item);
		}
    },
    computed: {
        items() {
            return this.inputItems;
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
