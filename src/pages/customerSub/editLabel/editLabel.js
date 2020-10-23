// 作者:杨亮

//------------------------------mock数据引入---------------------------
import editLabelMock from './editLabel_mock.js';

//------------------------------组件引入-------------------------------


//-------------------------Service引入----------------------------------
import CY59 from '@/service/CY/CY59AppService.js';

const app = getApp();

export default {
	// 组件放在data前面
	components: {

	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// --------------------------------------页面参数---------------------------
			urlOption: {}, // url参数
			labelAttr: {
				label: '', // 标签名称
				isAutoRefresh: 0, // 是否自动刷新标签用户
				editJsonString: '[]', // 条件json字符串
			}, // 标签属性
			isEdit: false, // 新增 or 编辑
			
		};
	},
	onShow() {
		this.labelAttr.editJsonString = getApp().globalData.editConditionsPageData.editJsonString;
	},
	// 页面加载事件
	async onLoad(options) {
		this.urlOption = options;
		this.isEdit = !!options.id;
		uni.setNavigationBarTitle({
			title: this.isEdit ? '编辑标签' : '新增标签'
		});
		if (this.isEdit) this.requestData();
	},
	methods: {
		// 清空临时条件json
		clearConditionsJSON() {
			getApp().globalData.editConditionsPageData.editJsonString = '';
		},
		// 导航栏返回
		tapLeftFromNav() {
			uni.navigateBack({
				delta: 1
			});
			this.clearConditionsJSON();
		},
		// 导航栏保存
		async tapRightFromNav() {
			if (!this.labelAttr.label) {
				this.$cw.showError('请填写标签名称');
				return;
			}
			let result;
			if (this.isEdit) { // 更新
				result = await CY59.UpdateByDto({
					id: this.labelAttr.companyCustomerLabelID, // id
					label: this.labelAttr.label, // 条件名称
					editJsonString: getApp().globalData.editConditionsPageData.editJsonString, // 条件json
					isAutoRefresh: this.labelAttr.isAutoRefresh, // 是否刷新
				});
			} else { // 新增
				result = await CY59.CreateByDto({
					tagTypes: this.urlOption.tagTypesID, // 标签类别ID
					label: this.labelAttr.label,
					editJsonString: getApp().globalData.editConditionsPageData.editJsonString, // 条件json
					isAutoRefresh: this.labelAttr.isAutoRefresh, // 是否刷新
					cwCompanyId: this.$storage.getAppUserInfo().cwCompanyID,
					storeId: this.$storage.getAppUserInfo().currentStoreId,
				});
			}
			if (result) {
				uni.showToast({
					title: this.isEdit ? '更新成功！' : '添加成功！',
				});
				this.clearConditionsJSON();
				uni.$emit('labelManagementRefresh');
				uni.navigateBack({
					delta: 1
				});
			}
		},
		// 切换自动刷新
		toggleRefresh(e) {
			this.labelAttr.isAutoRefresh = e.detail.value ? 1 : 0;
		},
		// 请求标签详情
		async requestData() {
			const result = await CY59.GetViewDto({
				id: this.urlOption.id
			});
			// const result = editLabelMock.result;
			if (result) {
				this.labelAttr = result;
				getApp().globalData.editConditionsPageData.editJsonString = result.editJsonString;
			}
		},
		// 去编辑条件
		toEditConditions() {
			getApp().globalData.editConditionsPageData.editJsonString = this.labelAttr.editJsonString;
			uni.navigateTo({
				url: `/pages/customerSub/editConditions/editConditions`
			})
		},
	},
	computed: {
		// 满足条件
		conditionsArr() {
			// let conditions = JSON.parse(this.labelAttr.editJsonString || '[]');
			// 循环所需满足的条件数组
			// conditions.forEach(v => {
			// 	let tempCondition = v.condition;
			// 	// 循环每个条件需要替换的占位符数组对象
			// 	v.fields.forEach(n => {
			// 		v.selfConditionName = tempCondition = tempCondition.replace(n.fieldKey, n.fieldValue);
			// 	});
			// })
			// return conditions;
			return JSON.parse(this.labelAttr.editJsonString || '[]');
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		"labelAttr.name": {
		   handler(val, oldval) {
		       console.log(val);
		   }
		}
	}
};
