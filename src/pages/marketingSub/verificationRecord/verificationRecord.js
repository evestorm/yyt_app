// 作者:杨亮

//------------------------------组件引入-------------------------------
import recordItem from './recordItem/recordItem.vue';


//-------------------------Service引入----------------------------------
import GK07 from '@/service/GK/GK07AppService.js';
import CY18 from '@/service/CY/CY18AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入


// 常量
const PageConstData = {
	app: getApp(),
	pageSize: 15, // 每次请求页码
	currentUser: storage.getAppUserInfo(), // 当前登录人信息
};

export default {
	// 组件放在data前面
	components: {
		recordItem, // 核销卡片
	},
	// 职责: 程序中需要进行set的数据 (尽量少去定义data里面的属性 多用computed或者组件进行处理)
	data() {
		return {
			//---------------------常量------------------------
			PageConstData,
			//---------------------数据请求----------------------
			
			// 卡券列表
			getRecordListIn: {
				pageIndex: 1, // 第几页
				pageSize: PageConstData.pageSize, // 每页多少条
				markerID: this.$storage.getAppUserInfo().marketerId, // 查询条件  目前是根据学生姓名和班级姓名查找
				smallProgramCardID: '', // 卡券类型
				storeID: this.$storage.getAppUserInfo().currentStoreId,
				isAppend: false, // 控制是下拉刷新 还是上拉加载
			},
			getRecordListOut: {
				dataList: [], // 返回的data数据
				pageCount: 0, // 多少页
				rowCount: 0 // 总共多少数据
			},
			
			// 客服经理
			getStoreManagerIn: {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
			},
			
			// 优惠券类型
			getCouponTypeIn: {
				storeID: this.$storage.getAppUserInfo().currentStoreId,
			},
			getCouponTypeOut: {},

			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
			
			// 当前选中客户经理信息
			currentSelCS: {
				label: PageConstData.currentUser.userName,
				value: PageConstData.currentUser.marketerId,
			},
			
			// 当前选中卡券类型
			currentSelCoupon: {
				label: '全部',
				value: '',
			},

			// ------------ 顶部筛选 -------------
			isShowCSManagerFilter: false, // 是否展示客户经理panel
			isShowCouponTypeFilter: false, // 是否展示卡券panel
			oriCSManagerArr: [], // 请求的客户经理列表未加工数据
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.urlOption = options;

		// 请求客服经理
		await this.reqCSManagerData();
		// 请求卡券类型
		await this.reqCouponType();
		// 请求列表数据
		await this.reqCouponList();
	},
	// 页面触底
	onReachBottom() {
		this.getRecordListIn.isAppend = true;
		this.getRecordListIn.pageIndex++;
	},
	// 页面下拉
	onPullDownRefresh() {
		this.getRecordListIn = {
			...this.getRecordListIn,
			isAppend: false,
			pageIndex: 1
		}
		// this.getRecordListIn.isAppend = false;
		// this.getRecordListIn.pageIndex = 1;
	},
	// 职责:页面事件进行交互
	methods: {
		// 获取客户经理数据
		async reqCSManagerData() {
			// getChooseMarketData结构:
			// {
			// 	"value":"SL9449800000125",
			// 	"text":"01",
			// 	"salseImg":"https://pic.yunyutian.cn//upload/img/20190704/1521362136_003.jpg",
			// }
			// let marketData = this.$storage.getChooseMarketData();

			let res = await CY18.GetCustomerServiceManager(this.getStoreManagerIn,null,false);
			let marketData = res.result.dataList.filter(v => v.userIsDisabeld == 0);
			marketData.splice(0, 0, {
				marketerID: '',
				marketerName: `全部`,
			});
			this.oriCSManagerArr = marketData;
		},
		// 请求卡券类型
		async reqCouponType() {
			let data = await GK07.GetCouponType(this.getCouponTypeIn,null,null,false);
			if (data) {
				this.getCouponTypeOut = data.smallProgramCardList;
				this.getCouponTypeOut.splice(0, 0, {
					smallProgramCardID: '',
					cardName: `全部`,
					selected: true,
				});
			}
		},
		// 弹出客户经理panel
		CSManagerFilterToggle() {
			this.isShowCSManagerFilter = !this.isShowCSManagerFilter;
			this.isShowCouponTypeFilter = false;
		},
		// 选择客户经理
		seleCSManagerFilter(item) {
			// item结构:
			// label: "黄芮(600)"
			// value: "SL1855900000069"
			// selected: true
			this.isShowCSManagerFilter = false;
			if (item.selected) return;
			this.CSManagerFilterArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;

			this.currentSelCS.label = this.calcCSManagerText(item.label);
			this.currentSelCS.value = item.value;
			this.getRecordListIn = {
				...this.getRecordListIn,
				pageIndex: 1,
				markerID: item.value,
				isAppend: false
			};
		},
		// 顶部筛选「客服经理」文字
		calcCSManagerText(csManagerName) {
			return csManagerName ? csManagerName.substring(0, 4) : '';
		},
		// 弹出卡券panel
		couponFilterToggle() {
			this.isShowCouponTypeFilter = !this.isShowCouponTypeFilter;
			this.isShowCSManagerFilter = false;
		},
		// 选择卡券类型
		seleCouponFilter(item) {
			this.isShowCouponTypeFilter = false;
			if (item.selected) return;
			this.calcGetCouponTypeOut.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
			this.currentSelCoupon.label = this.calcCouponText(item.label);
			this.currentSelCoupon.value = item.value;
			this.getRecordListIn = {
				...this.getRecordListIn,
				pageIndex: 1,
				smallProgramCardID: item.value,
				isAppend: false
			}
		},
		// 返回顶部筛选[卡券]时展示的卡券名称
		calcCouponText(name) {
			return name ? name.substring(0, 10) : '';
		},
		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.isShowCouponTypeFilter = false;
			this.isShowCSManagerFilter = false;
		},
		// 获取核销记录数据 注意和后端接口名称保持一致
		async reqCouponList() {
			// 第一次加载
			if (this.getRecordListIn.pageIndex == 1) {
				let data = await GK07.GetWriteOffRecords(this.getRecordListIn);
				this.getRecordListOut = data.writeOffData;
				uni.stopPullDownRefresh(); // 停止下拉刷新
			} else if (this.getRecordListOut.rowCount > this.getRecordListOut.dataList.length) {
				//总的数据大于当前数据才加载
				let data = await GK07.GetWriteOffRecords(this.getRecordListIn);
				let myPageList = data.writeOffData;
				// 控制下拉和触底刷新
				if (this.getRecordListIn.isAppend) {
					myPageList.dataList = this.getRecordListOut.dataList.concat(myPageList.dataList);
				} else {
					myPageList.dataList = myPageList.dataList.concat(this.getRecordListOut.dataList);
					uni.stopPullDownRefresh(); // 停止下拉刷新
				}
				this.getRecordListOut = myPageList;
			} else {
				if (!this.getRecordListIn.isAppend) {
					uni.showToast({
						title: '数据已全部加载'
					});
					uni.stopPullDownRefresh(); // 停止下拉刷新
				}
			}
		},
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
	},
	// 职责:不要set的data 统一用computed实现(能用computed实现的尽量用他实现 不要用data和method处理)
	computed: {
		// 顶部客户经理的下拉列表展示的数据
		CSManagerFilterArr() {
			let allData = this._.cloneDeep(this.oriCSManagerArr);
			let topMarketData = this._(allData).chain()
				.map(x => ({
					value: x.marketerID,
					label: `${x.marketerName}`,
					selected: x.marketerID == this.currentSelCS.value,
				}))
				.orderBy(['count'], ['desc']).value();
			return topMarketData;
		},
		calcGetCouponTypeOut() { // 卡券类型列表处理
			let dataList = this._.cloneDeep(this.getCouponTypeOut);
			let formatData = this._(dataList).chain()
				.map(x => ({
					value: x.smallProgramCardID,
					label: `${x.cardName}`,
					selected: x.smallProgramCardID == this.currentSelCoupon.value,
				}))
				.orderBy(['cardName'], ['desc']).value();
			return formatData;
		},
		// 查询条件变化用于监控
		calcGetRecordListIn() {
			return this._.cloneDeep(this.getRecordListIn);
		},
		// 列表进行处理 
		calcGetRecordListOut() {
			let dataList = this._.cloneDeep(this.getRecordListOut.dataList);
			return dataList;
		},
		// 查询条件变化用于监控
		calcGetCouponTypeIn() {
			return this._.cloneDeep(this.getCouponTypeIn);
		},
		// 是否加载完成
		isAllLoad() {
			// 是空先展示空
			return !this.isEmpty && this.getRecordListOut.rowCount == this.getRecordListOut.dataList.length;
		},
		// 是否没有数据
		isEmpty() {
			return this.getRecordListOut.dataList.length == 0;
		},
	},
	// 职责:格式化数据
	filters: {
		// ----------------- filters-顶部lable的过滤-START -----------
		currentTopLabel(label, marketId, CSManagerFilterArr) {
			let marketDatas = CSManagerFilterArr;
			let marketItem = marketDatas.find(x => x.value == marketId);
			return marketItem ? marketId == '' && label == '全部' ? '客服经理' : `${label}` : label;
		},
		currentTolCouponLabel(name, currentSelCoupon) {
			let { value, label } = currentSelCoupon;
			return label ? label == '全部' && value == '' ? '卡券名称' : `${label}` : label;
		},
	},
	// 职责:数据变化后需要和接口交互
	watch: {
		// 监控查询条件的变化 自动请求数据
		'calcGetRecordListIn': {
			handler(val, oldval) {
				// if (this.$util.isChgForWatch(val, oldval, ['pageIndex', 'markerID', 'smallProgramCardID', 'isAppend'])) {
				// 	this.reqCouponList();
				// }
				this.reqCouponList();
			},
			deep: true,
		},
	}
};
