// 作者:覃彬

//------------------------------mock数据引入---------------------------
import marketingOrderMock from './marketingOrder_mock.js';

//------------------------------组件引入-------------------------------
import orderList from './order-list/order-list.vue';
import orderSearch from './order-search/order-search.vue';

//-------------------------Service引入----------------------------------
import GK10 from '@/service/GK/GK10AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入
export default {
	// 组件放在data前面
	components: {
		orderList, // 订单列表
		orderSearch, // 顶部筛选
	},
	data() {
		// 常量
		let PageConstData = {
			dateArr: [ //传给顶部选择时间组件
				{
					label: '今日',
					selected: false,
					value: 1
				}, {
					label: '昨日',
					selected: false,
					value: 2
				}, {
					label: '本周',
					selected: false,
					value: 3
				}, {
					label: '本月',
					selected: true,
					value: 4
				}, {
					label: '自定义',
					selected: false,
					value: 5
				}
			]
		}
		return {
			//---------------------常量------------------------
			PageConstData,
			//---------------------接口输入输出 接口名称+in/out 命名 列如接口名称是getStudentList----------------------
			getOrderDetailsIn: { //获取订单列表
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				marketId: this.$storage.getAppUserInfo().marketerId, //客服经理id
				cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID, //企业ID
				itemType: '', //类型 2优惠券 3优惠券
				dateType: 4, //日期类型日期类型(1.今日,2.昨日,3.本周,4.本月 5自定义).
				startTime: "", //开始日期.
				endTime: "", //结束日期.
				contentID: "", //会员卡优惠券ID
				pageIndex: 1, // 第几页
				pageSize: 10, // 每页多少条
			},
			getOrderDetailsOut: {
				dataList: [], // 返回的data数据
				// pageCount: 0, // 多少页
				// rowCount: 0 // 总共多少数据
			},
			// --------------------------------------页面参数---------------------------
			// =========================mescroll相关参数=================
			upOption: { //上拉常用配置
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
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			mescrollSingle: {}, //缓存mescroll参数 用于刷新
			navFilterBottom: 288, // 顶部筛选bottom高度,mescroll 距顶高度
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.calcMescrollTop();
	},
	methods: {
		onConfirmDateRange(obj) { //顶部筛选时间-确认时间范围
			this.getOrderDetailsIn.dateType = 5;
			this.getOrderDetailsIn.startTime = obj.from + ' 00:00:00';
			this.getOrderDetailsIn.endTime = obj.to + ' 23:59:59';
		},
		onSelectDate(e, item, id) { //顶部筛选时间-时间类型选择
			this.getOrderDetailsIn.dateType = item.value;
			this.getOrderDetailsIn.startTime = '';
			this.getOrderDetailsIn.endTime = '';
		},
		getMarkerSearchData(obj) { //顶部获取筛选的客服经理信息
			this.getOrderDetailsIn.marketId = obj.selectId;
		},
		geActivitySearchDat(obj) { //顶部获取筛选的活动信息
			this.getOrderDetailsIn.contentID = obj.selectId;
			this.getOrderDetailsIn.itemType = obj.type;
		},
		refresh() { // 刷新列表
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		calcMescrollTop() { //计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.order-search').boundingClientRect(data => {
					this.navFilterBottom = data.bottom.toString();
				}).exec();
			});
		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			this.getOrderDetailsIn.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.getOrderDetailsIn.pageSize = mescroll.size; // 页长, 默认每页10条
			let data = await GK10.GetOrderDetails(this.getOrderDetailsIn);
			// 接口返回的当前页数据列表 (数组)
			let curPageData = data.orderDetails.dataList;
			let totalPage = data.orderDetails.pageCount;
			let Pindex = data.orderDetails.pageIndex; //当前页数
			// 接口返回的是否有下一页 (true/false)
			let hasNext = Pindex > totalPage ? true : false
			//设置列表数据
			if (mescroll.num == 1) this.getOrderDetailsOut.dataList = []; //如果是第一页需手动置空列表
			this.getOrderDetailsOut.dataList = this.getOrderDetailsOut.dataList.concat(curPageData); //追加新数据
			// 成功隐藏下拉加载状态
			mescroll.endByPage(curPageData.length, totalPage);
			// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
			this.$nextTick(() => {
				mescroll.endSuccess(curPageData.length)
			})
		},
	},
	computed: {
		// 查询条件变化用于监控
		calcGetOrderDetailsIn() {
			return this._.cloneDeep(this.getOrderDetailsIn);
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// 监控查询条件的变化 自动请求数据
		'calcGetOrderDetailsIn': {
			handler(val, oldval) {
				if (this.$util.isChgForWatch(val, oldval, ['marketId', 'itemType', 'dateType', 'contentID', 'startTime', 'endTime'])) {
					this.refresh();
				}
			},
			deep: true,
		}
	}
};
