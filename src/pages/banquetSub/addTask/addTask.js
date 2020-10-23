//组件
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"; // 侧边栏抽屉
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";

import FWBizOption from '@/service/FW/FWBizOptionAppService.js'; //获取任务配置
import YHTaskConf from '@/service/YH/YHTaskConfAppService.js'; //获取任务类别
import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js'; //添加宴会任务
import storage from '@/common/unistorage/index.js';
const app = getApp();
export default {
	async onNavigationBarButtonTap(val) {
		// console.log('添加任务请求参数', this.addTaskData)
		//添加宴会任务
		if (this.addTaskData.taskConfGUIDs.length != 0) {
			let res=await YHBanquetTask.BatchAddBanquetTasks(this.addTaskData);
				uni.navigateBack({
					delta: 1
				})
			
		}
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			storeId: storage.getAppUserInfo().currentStoreId, //门店id
			//获取宴会任务参数
			queryData: {
				banquetProjectGUID: '', //宴会项目id
				taskName: '', //任务名称
				taskType: '', //任务类别
				pageIndex: '', //页码
				pageSize: '' //每页显示数量
			},
			//添加宴会任务参数
			addTaskData: {
				banquetOrderGUID: '', //宴会单id
				createdName: storage.getAppUserInfo().userName, //操作人
				banquetProjectGUID: '', //项目配置id
				taskConfGUIDs: [], //任务id集合
			},
			projectTitle: '', //所属项目
			taskList: [], //页面显示列表
			taskRows: [], //popup 任务类别
			isCheck: '', //任务类别选中class
			isShowSidebar: false, // 默认不显示侧边栏
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			mescrollSingle: {},
		}
	},
	components: {
		uniPopup,
		uniDrawer,
		// MescrollUni
	},
	async onLoad(option) {
		// console.log('添加任务option', option)
		//????????获取其宴会项目id  宴会订单id 
		this.queryData.banquetProjectGUID = option.banquetProjectGUID;
		this.addTaskData.banquetOrderGUID = option.banquetOrderGUID;
		this.addTaskData.banquetProjectGUID = option.banquetProjectGUID;
		//获取任务类别
		let data = {
			"order": "OrderCode  desc",
			"viewName": "view_FW_BizOption",
			"filter": `{"Type":"and","conditions":[{"Attribute":"buUnitGUID","Datatype":"nvarchar","Operatoer":"eq","Value":'${this.storeId}'},{"Attribute":"bizParamCode","Datatype":"nvarchar","Operatoer":"eq","Value":"TaskType"}]}`,
			"page": 1,
			"rows": 20,
			"select": "id,BizOptionName"
		};
		let res=await FWBizOption.GetGridDto(data);
			this.taskRows = res.rows;
		
	},
	computed: {},
	methods: {
		// openright() { //打开popup
		// 	this.$refs.popup.open();
		// 	this.isPopupOpen = true;
		// },
		// 显示抽屉
		showDrawer() {
			this.isShowSidebar = true;
		},
		// 隐藏抽屉
		closeDrawer() {
			this.isShowSidebar = false;
		},
		reSet() { //popup重置按钮
			this.queryData.taskType = '';
			this.isCheck = '';
			// console.log(this.queryData.taskType)
		},
		getPagedList() { //popup完成按钮
			this.getData();
			// this.$refs.popup.close();
			this.isShowSidebar = false;
		},
		getData() { //获取数据-筛选
			// YHTaskConf.GetTaskConfList(this.queryData, res => {
			// 	this.taskList = this.$util.null2str(res.taskConfPagedResult.dataList);
			// 	this.addTaskData.taskConfGUIDs=[];
			// })
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		checkboxChange(item) { //点击复选框
			let index = this._(this.addTaskData.taskConfGUIDs).findIndex(
				x => x == item.id
			);
			if (index != -1) {
				this.addTaskData.taskConfGUIDs.splice(index, 1);
				item.checked = false;
			} else {
				this.addTaskData.taskConfGUIDs.push(item.id);
				item.checked = true;
			}
			// console.log('taskList', this.addTaskData.taskConfGUIDs)
		},
		checkTaskType(id) { //点击popup的任务类别
			this.isCheck = id;
			this.queryData.taskType = id;
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

			let res=await YHTaskConf.GetTaskConfList(this.queryData);
				// 获取宴会项目名称和宴会项目id
				this.projectTitle = res.projectConfName;
				// this.addTaskData.projectConfGUID=res.id;
				// 接口返回的当前页数据列表 (数组)
				let data = this.$util.null2str(res.taskConfPagedResult);
				let curPageData = data.dataList;
				// console.log('data:',data)
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = data.pageCount;
				// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
				let totalSize = data.rowCount;
				// this.pageNum = data.rowCount;
				let Pindex = data.pageIndex; //当前页数
				// 接口返回的是否有下一页 (true/false)
				let hasNext = Pindex > totalPage ? true : false

				//设置列表数据
				if (mescroll.num == 1) this.taskList = []; //如果是第一页需手动置空列表
				this.taskList = this.taskList.concat(curPageData); //追加新数据
				// this.addTaskData.taskConfGUIDs=[];
				this._(this.taskList).forEach(item => {
					let cacheItem = this._(this.addTaskData.taskConfGUIDs).find(
						x => x== item.id
					);
					if (cacheItem) {
						item.checked = true;
					}
				});
				// 成功隐藏下拉加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
				// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length);
				})
				fail: () => {
					// 失败隐藏下拉加载状态
					mescroll.endErr();
				}
			
		}
	},
	watch: {
		'queryData.taskName': {
			handler: function(val, oldval) {
				if (val || val == '') {
					this.getData();
				}
			}
		},
	}
}
