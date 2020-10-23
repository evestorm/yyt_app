// 作者:杨亮

//------------------------------mock数据引入---------------------------
import overview from './overview_mock.js';

const moduleEnum = {
	reserve: '预订情况',
	customer: '客户情况',
	banquet: '宴会情况',
	marketing: '营销情况'
};

export default {
    name: 'overview',
    // 注册属性
    props: {
		tabNar: { // 动态导航
			type: Array,
			require: true,
			default: () => ([])
		},
		overviewData: { // 动态数据
			type: Object,
			require: true,
			default: () => ({})
		},
        pieData: { // 饼图数据
			type: Array,
			require: false,
			default: () => ([])
		},
		barData: { // 柱状图数据
			type: Array,
			require: false,
			default: () => ([])
		},
		tabNavSelect: { // 切换导航
			type: Function,
			require: true,
			default: () => {}
		},
		changeData: { // 我的/全店 切换
			type: Function,
			require: true,
			default: () => {}
		},
		seeMore: {
			type: Function,
			require: true,
			default: () => {}
		},
		userInfo: {
			type: Object,
			require: true,
			default: () => ({}),
		},
		isShow: {
			type: Boolean,
			require: true,
			default: false,
		}
    },
    created() { },
	updated() {
	},
    data() {
        return {
			moduleEnum, //板块枚举
			// tabNavSelected: null, // tab选中
			// tabNavScrollLeft: 0, // 顶部tab的x轴偏移
			nowDate: this.$moment().format('YYYY-MM'),
			isrefresh: true,
        };
    },
    methods: {
        // 顶部固定tab选择
        _tabNavSelect(e) {
			const code = e.currentTarget.dataset.code;
			if (code == this.tabNavSelected.code) return;
			this.$emit('tabNavSelect', code);
        	// this.tabNavSelected = val;
			// findOne.selected = true;
        	// this.tabNavScrollLeft = (this.tabNavSelected - 1) * 100;
        },
		// 我的/全店切换
		change(isGetAll) {
			this.$emit('changeData', isGetAll);
		},
		// 查看更多
		_seeMore(item) {
			this.$emit('seeMore', item);
		},
		calcCurData(title, type, attr) {
			if (type == 'overview') {
				if (!this.overviewData[title]) return '';
				if (!this.overviewData[title][this.overviewData[title].isGetAll ? 'all' : 'self']['overview']) return '';
				let overview = this.overviewData[title][this.overviewData[title].isGetAll ? 'all' : 'self'][type][attr];
				return overview;
			} else if (type == 'data') {
				if (!this.overviewData[title]) return [];
				if (!this.overviewData[title][this.overviewData[title].isGetAll ? 'all' : 'self']['overview']) return [];
				// let find = this.overviewData[title].isGetAll ? 'all' : 'self';
				// let rdata = this.overviewData[title][this.overviewData[title].isGetAll ? 'all' : 'self'][attr]
				// console.log({
				// 	overviewData: this.overviewData[title],
				// 	tabBar: this.tabNar,
				// 	attr,
				// 	find,
				// 	rdata,
				// });
				let data = this.overviewData[title][this.overviewData[title].isGetAll ? 'all' : 'self'][attr];
				return data;
			}
		},
    },
    computed: {
		tabNavSelected() {  // tab选中
			return this.tabNar.find(v => v.selected);
		},
		tabNavScrollLeft() { // 顶部tab的x轴偏移
			return this.tabNavSelected ? (this.tabNavSelected.idx - 1) * 100 : 0;
		},
    },
    filters: {
    },
    watch: {
		"tabNar": {
			handler(val, oldval) {
			},
			deep: true,
		},
        "overviewData": {
           handler(val, oldval) {
			   // this.isrefresh = !this.isrefresh;
			   // this.$nextTick(() => {
			   // 	this.isrefresh = !this.isrefresh;
			   // });
		   },
		   deep: true,
        },
		userInfo: {
			handler() {
				// debugger
				
			},
			deep: true,
		},
    },
};
