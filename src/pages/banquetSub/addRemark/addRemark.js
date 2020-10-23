import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
import storage from '@/common/unistorage/index.js';

export default {
	async onNavigationBarButtonTap(val) {
		if (this.type == '1') {
			let data = {
				id: this.id,
				modifiedName: storage.getAppUserInfo().userName, //跟新操作人
				banquetOrderRemark: this.taskRemark
			};
			let res=await YHBanquetOrder.UpdateByDto(data);
				uni.navigateBack({
					delta: 1
				})
			
		} else if (this.type == '2') {
			let data = {
				id: this.id,
				modifiedName: storage.getAppUserInfo().userName, //跟新操作人
				banquetTaskRemark: this.taskRemark
			}
			let res=await YHBanquetTask.UpdateByDto(data);
				storage.setIsRefresh(true);
				uni.navigateBack({
					delta: 1
				})
			
		}

	},
	data() {
		return {
			type: 0, //宴会详情  
			taskRemark: '', //备注
			id: '',
		}
	},
	onLoad(option) {
		//去除为null/undefined
		option=this.$util.null2str(option);
		// console.log(option)
		//判断是宴会详情还是任务详情
		this.type = option.type;
		if (option.type == '1') { //宴会详情
			this.id = option.banquetId;
			this.taskRemark = option.banquetOrderRemark;
		} else if (option.type == '2') { //任务详情
			this.id = option.id;
			this.taskRemark = option.banquetTaskRemark;
		}

	},

}
