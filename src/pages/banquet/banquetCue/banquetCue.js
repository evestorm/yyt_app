import YHClue from '@/service/YH/YHClueAppService.js';
import storage from '@/common/unistorage/index.js';
import util from '@/common/util.js';
//组件
import uniIcons from '@/components/uni-icon/uni-icon';
import banquetCueItem from './banquet-cue-item/banquet-cue-item.vue';
import {
	mockCueList
} from '@/pages/banquet/banquetCue/banquetCue_mock.js'

let PageConstData = { 
	chooseHandleStyle: [ //最近新增-选择
		{
			label: '最近新增',
			value: '1',
			selected: true
		},
		{
			label: '最近跟进',
			value: '2',
			selected: false
		},
		{
			label: '未跟进时间降序',
			value: '3',
			selected: false
		},
		{
			label: '线索成交率升序',
			value: '4',
			selected: false
		},
		{
			label: '线索成交率降序',
			value: '5',
			selected: false
		},
	],
	clueStatusArr: [ //线索状态列表
		{
			label: '全部',
			value: 0
		},
		{
			label: '已成交',
			value: 3
		},
		{
			label: '已取消',
			value: 2
		},
		{
			label: '跟进中',
			value: 1
		}
	],
	clueLevel: [ //线索等级列表
		{
			label: '全部',
			value: ''
		},
		{
			label: 'A',
			value: 3
		},
		{
			label: 'B',
			value: 2
		},
		{
			label: 'C',
			value: 1
		}
	]
}
export default {
	data() {
		return {
			// ------------------------------------------------const参数-----------------------------
			PageConstData,
			picDomain: getApp().globalData.PicDomain,
			// ------------------------------------------------筛选相关参数-----------------------------
			isActive: false, //展示顶部筛选方式列表
			isOrigin: false, //展示顶部筛选来源列表
			isFllow: false, //展示顶部筛选跟进人列表
			isShowSidebar: false, // 默认不显示侧边栏

			searchData: {}, //跟进人列表
			// ------------------------------------------------请求线索列表相关参数-----------------------------
			pageData: { //请求数据
				clueUserName: "", //线索用户姓名
				clueUserPhone: "", //线索用户电话
				clueLevel: "", //线索成交率(1,低C;2,中B;3,高A)
				clueStatus: "1", //线索状态(1,跟进中;2,已取消;3,成交)
				clueSourceType: "", //线索来源(1,手动录入;2,表单;3,三方平台)
				marketSeID: "", //营销页ID
				clueListOrderType: 1, //线索列表排序方式(1,最近新增;2,最近跟进;3,未跟进时间降序;4,线索成交率升序;5,线索成交率升序)
				marketerID: "", //客户经理ID
				pageIndex: "1", //页码
				pageSize: "10", //每页显示数量
				storeId: storage.getAppUserInfo().currentStoreId, //门店id
				userNameOrPhone: '', //顶部搜索框输入
				isSeeAll: 0, //用于选择经理时判断是否有权限看所有数据
			}, //获取线索分页列表参数
			getBAnquetCut: { //接口获取到的线索
				banquetCuelist: [], //线索分页列表
				pageNum: 0, //显示多少条数据
			},
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
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			mescrollSingle: {}, //缓存mescroll参数 用于刷新
			navFilterBottom: 288, // 顶部筛选bottom高度,mescroll 距顶高度
		}
	},
	props: {
		banquetReload: { //宴会
			type: Object,
			default: function() {
				return {}
			}
		},
		storeId: {
			type: String
		},
		payload: { //模拟接收的tabbar过来的参数
			type: Object,
			default: function() {
				return {};
			},
		},
	},
	components: {
		banquetCueItem
	},
	mounted() {
		this.getClueSourceOfSearch(); //获取数据来源.跟进人
		this.pageData.marketerID = this.$storage.getAppUserInfo().marketerId;

		// 监听刷新事件
		uni.$on('reloadPage', res => {
			if (res == 'refresh') {
				this.refresh();
			}
		});
		// //挖掘宴会线索后 需要刷新跟踪人列表 否则数量对不上
		uni.$on('freshSearch', res => {
			if (res == 'refresh') {
				this.getClueSourceOfSearch();
			}
		})
	},
	methods: {
		//顶部搜索--防抖 
		searchChange: util.debounce(function(e) {
			this.pageData.userNameOrPhone = e.detail.value;
		}, 600),
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		//获取数据来源.跟进人
		async getClueSourceOfSearch() {
			let data = {
				storeId: this.storeId
			}
			this.searchData = await YHClue.GetClueSourceOfSearch(data);
		},
		//获取线索分页列表集合
		getCluePagedList(data) {
			this.refresh();
			this.isShowSidebar = false;
		},
		//选择筛选开始时间
		startDateChange(e) {
			this.pageData.clueCreateStartDate = e.target.value;
			this.pageData = Object.assign({}, this.pageData);
		},
		//选择筛选结束时间
		endDateChange(e) {
			this.pageData.clueCreateEndDate = e.target.value;
			this.pageData = Object.assign({}, this.pageData);
		},
		reSet() { //popup重置按钮
			this.pageData.clueCreateStartDate = undefined;
			this.pageData.clueCreateEndDate = undefined;
			this.pageData.clueLevel = '';
			this.pageData.clueStatus = 0;
		},
		clickTitle1() { //点击筛选条件-最近更新
			this.isOrigin = false;
			this.isFllow = false;
			this.isActive = !this.isActive;
		},
		clickTitle2() { //点击筛选条件-线索来源
			this.isActive = false;
			this.isFllow = false;
			this.isOrigin = !this.isOrigin;
		},
		clickTitle3() { ////点击筛选条件-跟进人 
			if (this.$cw.canSeeYHClueAll()) {
				this.isFllow = !this.isFllow;
				this.isOrigin = false;
				this.isActive = false;
			}
		},
		//点击来源选项
		chooseHandleClick(str) {
			this.isActive = false;
			this.pageData.clueListOrderType = str.value;
			// this.refresh();
		},
		chooseOrigin(index, str) { //选择线索来源
			let marketerID = str.marketSetID;
			//请求
			this.pageData.marketSeID = index == 2 ? str.marketSetID : '';
			// this.refresh();
			this.isOrigin = false;
		},
		clickMengBan() {
			this.isOrigin = false;
			this.isActive = false;
			this.isFllow = false;
		},
		followConfirm(item) { //选择跟进人
			this.pageData.marketerID = item.value;
			if (item.value != storage.getAppUserInfo().marketerId && item.value != '') {
				this.pageData.isSeeAll = 0
			} else {
				this.pageData.isSeeAll = item.marketerName == '全部' ? 1 : 0
			}
			// this.refresh();
			this.isFllow = false;
		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			if (!getApp().globalData.banquetPageData.isLoadLead) return; // 不为true 不加载;
			this.pageData.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.pageData.pageSize = mescroll.size; // 页长, 默认每页10条
			let queData = this._.cloneDeep(this.pageData);
			queData.clueCreateEndDate = this.pageData.clueCreateEndDate ? this.pageData.clueCreateEndDate + ' 00:00:00' :
				undefined;
			queData.clueCreateStartDate = this.pageData.clueCreateStartDate ? this.pageData.clueCreateStartDate + ' 00:00:00' :
				undefined;
			let data = await YHClue.GetCluePagedList(queData);
			// 接口返回的当前页数据列表 (数组)
			let curPageData = data.dataList;
			let totalPage = data.pageCount;
			this.getBAnquetCut.pageNum = data.rowCount;
			let Pindex = data.pageIndex; //当前页数
			// 接口返回的是否有下一页 (true/false)
			let hasNext = Pindex > totalPage ? true : false
			//设置列表数据
			if (mescroll.num == 1) this.getBAnquetCut.banquetCuelist = []; //如果是第一页需手动置空列表
			this.getBAnquetCut.banquetCuelist = this.getBAnquetCut.banquetCuelist.concat(curPageData); //追加新数据
			// 成功隐藏下拉加载状态
			mescroll.endByPage(curPageData.length, totalPage);
			// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
			this.$nextTick(() => {
				mescroll.endSuccess(curPageData.length)
			})
		},
		triggerSearch() {
			this.$util.baiduEvent('线索搜索', '宴会线索顶部线索搜索');
		},
		calcMescrollTop() { //计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.filter-result-wrapper').boundingClientRect(data => {
					this.navFilterBottom = data.bottom.toString();
				}).exec();
			});
		},
	},
	computed: {
		isMengban1() { //灰色背景蒙版显示
			if (this.isActive || this.isOrigin || this.isFllow) {
				return true;
			} else {
				return false;
			}
		},
		cuetitle1() { //顶部排序筛选
			let arr = this.PageConstData.chooseHandleStyle;
			arr.map(x => {
				x.selected = x.value == this.pageData.clueListOrderType;
			})
			let obj = this._.find(arr, x => x.selected);
			return obj.label;
		},
		originList() { //线索来源列表
			let Data = this._.cloneDeep(this.searchData);
			let orgArr = [],
				orgWeb = [],
				orgHand = [];
			// Object.keys(Data).forEach((key) => {
			// 	if (key == 'clueOfWrites') {
			//手动录入项集合
			orgHand = this._(Data['clueOfWrites']).chain()
				.map(x => ({
					value: x.marketSetID || '',
					label: `${x.name}`,
					selected: this.pageData.clueSourceType == 1 && this.pageData.marketSeID == '',
					trackCount: x.clueCount,
				})).value();
			let obj1 = {
				label: '手动录入',
				value: '1',
				children: orgHand
			}
			orgArr[0] = obj1;
			// }
			// if (key == 'clueOfForms') {
			//营销页项集合
			orgWeb = this._(Data['clueOfForms']).chain()
				.map(x => ({
					marketSetID: x.marketSetID,
					label: `${x.marketSetName}`,
					selected: this.pageData.clueSourceType == 2 && x.marketSetID == this.pageData.marketSeID,
					clueCount: x.clueCount,
				})).value();
			let obj2 = {
				label: '营销页',
				value: '2',
				children: orgWeb
			}
			orgArr[1] = obj2;
			// }
			// });
			return orgArr
		},
		followList() { //跟进人筛选列表
			let Data = this._.cloneDeep(this.searchData);
			let marketerID = this.pageData.marketerID;
			let arr = [];
			arr = this._(Data['clueOfMarketers']).chain()
				.map(x => ({
					value: x.marketerID,
					marketerName: x.marketerName,
					marketerID: x.marketerID, //
					label: `${x.marketerName}(${x.clueCount})`,
					clueCount: x.clueCount,
					selected: marketerID == x.marketerID
				})).value();
			this.$storage.setBanquetMarketers(arr);
			return arr;
		},
		cuetitle2() { //展示线索来源
			let str = this.pageData.clueSourceType && this.originList && this.pageData.clueSourceType == 2 ?
				this._.find(this.originList[
					this.pageData.clueSourceType - 1].children, ['marketSetID', this.pageData.marketSeID]).label : '全部'
			return str;
		},
		banquetAuthAll() { //跟进人是否显示全部 (还是当前人 )
			let bol = false;
			bol = this.banquetReload.banquetAuth == '全部' ? this.$cw.canSeeYHClueAll() : false;
			return bol;
		},
		showMarketerNameAndCount() {
			let arr = this.followList && this._.find(this.followList, 'selected');
			if (!this._.isEmpty(arr)) {
				return arr.label
			} else {
				let str = this.$storage.getAppUserInfo().userName;
				let ourArr = this._.find(this.followList, ['marketerName', str])
				if (!this._.isEmpty(ourArr)) {
					str += ` (${arr.label})`
				}
				return str
			}
		},
		watchPageData() { //监听pageData变化 
			return this._.cloneDeep(this.pageData);
		}
	},

	watch: {
		"watchPageData": {
			handler(val, old) {
				console.log(val.clueSourceType, old.clueSourceType)
				if (val.pageIndex != old.pageIndex || val.clueSourceType != old.clueSourceType || val.clueCreateStartDate != old.clueCreateStartDate || val.clueCreateEndDate !=
					old.clueCreateEndDate || val.clueStatus != old.clueStatus || val.clueLevel != old.clueLevel) {
					return;
				}
				this.refresh();
			},
			deep: true
		},
		banquetReload: {
			handler: function(val, oldval) {
				console.log('watch=banquetReload', val)
				if (val.banquetAuth == '全部') {
					if (this.$cw.canSeeYHClueAll()) {
						this.pageData.marketerID = ""
						this.pageData.isSeeAll = 1;
						this.refresh();
					} else {
						this.pageData.marketerID = this.$storage.getAppUserInfo().marketerId;
						this.pageData.isSeeAll = 0;
						this.refresh();
					}
				} else {
					this.marketerName = this.$storage.getAppUserInfo().userName;
					this.pageData.marketerID = this.$storage.getAppUserInfo().marketerId;
					this.pageData.isSeeAll = 0;
					this.refresh();
				}
			},
			deep: true
		},
		'storeId': {
			handler: function(val, old) {
				this.pageData.storeId = val;
				this.getClueSourceOfSearch(); //获取数据来源.跟进人
				this.pageData.marketerID = this.$storage.getAppUserInfo().marketerId;
				this.refresh();
			}
		},
		payload: {
			handler(val, oldVal) {
				console.log('[watch]: 模拟接收的tabbar过来的参数 payload', val);
				let {
					clueLevel, // 线索成交率
					clueStatus, // 线索状态
					tabIndex,
					dataType, //个人全部
				} = val;
				if (tabIndex == 0) {
					this.reSet();
					if (clueLevel) {
						this.pageData.clueLevel = clueLevel;
					} else if (clueStatus) {
						this.pageData.clueStatus = clueStatus;
					} else {
						this.pageData.clueStatus = '1';
					}
					this.getCluePagedList(this.pageData);
				}
			},
			deep: true,
			immediate: true
		},
	}
};
