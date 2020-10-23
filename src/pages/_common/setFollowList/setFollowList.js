import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import CY78 from '@/service/CY/CY78AppService.js';
import storage from '@/common/unistorage/index.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			num: '-1',
			assignFollowInfo: [], //指定跟踪条件信息
			assignFollowNum: '', // 对应条件客户的人数
			followListForm: {
				cWCompanyId: storage.getAppUserInfo() ? storage.getAppUserInfo().cwCompanyID : '',
				storeId: storage.getAppUserInfo() ? storage.getAppUserInfo().currentStoreId : '',
				dynamicConditionConfigID: "",
				weight: 0,
				remark: ""
			}
		};
	},
	components: {
		uniNumberBox,
	},
	onLoad() {
		this.getAssignFollowInfo();
	},
	methods: {
		// 返回上一页
		onBack() {
			uni.navigateBack({
					delta:1
				});
		},
		// 改变权重
		changeWeight(value) {
			// console.log(value)
			this.followListForm.weight = value;
		},
		// 获取指定跟踪条件信息
		async getAssignFollowInfo() {
			var self = this;
			const data = {
				storeId: storage.getAppUserInfo().currentStoreId
			}
			let result=await CY78.GetFollowCondtion(data);
				self.assignFollowInfo = result.dtos;
			
		},
		// 根据指定跟踪条件获取对应条件客户的人数
		async getAssignFollowNum(id) {
			var self = this;
			const data = {
				dynamicConditionConfigID: id
			};
			let result=await CY78.GetCondtionCstCount(data);
				self.assignFollowNum = result.cstCount;
			
		},
		//创建任务跟踪清单
		async createFollowList() {
			var self = this;
			var data = self.followListForm;
			if (!data.dynamicConditionConfigID) {
				uni.showToast({
					title: '请选择跟踪清单指定条件!',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!data.remark) {
				uni.showToast({
					title: '请填写跟踪清单描述!',
					icon: 'none',
					duration: 2000
				})
				return;
			}

			let result=await CY78.CreateFollowOrders(data);
				if (getCurrentPages().length === 1) {
					uni.navigateBack({
						delta:1
					});
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			
		},
		// 选择跟踪条件
		selectedAssign(item, index) {
			this.num = index;
			this.followListForm.dynamicConditionConfigID = item.dynamicConditionConfigID;
			this.getAssignFollowNum(this.followListForm.dynamicConditionConfigID)
		}
	}
}
