import CY18AppService from '@/service/CY/CY18AppService.js';
import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';
import storage from '@/common/unistorage/index.js';
export default {
	async onNavigationBarButtonTap(val) {
		// console.log('发送保存任务请求',this.executorIds)
		let data={
			id:this.id,
			modifiedName:storage.getAppUserInfo().userName,//跟新操作人
			executorIds:this.executorIds
		}
		let res=await YHBanquetTask.UpdateByDto(data);
			// console.log(res)
			if(res.length!=0){
				storage.setIsRefresh(true);
				// console.log(storage.getIsRefresh());
				uni.navigateBack({
					delta:1
				})
			}
			
		
	},
	data() {
		return {
			storeId:storage.getAppUserInfo().currentStoreId,//门店id
			id:'',//主键id
			isCheckAll:false,//是否全选
			executorIds:[],//选中的执行人id  
			executorList:[],//执行人列表
		};
	},
	// 页面加载事件
	async onLoad(option) {
		console.log(option)
		this.id=option.id;
		let executorIdList=[];//接收的执行人id数组
		if(option.banquetTaskExecutorIds=='null'){
			executorIdList=[];
		}else{
			executorIdList=option.banquetTaskExecutorIds.split(',');
		}
		// console.log(this.executorIds)
		let data={
				"pageIndex": 1,
				"pageSize": 999999,
				"order": "createTime desc ",
				"select": "new(marketerID, marketerName)",
				"filter": {
					"type":"and",
					"conditions": [
						{
							"attribute": "storeId",
							"datatype": "nvarchar",
							"operatoer": "eq",
							"value": this.storeId
						}
					]
				}

			}
		let res=await CY18AppService.GetViewPageSelect(data);
			// console.log(res)
			this.executorList=res.dataList;
			this._(this.executorList).forEach(item=>{
				let findIndex = this._(executorIdList).findIndex(x => x == item.marketerID);
				if(findIndex!=-1){
					item.checked=true;
					this.executorIds.push(item.marketerID)
				}
			})
			// console.log('onLoad',this.executorIds)
		
	},
	methods: {
		checkboxChange(item){//点击复选框
			// this.executorIds=e.detail.value;
			// console.log('点击付uankuang',item)
			let index = this._(this.executorIds).findIndex(
				x => x == item.marketerID
			);
			if (index != -1) {
				this.executorIds.splice(index, 1);
				item.checked = false;
			} else {
				this.executorIds.push(item.marketerID);
				item.checked = true;
			}
			// console.log('选中ids',this.executorIds)
		},
		checkAll(){//全选
			this.isCheckAll=this.isCheckAll==true?false:true;
			this._(this.executorList).forEach(item=>{
				if(this.isCheckAll){
					item.checked=true;
					this.executorIds.push(item.marketerID);
				}else{
					item.checked=false;
					this.executorIds=[];
				}
			})
			//去重
			this.executorIds = this._.uniqBy(this.executorIds);
			// console.log(this.executorIds)
			
		}
	}
};
