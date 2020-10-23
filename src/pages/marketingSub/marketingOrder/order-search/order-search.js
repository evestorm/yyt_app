// 作者:覃彬
import CY18 from '@/service/CY/CY18AppService.js';
import GK10 from '@/service/GK/GK10AppService.js';
//------------------------------mock数据引入---------------------------
// import orderSearch from './order-search_mock.js';
export default {
	name: 'yyt-top-search',
	// 注册属性
	props: {
		selectedMarketId: { //选中的客服经理id
			type: String,
			require: false,
			default: ''
		},
		top: {
			type: Number,
			require: false,
			default: 90,
		}
	},
	created() {
		this.getStoreManager();
		this.getActivityName();
	},
	data() {
		return {
			// ------------------------------接口相关相关------------------------------
			//获取客服经理相关
			getStoreManagerIn: {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
			},
			getStoreManagerOut: {
				searchMarketList: [], //
			},
			//获取活动信息
			getActivityNameIn: {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				type: '', //类型(1 营销页，2会员卡，3优惠券)
			},
			getActivityNameOut: {
				searchActivityList: []
			},
			//获取订单详情
			getOrderDetailsIn: {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID, //企业ID
				pageIndex: 1,
				pageSize: 10,
				marketId: this.$storage.getAppUserInfo().marketerId, //客服经理id
				dateType: "",
				startTime: "",
				endTime: "",
				contentID: "", //会员卡优惠券ID
			},
			isShowDataList: false, //是否展示下拉筛选项
			// ------------------------------客服经理筛选相关------------------------------
			calcSelectedMarketId: this.$storage.getAppUserInfo().marketerId, //选中的id
			// ------------------------------活动筛选相关------------------------------
			selectedActivityId: '', //活动id
			topSearchActivityText: '活动名称', //活动名称
			isFirstClickActivity: false, //首次点击前 展示'活动名称'，点击后展示筛选的label
			activityTypeList: [{ //活动类型筛选
				text: '全部',
				value: '',
				arr: [],
				// selected:false,
			}, {
				text: '会员卡',
				value: '2',
				arr: [],
				// selected:false,
			}, {
				text: '优惠券',
				value: '3',
				arr: [],
				// selected:false,
			}]
		};
	},
	methods: {
		// ------------------------------客服经理筛选相关------------------------------
		changeIsShowDataList(str) { //点击筛选 是否展示下拉选
			this.isShowDataList = this.isShowDataList === str ? false : str;
		},
		_selMarket(item) { //选择客服经理筛选项
			this.calcSelectedMarketId = item.value;
			let obj = {
				selectText: item.label,
				selectId: item.value
			}
			this.$emit('selMarketData', obj)
		},
		// ------------------------------活动筛选相关------------------------------
		_searchActivity(item) {
			if (!this.isFirstClickActivity) this.isFirstClickActivity = true;
			item.selected = true;
			this.selectedActivityId = item.value;
			this.topSearchActivityText = this.isFirstClickActivity ? item.label : '活动名称'
			let obj = {
				selectText: item.label,
				selectId: item.value,
				type: this.getActivityNameIn.type
			}
			this.$emit('selActivityData', obj)
		},
		// 获取活动信息
		async getActivityName() {
			let res = await GK10.GetActivityName(this.getActivityNameIn);
			this.getActivityNameOut.searchActivityList = res.activity;
			//将格式化后的数组添加到对应的类型里
			let index = this._(this.activityTypeList).findIndex(x => x.value == this.getActivityNameIn.type);
			this.activityTypeList[index].arr = this.calcSearchActivityList;
		},
		//获取客服经理
		async getStoreManager() {
			let res = await CY18.GetCustomerServiceManager(this.getStoreManagerIn);
			this.getStoreManagerOut.searchMarketList = res.result.dataList;
		},
	},
	computed: {
		// ------------------------------客服经理筛选相关------------------------------
		calcSearchMarketList() { //展示的客服经理筛选数组
			let arr = this._.cloneDeep(this.getStoreManagerOut.searchMarketList);
			let obj = {
				marketerName: '全部',
				marketerID: '',
			}
			return this._(arr).chain()
				.filter(v => v.userIsDisabeld == 0)
				.unshift(obj)
				.map(x => ({
					label: x.marketerName,
					value: x.marketerID,
					// count: x.count || null,
					selected: this.calcSelectedMarketId == x.marketerID
				})).value();
		},
		topSearchMarketText() { //顶部展示筛选出来的客服经理文字
			let arr = this._.find(this.calcSearchMarketList, 'selected');
			return arr && arr.label || '客服经理'
		},
		// ------------------------------优惠活动相关------------------------------
		// //活动类型筛选
		calcActivityList() {
			let obj = this._(this.activityTypeList).find(x => x.value == this.getActivityNameIn.type)
			// obj.selected=true;
			return obj.arr
		},
		calcSearchActivityList() { //格式化请求得到的活动数组
			let arr = this._.cloneDeep(this.getActivityNameOut.searchActivityList);
			let obj = {
				setName: '全部',
				content: '',
			}
			return this._(arr).chain()
				.unshift(obj)
				.map(x => ({
					label: x.setName,
					value: x.content,
					// count: x.count || null,
					selected: this.selectedActivityId == x.content
				})).value();
		},

		// topSearchActivityText() { //顶部展示筛选出来的活动文字
		// 	let obj = this._.find(this.calcSearchActivityList, 'selected');
		// 	return this.isFirstClickActivity ? obj&&obj.label  : '活动名称'
		// },
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		//监听活动类型改变
		"getActivityNameIn.type": {
			handler(val, oldval) {
				let index = this._(this.activityTypeList).findIndex(x => x.value == this.getActivityNameIn.type);
				if (val && this._.isEmpty(this.activityTypeList[index].arr)) {
					this.getActivityName();
				}
			}
		}
	},
};
