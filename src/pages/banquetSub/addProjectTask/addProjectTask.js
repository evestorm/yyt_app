// import CY17AppService from '@/service/CY/CY17AppService.js';
import storage from '@/common/unistorage/index.js'
export default {
	onNavigationBarButtonTap(val) {
		//获取缓存的项目
		let storageList = [];
		if (storage.getTaskList()) {
			storageList = storage.getTaskList();
		}
		// console.log(storageList)
		// let storageList=[// moke
		// 	{
		// 		projectConfGUID:this.projectList.id,
		// 		taskConfGUIDs:this.projectList.taskConfItems
		// 	},
		// 	{
		// 		projectConfGUID:'123456',
		// 		taskConfGUIDs:['111','222']
		// 	}
		// ];
		let List = { //当前页面选中的任务 
			projectConfGUID: this.projectList.id,
			taskConfGUIDs: this.selList
		};

		//保存选择的项目 缓存中有数据 就更新相应项目的selList  否则就添加
		let findIndex = this._(storageList).findIndex(x => x.projectConfGUID == this.projectList.id);
		if (this.selList.length != 0) {
			if (findIndex == -1) {
				storageList.push(List)
			} else {
				storageList[findIndex] = List;
			}
		} else {
			storageList.splice(findIndex, 1)
		}

		//更新缓存
		storage.setTaskList(storageList);
		// console.log(storageList)
		//跳转添加项目页面
		uni.navigateBack({
			delta: 1
		})
	},
	data() {
		return {
			projectList: {}, //接收项目数据
			taskList: [], //页面展示任务数据
			isCheckAll: false, //是否全选
			selList: [], //已选中的id数组
		};
	},
	// 页面加载事件
	onLoad(option) {
		//接收选择项目传输数据
		this.projectList = JSON.parse(option.list);
		// console.log('添加任务页面和接受的option', this.projectList)
		this.taskList = this.projectList.taskConfItems;
		//接收storage checkbox 
		// let storageList=[];
		// if(storage.getTaskList()){
		let storageList = storage.getTaskList();
		// }
		// console.log(this.taskList)
		// console.log('缓存', storageList)
		this._(storageList).forEach(item => {
			if (this.projectList.id == item.projectConfGUID) {
				this.selList = item.taskConfGUIDs;
			}

		})
		this._(this.taskList).forEach(item => {
			let findIndex = this._(this.selList).findIndex(x => x == item.id);
			// console.log(item)
			// console.log(findIndex)
			if (findIndex != -1) {
				item.checked = true;
			}
		})

	},
	methods: {
		//点击顶部复选框 全选
		checkAll() {
			this.isCheckAll = this.isCheckAll == true ? false : true;
			let items = this.taskList;
			for (let i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (this.isCheckAll) {
					// console.log("Tall:" + item)
					// this.$set(item,'checked',true);
					item.checked = true;
					this.selList.push(item.id)
				} else {
					// console.log("Fall:" + item)
					item.checked = false;
					// this.$set(item,'checked',false);
					this.selList = [];
				}
			}
			//去重
			let set = new Set(this.selList);
			this.selList = Array.from(set);
			// console.log(this.selList);
		},
		checkboxChange(item) { //点击复选框
			let index = this._(this.selList).findIndex(
				x => x == item.id
			);
			if (index != -1) {
				this.selList.splice(index, 1);
				item.checked = false;
			} else {
				this.selList.push(item.id);
				item.checked = true;
			}
			// console.log('selList',this.selList)
		}
	},
	computed: {
		selNum() {
			return this.selList.length
		}
	},
	watch: {
		"selNum": {
			handler: function(val, oldval) {
				if (val) {
					if (this.taskList.length == this.selList.length) {
						this.isCheckAll = true;
					} else {
						this.isCheckAll = false;
					}
				}
			}
		}
	}
	// ## 方法
};
