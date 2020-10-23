//组件
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";

import storage from '@/common/unistorage/index.js';
//请求
import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
import YHProjectConf from '@/service/YH/YHProjectConfAPPService.js';
const app = getApp();
export default {
	async onNavigationBarButtonTap() {
		let storageData = storage.getTaskList();
		//发送保存项目请求
		let data = {
			banquetOrderGUID: this.queryData.banquetOrderGUID, //宴会单id
			createdName: storage.getAppUserInfo().userName, //操作人
			projectItems: storageData //宴会项目集合[]
			// projectItems:[//宴会项目集合[]
			// 	// projectConfGUID:'',//项目配置id#
			// 	// taskConfGUIDs:[],//任务配置id集合#projectItems
			// ], 
		};
		let res=await YHBanquetProject.BatchAddBanquetProjects(data);
			if (res.length != 0) {
				storage.removeTaskList(); //清除缓存
				uni.navigateBack({
					delta: 1
				})
			}
		
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			projectList: [], //页面显示项目列表
			queryData: { //请求任务列表参数
				storeId: storage.getAppUserInfo().currentStoreId, //门店id
				banquetOrderGUID: "", //宴会单id
				pageIndex: 0, //页码
				pageSize: 10 //每页显示数量
			},
			projectNum: 0, //项目数量
			taskNum: 0, //任务数量
			storageList: [], //缓存项目的数据
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
		}
	},
	components: {
		// MescrollUni
	},
	onLoad(option) {
		// console.log('添加项目option', option)
		//????宴会单id banquetOrderGUID
		this.queryData.banquetOrderGUID = option.banquetId;
		// this.queryData.banquetOrderGUID = 'b35919a5-cd1f-ea11-ba53-fc0e03bf8d3e';

	},
	onShow() {
		// let that=this;
		//获取缓存的项目数据渲染页面 显示已选择的任务数
		let storageData = [];
		if (storage.getTaskList()) {
			storageData = storage.getTaskList();
		}
		// let storageData = storage.getTaskList();
		// console.log('页面显示this.projectList',this.projectList)
		// console.log('storageData', storageData)
		this._(this.projectList).forEach(item => {
			let index = this._(storageData).findIndex(x => x.projectConfGUID == item.id);
			if (index != -1) {
				// console.log('storage下标',index)
				item.taskConfGUIDs = storageData[index]['taskConfGUIDs'];
				if (item.taskConfItems.length > 0) {
					this.$set(item, 'checked', true);
				}
			}
		});
		if (storageData) {
			this.getProjectAndTask(storageData);
		}
	},
	computed: {},
	methods: {
		checkboxChange(item) { //点击复选框
			item.checked = item.checked == true ? false : true;
			let storageData = [];
			if (storage.getTaskList()) {
				storageData = storage.getTaskList();
			}
			if (item.checked) { //该项目下面所有的任务选中
				let taskConfGUIDsArr = [];
				item.taskConfItems.forEach(x => {
					taskConfGUIDsArr.push(x.id)
				})
				let index = this._(storageData).findIndex(
					x => x.projectConfGUID == item.id
				);
				if (index != -1) {
					storageData[index].taskConfGUIDs = taskConfGUIDsArr;
					storage.setTaskList(storageData);
					// console.log(storageData)
					item.taskConfGUIDs = taskConfGUIDsArr;
				} else { //缓存中没有该数据
					let data = {
						projectConfGUID: item.id,
						taskConfGUIDs: taskConfGUIDsArr
					}
					storageData.push(data);
					storage.setTaskList(storageData);
					item.taskConfGUIDs = taskConfGUIDsArr;
					// console.log(data)
				}
				// console.log(index)
			} else { //清除改项目下面的缓存
				let index = this._(storageData).findIndex(
					x => x.projectConfGUID == item.id
				);
				if (index != -1) {
					storageData.splice(index, 1);
					storage.setTaskList(storageData);
					item.taskConfGUIDs = [];
				}
			}
			this.getProjectAndTask(storageData);
			// console.log('storageData2', storageData);
		},
		gotoAddTask(item) { //跳转添加项目页面
			//缓存任务数据
			// let value={
			// 	id:item.id,
			// 	title:item.projectConfName,
			// 	list:item.taskConfItems
			// };
			// storage.setTaskList(value);
			//项目id传参至任务列表页面
			item = JSON.stringify(item);
			uni.navigateTo({
				url: `/pages/banquetSub/addProjectTask/addProjectTask?list=${item}`
			})
		},
		//获取顶部显示有多少项目 任务
		getProjectAndTask(data) {
			let num = 0,
				proNum = 0;
			this._(data).forEach(item => {
				num += item.taskConfGUIDs.length;
				if (item.taskConfGUIDs.length != 0) {
					proNum += 1
				}
			})
			this.projectNum = proNum;
			this.taskNum = num;
		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			this.queryData.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.queryData.pageSize = mescroll.size; // 页长, 默认每页10条

			let data=await YHProjectConf.GetProjectConfList(this.queryData);
				// cuetitle3this.title
				// 接口返回的当前页数据列表 (数组)
				let curPageData = data.dataList;
				//给taskConfGUIDs动态添加已选择的任务数组taskConfGUIDs
				this._(curPageData).forEach(x => x.taskConfGUIDs = []);
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = data.pageCount;
				// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
				let totalSize = data.rowCount;
				// this.pageNum = data.rowCount;
				let Pindex = data.pageIndex; //当前页数
				// 接口返回的是否有下一页 (true/false)
				let hasNext = Pindex > totalPage ? true : false

				//设置列表数据
				if (mescroll.num == 1) this.projectList = []; //如果是第一页需手动置空列表
				this.projectList = this.projectList.concat(curPageData); //追加新数据

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
	}
}
