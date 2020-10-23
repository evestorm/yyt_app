// 作者:杨亮

//------------------------------mock数据引入---------------------------
import notificationListMock from './notificationList_mock.js';

//------------------------------组件引入-------------------------------
import item from './item/item.vue';

//-------------------------Service引入----------------------------------
import TZUserMessage from '@/service/TZU/TZUserMessageAppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入


// 常量
let PageConstData = {
	app: getApp(),
	pageSize: 50, // 每次请求页码
	currentUser: storage.getAppUserInfo(), // 当前登录人信息
}

export default {
	// 组件放在data前面
	components: {
		item, // 核销卡片
	},
	// 职责: 程序中需要进行set的数据 (尽量少去定义data里面的属性 多用computed或者组件进行处理)
	data() {
		return {
			//---------------------常量------------------------
			PageConstData,
			filterArr: [{
				value: '0',
				label: '全部',
				selected: true,
			}, {
				value: '1',
				label: '未读',
				selected: false,
			}],
			//---------------------数据请求----------------------
			// 通知列表
			getListIn: {
				pageIndex: 1, // 第几页
				pageSize: PageConstData.pageSize, // 每页多少条
				messageIsRead: null, //消息是否已读
				storeID: this.$storage.getAppUserInfo().currentStoreId,
				phone: this.$storage.getAppUserInfo().phone
			},
			getListOut: {
				notReadCount: 0, //未读数量
				pagedResult: {
					dataList: [{
						type: '0', // 预定
						title: '预定成功通知',
						date: '刚刚',
						desc: '你提交的预订单(李白，20201015，午餐，生日宴) 已审核通过，请点击查看详情！',
					}, {
						type: '1', // 预定
						title: '昨日预订概况查看',
						date: '1分钟前',
						desc: '昨日【门店名称】全店预订桌数300，总收入：34563.00:  我的预订总桌数56，总收入：23423.00，请点击查看详情！',
					}], // 返回的data数据
					pageCount: 0, // 多少页
					rowCount: 0, // 总共多少数
				},
			},
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
			isNeedRefreshHome: false, //是否需要刷新首页
			loading: true, //骨架屏
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.urlOption = options;
	},
	onUnload() { //页面销毁时 刷新首页 更新右上角角标
		setTimeout(() => {
			if (this.isNeedRefreshHome) {
				uni.$emit('homePageRefresh');

			}
		}, 1000)
	},
	methods: {
		// 选择顶部筛选
		_handleSelFilter(item) {
			if (item.selected) return;
			this.filterArr.forEach((listItem) => {
				listItem.selected = false;
			});
			this.filterArr.find(v => v.value == item.value).selected = true;
			this.getListIn.messageIsRead = item.value == 1 ? 0 : null; //全部不传，未读传0；
		},
		//下拉刷新
		refreshList() {
			this.getListIn.pageIndex = 1
		},
		//上拉加载
		loadMore() {
			if (!this.isAllLoad) {
				this.getListIn.pageIndex += 1
			}
		},
		updateItem(data) { //接收子组件传来的id 更新视图
			this.updateMsg(data);
		},
		// 获取APP消息通知列表 
		async getList() {
			let result = await TZUserMessage.GetAPPNotificationList(this.getListIn);
			// 判断接口是正常返回 没有报错
			if (result) {
				this.loading = false;
				if (this.getListIn.pageIndex == 1) {
					this.getListOut = result;
				} else {
					let {
						notReadCount,
						pagedResult
					} = result;
					this.getListOut.pagedResult.dataList = this.getListOut.pagedResult.dataList.concat(pagedResult.dataList);
					this.getListOut.pagedResult.rowCount = pagedResult.rowCount;
					this.getListOut.notReadCount = notReadCount;
				}
			}
		},
		//更新消息通知 标记为 已读
		async updateMsg(id) {
			let data = {
				id: id,
				messageIsRead: 1 //消息是否已读
			}
			let res = await TZUserMessage.UpdateByDto(data)
			if (res) {
				let index = this._(this.getListOut.pagedResult.dataList).findIndex(x => x.id == id);
				this.getListOut.pagedResult.dataList[index].messageIsRead = 1;
				this.isNeedRefreshHome = true;
			}
		}
	},
	// 职责:不要set的data 统一用computed实现(能用computed实现的尽量用他实现 不要用data和method处理)
	computed: {
		calcFilterArr() { //顶部搜索此案时处理
			let tempArr = this._.cloneDeep(this.filterArr);
			tempArr.find(v => v.value == '1').label = `未读(${this.getListOut.notReadCount})`;
			return tempArr;
		},
		// 接口返回值处理 calc加data的接口out
		calcGetListOut() {
			if (!this.getListOut.pagedResult) {
				return
			}
			let dataList = this._.cloneDeep(this.getListOut.pagedResult.dataList);
			return dataList;
		},
		// 是否加载完成
		isAllLoad() {
			// 是空先展示空
			return !this.isEmpty && this.getListOut.pagedResult && this.getListOut.pagedResult.rowCount == this.getListOut.pagedResult
				.dataList.length;
		},
		// 是否没有数据
		isEmpty() {
			if (!this.getListOut.pagedResult) {
				return
			}
			return this.getListOut.pagedResult.dataList.length == 0;
		},
		calcGetListIn() { //用于监听请求加载
			return this._.cloneDeep(this.getListIn)
		}
	},
	// 职责:格式化数据
	filters: {
		// 多个参数filter 调用  {{day|weekDayFmt(getStudentListIn.month)}} filter filter后缀加上Fmt
		//weekDayFmt: function (day, yearMonth) {
		//    var weekDay = moment(yearMonth + "-" + day).day();
		//    var weekObj = { 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "日" };
		//    return weekObj[weekDay];
		//},
	},
	// 职责:数据变化后需要和接口交互
	watch: {
		// 监控查询条件的变化 自动请求数据
		'calcGetListIn': {
			handler(val, oldval) {
				if (this.$util.isChgForWatch(val, oldval, ['pageIndex', 'messageIsRead'])) {
					this.getList();
				}
			},
			deep: true,
			immediate: true,
		}
	}
};
