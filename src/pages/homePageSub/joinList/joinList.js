// 作者:覃彬

//------------------------------mock数据引入---------------------------
import joinListMock from './joinList_mock.js';

//------------------------------组件引入-------------------------------
import joinListItem from './join-list-item/join-list-item.vue';


//-------------------------Service引入----------------------------------
import XT from '@/service/XT/XTTaskAppService.js';
const PAGESIZE = 999
const state = [ //筛选状态
	{
		label: '未完成',
		value: '10'
	},
	{
		label: '已完成',
		value: '20'
	},
	{
		label: '全部',
		value: '0'
	}
];
export default {
	// 组件放在data前面
	components: {
		joinListItem, // 协同列表项

	},
	data() {
		return {
			// --------------------------------------const参数---------------------------
			constData: {
				state: state
			},
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
			// --------------------------------------请求列表参数---------------------------
			queryData: {
				taskStatus: 10, //任务状态(10,进行中;20,已完成)
				month: '', //月份
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				marketId: this.$storage.getAppUserInfo().marketerId, //客服经理id
				pageIndex: 1,
				pageSize: PAGESIZE,
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10
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
			navFilterBottom: 230, // 顶部筛选bottom高度,mescroll 距顶高度
			mescrollSingle: {}, //记录上拉刷新组件的参数
			joinList: [], //接口请求得到的协同列表
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.calcMescrollTop();
		uni.$on('joinRefresh', () => {
			this.refresh();
		})
	},
	methods: {
		getRangeDate(data) { //接收选择时间组件的日期范围（年月）
			this.queryData.month = data.chooseDate;
		},
		calcMescrollTop() { //计算mescroll高度
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.join-type').boundingClientRect(data => {
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
			this.queryData.pageIndex = mescroll.num; // 页码, 默认从1开始
			// 此时mescroll会携带page的参数:
			let data = await XT.GetXTTaskPagedList(this.queryData);
			// 接口返回的当前页数据列表 (数组)
			let curPageData = data.pagedResult.dataList;
			curPageData = this.$util.null2str(curPageData);
			// let Pindex = data.pageIndex; //当前页数
			let totalPage = data.pageCount;
			// 接口返回的是否有下一页 (true/false)
			// let hasNext = Pindex > totalPage ? true : false
			//设置列表数据
			if (mescroll.num == 1) this.joinList = []; //如果是第一页需手动置空列表
			this.joinList = this.joinList.concat(curPageData); //追加新数据
			// 成功隐藏下拉加载状态
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			mescroll.endByPage(curPageData.length, totalPage);
			// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
			this.$nextTick(() => {
				mescroll.endSuccess(curPageData.length)
			})
		},
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},

	},
	computed: {
		calcQeryData() { //监听请求参数
			return this._.cloneDeep(this.queryData);
		}
	},
	watch: {
		"calcQeryData": {
			handler(val, oldval) {
				if (this.$util.isChgForWatch(val, oldval, ['month', 'taskStatus'])) {
					this.refresh();
				}
			},
			deep: true
		}
	}
};
