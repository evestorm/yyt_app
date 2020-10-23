// 作者:杨亮

//------------------------------mock数据引入---------------------------
import labelManagementMock from './labelManagement_mock.js';

//------------------------------组件引入-------------------------------

//-------------------------Service引入----------------------------------
import CY59 from '@/service/CY/CY59AppService.js';

import {
	mapState,
	mapMutations
} from 'vuex';

export default {
    // 组件放在data前面
    components: {
        
    },
    data() {
        return {
			picDomain: getApp().globalData.PicDomain,
			labelGroups: [], // 标签组
			selectedLabel: null, // 当前选中的label对象
        };
    },
	created() {
		uni.$on('labelManagementRefresh', () => this.requestData());
		this.requestData();
	},
    methods: {
		...mapMutations(['setSidebarFilter', 'setCurrentTagsObj', 'setCurrentReserveTagsObj', 'setCurrentFollowTagsObj']),
		// 请求标签组
		async requestData() {
			// this.labelGroups = labelManagementMock.labelGroups;
			const data = {
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				isShowPhone:1
			};
			const result = await CY59.GetTagDetails(data);
			if (result && result.tagDetails) {
				this.labelGroups = result.tagDetails;
			}
		},
		// 显示刷新提示窗
		showRefreshWindow(item) {
			this.$refs.refreshPopup.open();
			this.selectedLabel = item;
		},
		// 隐藏刷新提醒窗
		cancelRefreshPopupWindow() {
			this.$refs.refreshPopup.close();
			this.selectedLabel = null;
		},
		// 确认刷新当前标签
		async confirmRefreshLabel() {
			console.log('当前选中label:', JSON.stringify(this.selectedLabel));
			const companyCustomerLabelID = this.selectedLabel.companyCustomerLabelID
			const result = await CY59.RefreshTagOfCsts({
				companyCustomerLabelID,
				marketerId: this.$storage.getAppUserInfo().marketerId,
			})
			if (result) {
				uni.showToast({
					title: '刷新成功！'
				})
				// this.labelGroups.forEach(group => {
				// 	// 本地删除刚刚刷新成功的标签对象
				// 	group.data = group.data.filter(v => v.companyCustomerLabelID !== result.id)
				// })
				this.requestData();
			}
			this.$refs.refreshPopup.close();
		},
		// 显示删除提醒窗
		showDelWindow(selectedLabel) {
			this.$refs.delPopup.open();
			this.selectedLabel = selectedLabel;
		},
		// 隐藏删除提醒窗
		cancelDelPopupWindow() {
			this.$refs.delPopup.close();
			this.selectedLabel = null;
		},
		// 确认删除当前标签
		async confirmDelLabel() {
			console.log('当前选中label:', JSON.stringify(this.selectedLabel));
			const id = this.selectedLabel.companyCustomerLabelID
			const result = await CY59.Delete({
				id
			})
			if (result && result.success) {
				uni.showToast({
					title: '删除成功！'
				})
				this.labelGroups.forEach(group => {
					// 本地删除刚刚删除成功的标签对象
					group.data = group.data.filter(v => v.companyCustomerLabelID !== id)
				})
			}
			this.$refs.delPopup.close();
		},
        // 测试ajax发送
        async testAjax() {
            const data = {
                pageIndex: 1,
                pageSize: 10,
                order: 'StoreID desc'
            };

            let result = await CY17AppService.GetViewPage(data);
        },
		// 去客户列表
		gotoCustomerList(labelObj) {
			// labelObj格式:
			// {
			// 	companyCustomerLabelID: "CY592297500000510"
			// 	isShowRefresh: 1,
			// 	label: "test",
			// 	sort: "",
			// 	userCount: 7
			// }
			// 获取本地已有的标签列表
			// currentTagList格式：[{customerLabelID: "CY595646200000533",label: "单餐桌数大于5"},{customerLabelID: "CY598580100000655",label: "宴会超10桌"}]
			
			// 清空vuex中的所有标签
			this.setCurrentTagsObj({
				content: '',
				ids: ''
			});
			
			// 清空storeage中所有标签
			this.$storage.setCurrentTagList([]);
			
			// 再把当前选中的添加到storage和vuex
			let newTagList = [{
				customerLabelID: labelObj.companyCustomerLabelID,
				label: labelObj.label
			}]
			this.$storage.setCurrentTagList(newTagList);
			
			const tagsObj = this.currentTagsObj;
			let content = '',
				ids = '';
			let existTag = newTagList;
			existTag.forEach((v, index) => {
				content += v.label + (index === existTag.length - 1 ? '' : ', ');
				ids += v.customerLabelID + (index === existTag.length - 1 ? '' : ',');
			});
			tagsObj.content = content;
			tagsObj.ids = ids;
			
			this.setCurrentTagsObj(tagsObj);
			
			uni.$emit('selectTagFromLabelManagement');
			
			// 暂不考虑用户没有查看客户列表权限时的跳转处理（by 大明）
			this.$cw.setSwitchTo({
				url: '/pages/customer/customer',
				payload: {
					tabIndex: 0,
				}
			});
		}
    },
    computed: {
    	...mapState(['sidebarFilter', 'currentTagsObj', 'currentReserveTagsObj', 'currentFollowTagsObj']),
    },
    filters: {
        // parseScene(value) {
        // return value+'123';
        // }
    },
    watch: {
        // "currentStore.storeId": {
        //    handler(val, oldval) {
        //        if (val) {

        //        }
        //    }
        // }
    }
};
