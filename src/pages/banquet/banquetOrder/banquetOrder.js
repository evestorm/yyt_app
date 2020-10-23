import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
import storage from '@/common/unistorage/index.js';
//组件
import banquetOrderItem from './banquet-order-item/banquet-order-item.vue';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// ------------------------------------------------顶部筛选条件相关参数-----------------------------
			filterData: { //宴会订单筛选线索-input
				storeID: storage.getAppUserInfo() ?
					storage.getAppUserInfo().currentStoreId : '', //门店ID.
				cWCompanyID: storage.getAppUserInfo() ?
					storage.getAppUserInfo().cwCompanyID : '' //企业ID.
			},
			getFilter: {}, //接口获取到的筛选数据
			//筛选显示文字
			isTypeClick: false, // 是否点击了宴会类别（初次展示‘宴会类别’）
			isStateClick: false,// 是否点击了订单状态（初次展示‘订单状态’）
			//宴会订单筛选线索-picker
			isOrder: true, //  排序picker 显示/隐藏
			isType: true, //  宴会类型picker显示/隐藏
			isState: true, //  状态picker显示/隐藏
			pageNum: 0, //显示多少条数据
			// ------------------------------------------------请求宴会列表相关参数-----------------------------
			queryData: {
				//请求宴会订单列表参数
				storeID: storage.getAppUserInfo() ?
					storage.getAppUserInfo().currentStoreId : '', //门店ID.,//门店ID.
				order: '', //排序.
				banquetType: '', //宴会类型.
				banquetState: '', //订单状态.
				nameOrPhone: '', //用户或手机号
				pageIndex: 0, //页码.
				pageSize: 10, //每页数量.
				marketId: storage.getAppUserInfo().marketerId
			},
			orderData: [], //接收宴会列表数据
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			mescrollSingle: {}, //缓存上拉加载参数 用于刷新
			navFilterBottom: 288, // 顶部筛选bottom高度,mescroll 距顶高度
		};
	},
	props: {
		storeID: {
			type: String
		},
	},
	mounted() {
		uni.$on('reloadPageOrder', res => {
			if (res == 'refresh') {
				this.refresh();
			}
		});
	},

	components: {
		banquetOrderItem
	},
	created() {},
	methods: {
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		orderSel() {
			//排序方式
			this.isType = true;
			this.isState = true;
			this.isOrder = this.isOrder == false ? true : false;
		},
		typeSel() {
			//宴会类别
			this.isOrder = true;
			this.isState = true;
			this.isType = this.isType == false ? true : false;
		},
		stateSel() {
			//订单状态
			this.isType = true;
			this.isOrder = true;
			this.isState = this.isState == false ? true : false;
		},
		mengbanNone() {
			this.isType = true;
			this.isOrder = true;
			this.isState = true;
		},
		orderClick(str) {
			//选择排序方式
			let num = str.value;
			this.queryData.order = num;
			this.refresh();
		},
		typeClick(str) {
			//选择宴会类型
			let num = str.value;
			this.queryData.banquetType = num;
			if (!this.isTypeClick) this.isTypeClick = true;
			this.refresh();
		},
		stateClick(str) {
			//订单状态
			let num = str.value;
			this.queryData.banquetState = num;
			if (!this.isStateClick) this.isStateClick = true;
			this.refresh();
		},
		async getBanquetScreen() { //获取顶部搜索列表
			let res = await YHBanquetOrder.GetBanquetScreen(this.filterData);
			if (res.length != 0) {
				this.getFilter = res;
			}

		},
		async getBanquetOrder(data, isScroll) { //如果是上拉操作pageIndex就取mescrollnum 
			if (!getApp().globalData.banquetPageData.isLoadOrder) return; // 不为true 不加载;
			this.getBanquetScreen();
			//筛选请求列表
			data.pageIndex = isScroll ? data.pageIndex : 1;
			let res = await YHBanquetOrder.GetBanquetOrder(data);
			return res;

		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			this.queryData.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.queryData.pageSize = mescroll.size; // 页长, 默认每页10条
			if (this.queryData.order == '') {
				this.queryData.order = 1;
			}
			let data = await this.getBanquetOrder(this.queryData, true);
			if (data) {
				this.isType = true;
				this.isState = true;
				this.isOrder = true;
				// 接口返回的当前页数据列表 (数组)
				let curPageData = data.list;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = data.pageCount;
				// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
				let totalSize = data.rowCount;
				this.pageNum = data.rowCount;
				//设置列表数据
				if (mescroll.num == 1) this.orderData = []; //如果是第一页需手动置空列表
				this.orderData = this.orderData.concat(curPageData); //追加新数据

				// 成功隐藏下拉加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
				// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length);
				});
			}
		},
		triggerSearch() {
			this.$util.baiduEvent('宴会订单搜索', '宴会订单顶部订单搜索');
		},
		calcMescrollTop() { //计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.order-top').boundingClientRect(data => {
					this.navFilterBottom = data.bottom.toString();
				}).exec();
			});
		}
	},
	computed: {
		isMengban() { //回背景蒙版显示
			if (this.isOrder && this.isState && this.isType) {
				return true;
			} else {
				return false;
			}
		},
		orderList() { //排序方式筛选数组
			let filter = this._.cloneDeep(this.getFilter);
			if (!this._.isEmpty(filter)) {
				let arr = this._(filter.order).chain()
					.map(x => ({
						name: x.name,
						value: x.value,
						selected: x.value == this.queryData.order
					})).value();
				return arr;
			}
		},
		orderText() { //搜索栏展示的排序方式
			let arr = this._.filter(this.orderList, 'selected');
			return (arr.length > 0 && arr[0].name) || '最近新增';
		},
		typeList() { //宴会类别筛选
			let filter = this._.cloneDeep(this.getFilter);
			let obj = {
				name: "全部",
				value: ''
			};
			if (!this._.isEmpty(filter)) {
				filter.banquetType.unshift(obj);
				let arr = this._(filter.banquetType).chain()
					.map(x => ({
						name: x.name,
						value: x.value,
						selected: this.isTypeClick && x.value == this.queryData.banquetType
					})).value();
				return arr;
			}
		},
		typeText() { //宴会类别
			let arr = this._.filter(this.typeList, 'selected');
			return (arr.length > 0 && arr[0].name) || '宴会类别';
		},
		stateList() { //订单状态筛选
			let filter = this._.cloneDeep(this.getFilter);
			let obj = {
				name: "全部",
				value: ''
			};
			if (!this._.isEmpty(filter)) {
				filter.banquetState.unshift(obj);
				let arr = this._(filter.banquetState).chain()
					.map(x => ({
						name: x.name,
						value: x.value,
						selected: this.isStateClick && x.value == this.queryData.banquetState
					})).value();
				return arr;
			}
		},
		stateText() { //'订单状态'
			let arr = this._.filter(this.stateList, 'selected');
			return (arr.length > 0 && arr[0].name) || '订单状态';
		},
	},
	watch: {
		'queryData.nameOrPhone': {
			handler: function(val, oldval) {
				if (val || val == '') {
					this.refresh();
				}
			}
		},
		'storeID': {
			async handler(val, old) {
				this.queryData.storeID = val;
				this.refresh();
			},
		},
	},
};
