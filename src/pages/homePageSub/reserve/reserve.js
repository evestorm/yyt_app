import selectTable from './selectTable/selectTable.vue';
import todayBook from './todayBook/todayBook.vue';
import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

export default {
	components: {
		selectTable,
		todayBook
	},
	data() {
		return {
			// 常量
			picDomain: getApp().globalData.PicDomain, // 图片服务器
			// 页面参数
			tabIndex: 0, // 默认进来是预订台
			// 通过URl参数传递过来到底选择那个tab
			urlOptions: {
				tabIndex: 0, // 标志跳转过来要定位哪一个tab
			}, 
		};
	},
	computed: {
		...mapState(['reserveTab']),
		// 顶部的title显示
		zTitles() {
			let arr = [{
				title: '预订台',
				display: 1,
				idx: 0
			}, {
				title: '预订订单',
				display: 1,
				idx: 1
			}];
			return arr;
		}
	},
	onLoad(options) {
		// 判断是否有预订的权限 没有就返回
		if (!this.$cw.todayScheduled()) {
			this.$cw.showError("您没有预订的权限,2秒后将返回");
			setTimeout(() => uni.navigateBack({
				delta: 1
			}), 2000);
			return;
		}
		// 默认跳转到那个tabIndex上面去
		if (this.options.tabIndex) {
			this.tabIndex = this.options.tabIndex; // 定位到哪一个tab上
		}
		
		// 监听 bookNow 页面是否点击确认按钮预订
		uni.$on('clearCurSelectedTable', () => {
			this.$refs.selectTable && this.$refs.selectTable.setCurSelectedTable({});
			// 重置缓存的bookerInfo，避免新增客户立即预订后，再重新预订其他人时，还保留着上次的预订人信息
			this.initBookerInfo();
		});
	},
	onShow() {
		this.$nextTick(() => {
			// 加载数据
			this.onActive(this.tabIndex);
		});
	},
	methods: {
		...mapMutations(['initBookerInfo', 'setReserveTab']),
		// tab的切换
		onActive(data) {
			// 加载预订台 每次onshow 都加载一次
			if (data == 0) {
				this.$refs.selectTable && this.$refs.selectTable.refresh();
			}

			if (data == 1) {
				this.$nextTick(() => { //计算线索额订单mescroll高度
					this.$refs.todayBook && this.$refs.todayBook.calcMescrollTop();
				});
			}

			this.tabIndex = data;
			this.setReserveTab(this.tabIndex);
		}
	}
};
