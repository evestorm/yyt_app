import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';//
const app = getApp();
import storage from '@/common/unistorage/index.js';
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			taskId:'',
			ralationTaskText:'',//关联日期
			tipList:[],//页面实现提示
			coordinatorId:'',//统筹人id
			marketerId:'',//客户经理id
		};
	},
	// 页面加载事件
	onLoad(option) {
		// console.log('任务提示option',option);
		this.tipList=option;
		this.ralationTaskText=option.ralationTaskText;
		if(option.marketerId){
			this.marketerId=option.marketerId;
		}
		if(option.coordinatorId){
			this.coordinatorId=option.coordinatorId;
		}
		// this.isUploadFile= option.isUploadFile; // 是否需要上传文件
		// this.isUploadImg= option.isUploadImg; // 是否需要上传图片
		// this.isRemark= option.isRemark; // 是否备注
		// this.isRelatedDate=option.isRelatedDate; // 是否关联日期
		// this.isCstSign=option.isCstSign; // 是否客户签字
	
	},
	methods: {
		async goOn(){//完成任务
			let updateData = {
				id: this.tipList.taskId,
				isExecuted:1,
				modifiedName:storage.getAppUserInfo().userName,//跟新操作人
				factExecutorID: storage.getAppUserInfo().marketerId,
			};
			let resp=await YHBanquetTask.UpdateByDto(updateData);
				storage.setIsRefresh(true);//返回刷新页面
				uni.navigateBack({
					delta:1
				})
			
		},
		goBack(){
			// console.log(this.coordinatorId)
			if(this.coordinatorId!=''){
				uni.redirectTo({
					url:`/pages/banquetSub/taskDetail/taskDetail?id=${this.tipList.taskId}&coordinatorId=${this.coordinatorId}&marketerId=${this.marketerId}`
				})
			}else{
				uni.navigateBack({
					delta:1
				})
			}
			
			
		},
	},
	filters: {
		//parseScene: function (value) {
		// return value+'123';
		//}
	},
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
