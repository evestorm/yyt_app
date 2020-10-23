import uniPopup from "@/components/uni-popup/uni-popup.vue"
import CY19 from '@/service/CY/CY19AppService.js';
import CY59 from '@/service/CY/CY59AppService.js';
import CY60 from '@/service/CY/CY60AppService.js';
import {
	mapState,
	mapMutations
} from 'vuex';
const app = getApp();
export default {
	onNavigationBarButtonTap() {
		this.saveTag();
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			customerId: '', // 当前用户id
			CustomDetailOutData: {}, // 用户信息集合

			existTag: [], // 已存在标签集合
			allTag: [], // 所有标签集合
			lableModal: false, // 标签弹框
			modalTitle: '', // 标签弹框名称
			lableTitle: '', // 弹窗中输入的标签名称
			lableStyleInfo: {}, // 选中的标签类型


			// 是否从【编辑客户】页面过来（是则展示顶部客户与经理的关联，且底部保存按钮保存的标签与该客户关联）
			fromCustomDetail: false,
			// 是否从【客户列表侧边栏筛选】页面过来（是则隐藏顶部客户关联展示，且隐藏增加标签功能，底部保存与客户无关）
			fromCustomerSidebar: false,
			// 是否从【预订台】列表模式侧边栏过来
			fromReserveSidebar: false,
			// 是否从【客户跟踪侧边栏筛选】列表过来
			fromFollowSidebar: false,
			// 是否从【客户跟踪】页面进行批量打标签过来（是则接受客户id列表，并在保存时批量更改客户标签）
			fromFollowList: false,
			followList: '', // 客户跟踪列表批量打标签传过来的ids
			unFollowList: '', // 客户跟踪列表批量打标签传过来的不需要的ids
			cstDataGUID2: '', // 客户跟踪批量打标签如果全选，会带上cstDataGUID2
			// 是否从【客户列表】页面进行批量打标签过来（是则接受客户id列表，并在保存时批量更改客户标签）
			fromCustomList: false,
			customerList: '', // 客户列表批量打标签传过来的ids
			unCustomerList: '', // 客户列表批量打标签传过来的不需要的ids
			cstDataGUID: '', // 客户列表批量打标签如果全选，会带上cstDataGUID
			// 是否从【发短信->添加收件人侧边栏筛选】列表过来
			fromAddReceiveSidebar: false, // 添加收件人列表过来
			// 默认从【新增客户】的编辑页来
			isEdit: false, // 目前只有新增客户来,才会是edit为true的状态
		};
	},
	computed: {
		...mapState(['sidebarFilter', 'currentTagsObj', 'currentReserveTagsObj', 'currentFollowTagsObj', 'currentAddReceiveTagsObj']),
	},
	components: {
		uniPopup
	},
	onLoad(payload) {
		const that = this;
		console.log({
			'编辑标签页payload': payload
		});
		// 测试用
		// payload.customerId = 'CUS17128885400016538';
		// payload.sidebar = '1';
		// payload.customerList = 'CUS17128885400016538,CY19SGH20793';

		// 根据是否传递 customerId 判断从客户详情页【customInfo】或编辑客户详情页【addCustomerInfo】过来
		this.customerId = payload.customerId;
		this.fromCustomDetail = payload.customerId != null;
		// 根据是否传递 sidebar = customerList 判断从客户列表侧边栏筛选过来
		this.fromCustomerSidebar = payload.sidebar == 'customerList';
		// 根据是否传递 sidebar = reserveList 判断从预订列表页侧边栏筛选过来
		this.fromReserveSidebar = payload.sidebar == 'reserveList';
		// 根据是否传递 sidebar = followList 判断从客户跟踪列表页侧边栏筛选过来
		this.fromFollowSidebar = payload.sidebar == 'followList';
		// 根据是否传递 sidebar = addRecive 判断从添加收件人页侧边栏筛选过来
		this.fromAddReceiveSidebar = payload.sidebar == 'addReceive';

		// 根据是否传递 followList 判断从客户跟踪列表批量操作客户过来
		this.fromFollowList = payload.followList != null;
		this.followList = payload.followList;
		this.unFollowList = payload.unFollowList;
		this.cstDataGUID2 = payload.cstDataGUID2;

		// 根据是否传递 customerList 判断从客户列表批量操作客户过来
		this.fromCustomList = payload.customerList != null;
		this.customerList = payload.customerList;
		this.unCustomerList = payload.unCustomerList;
		this.cstDataGUID = payload.cstDataGUID;

		if (this.fromCustomerSidebar || this.fromReserveSidebar || this.fromFollowSidebar || this.fromAddReceiveSidebar) { // 所有侧边栏
			uni.setNavigationBarTitle({
				title: '选择标签'
			});
			this.isEdit = false;
		} else { // 编辑客户，首页批量换标签，新增客户
			uni.setNavigationBarTitle({
				title: '编辑客户标签'
			});
			this.isEdit = true;
		}

		if (this.fromCustomDetail) { // 从编辑客户详情过来需请求客户信息
			this.getCustomDetailById();
		}

		// 获取所有标签后根据已有标签高亮展示
		that.getAllTag(function() {
			that.getExistTag();
		});
	},
	methods: {
		...mapMutations(['setSidebarFilter', 'setCurrentTagsObj', 'setCurrentReserveTagsObj', 'setCurrentFollowTagsObj', 'setCurrentAddReceiveTagsObj']),
		// 获取客户详情
		async getCustomDetailById() {
			const that = this;
			const data = {
				storeID: that.$storage.getAppUserInfo().currentStoreId,
				customerID: that.customerId,
				cWCompanyId: that.$storage.getAppUserInfo().cwCompanyID,
				isInPhone: 1
			}
			let result = await CY19.GetCustomerDetail(data);
			// console.log(result);
			that.CustomDetailOutData = result;
			that.CustomDetailOutData.marketer =
				that.CustomDetailOutData.marketer ?
				that.CustomDetailOutData.marketer :
				that.$storage.getAppUserInfo().userName;

		},
		// 获取全部的标签
		async getAllTag(success) {
			const that = this;
			const data = {
				storeId: that.$storage.getAppUserInfo().currentStoreId,
				isShowPhone: 1,
			};
			let result = await CY59.GetTagDetails(data);
			that.allTag = result.tagDetails;
			success && success();
		},
		// 获取已存在的标签
		async getExistTag() {
			const that = this;

			if (that.fromCustomDetail) {
				// 从编辑客户详情过来的，查询当前客户的客户标签
				const data = {
					customerId: that.customerId,
					storeID: that.$storage.getAppUserInfo().currentStoreId,
					isInPhone: 1
				};
				let result = await CY60.GetCustomerLable(data);
				that.existTag = result.lableLists;
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});


			} else if (that.fromCustomerSidebar) {
				// 从客户列表侧边栏页面过来，需到vuex中取已选中的标签；
				let currentTagList = that.$storage.getCurrentTagList();

				// console.log(currentTagList);
				if (currentTagList !== null) {
					this.existTag = currentTagList;
				}
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});

			} else if (that.fromReserveSidebar) {
				// 从预订列表侧边栏页面过来，需到vuex中取已选中的标签；
				let currentReserveTagList = that.$storage.getCurrentReserveTagList();
				// console.log(currentReserveTagList);
				if (currentReserveTagList !== null) {
					this.existTag = currentReserveTagList;
				}
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});
			} else if (that.fromFollowSidebar) {
				// 从客户跟踪列表侧边栏页面过来，需到vuex中取已选中的标签；
				let currentFollowTagList = that.$storage.getCurrentFollowTagList();
				// console.log(currentFollowTagList);
				if (currentFollowTagList !== null) {
					this.existTag = currentFollowTagList;
				}
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});
			} else if (that.fromAddReceiveSidebar) {
				// 从添加收件人列表侧边栏页面过来，需到vuex中取已选中的标签；
				let currentAddReceiveTagList = that.$storage.getCurrentReceiveTagList();
				if (currentAddReceiveTagList !== null) {
					this.existTag = currentAddReceiveTagList;
				}
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});
			} else { // 从新增客户或者批量操作过来（批量操作不保存之前选中状态的原因是，手机端只能给用户添加标签，无法删除已添加的标签）
				// 不是批量操作就是默认的新增用户，需到localstorage中取已选中的标签；
				const that = this;
				if (this.fromCustomList || this.fromFollowList) return;

				let addCustomerTagList = that.$storage.getAddCustomerTagList();
				// console.log({
				// 	addCustomerTagList: addCustomerTagList
				// });
				if (addCustomerTagList !== null) {
					this.existTag = addCustomerTagList;
				}
				that.allTag.forEach(function(obj) {
					obj.data.forEach(function(item) {
						item.selected = that.existTag.some(function(innerItem) {
							return innerItem.customerLabelID == item.companyCustomerLabelID
						})
					})
				});
				// 去除当前临时存储的添加客户所选中的标签的操作，放到addCustomer页面中保存客户成功后去做
			}
		},
		// 选中标签
		selectTag: function(item, array) {
			item.selected = !item.selected;
			if (item.selected) {
				array.push({
					customerLabelID: item.companyCustomerLabelID,
					label: item.label
				});
			} else {
				var index = this._.findIndex(array, function(arrayItem) {
					return arrayItem.customerLabelID == item.companyCustomerLabelID
				});
				array.splice(index, 1);
			}
		},
		// 打开添加标签弹框
		addTag: function(item) {
			const that = this;
			const title = '添加' + item.tagTypeName;
			that.lableTitle = '';
			that.lableStyleInfo = item;
			that.modalTitle = title;
			// that.lableModal = true;
			this.$refs.cancelPopup.open();
		},
		// 保存标签弹框
		saveLabel: function() {
			const that = this;
			const label = that.lableTitle;
			if (!label) {
				that.$cw.showError('标签描述为空！');
				// that.lableModal = false;
				this.$refs.cancelPopup.close();
				return;
			} else {
				if (label.length > 10) {
					that.$cw.showError('标签字数超出限制！');
					// that.lableModal = false;
					this.$refs.cancelPopup.close();
					return;
				}

			}
			// that.lableModal = false;
			this.$refs.cancelPopup.close();
			that.addTagData(that.lableStyleInfo.tagTypesID, label);
		},

		//取消标签弹框
		cancelLabel: function() {
			// this.lableModal = false;
			this.$refs.cancelPopup.close();
			// console.log('关闭了弹窗');
		},
		//添加标签
		async addTagData(tagTypesID, label) {
			const that = this;
			const data = {
				cWCompanyId: that.$storage.getAppUserInfo().cwCompanyID,
				label: label,
				sort: 1,
				storeId: that.$storage.getAppUserInfo().currentStoreId,
				tagTypes: tagTypesID
			};
			let result = await CY59.CreateByDto(data);
			that.getAllTag(function() {
				that.getExistTag();
			});

		},
		// 删除已选中的标签
		delSelectTag: function(item, index, array) {
			this.existTag.splice(index, 1);
			array.forEach(function(obj) {
				obj.data.forEach(function(innerItem) {
					if (innerItem.companyCustomerLabelID == item.customerLabelID) {
						innerItem.selected = false;
					}
				})
			})
		},
		// 清空标签
		clearTag: function() {
			this.existTag = [];
			this.allTag.forEach(function(obj) {
				obj.data.forEach(function(item) {
					if (item.selected) {
						item.selected = false
					}
				})
			})

		},
		// 取消标签
		cancelTag: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 保存标签
		saveTag: function() {
			const that = this;
			let arrayOne = [];
			let arrayTwo = [];
			arrayOne[0] = that.customerId;
			arrayTwo = this.existTag.map(function(item) {
				return item.customerLabelID
			})

			if (this.fromCustomDetail) { // 从客户详情过来，绑定当前标签给当前客户
				var data = {
					storeID: that.$storage.getAppUserInfo().currentStoreId,
					cWCompanyId: that.$storage.getAppUserInfo().cwCompanyID,
					customerId: that.customerId,
					customerLabelId: arrayTwo,
					marketerId: that.$storage.getAppUserInfo().marketerId,
					weight: 1,
					isClean: 1,
					isInPhone: 1,
				};
				CY60.CustomerMakeTag(data, result => {
					console.log('editCustomerLabel保存了')
					// 保存成功后，把当前existTag中的值，重新包装后返回给 customInfo 客户详情页，局部刷新页面数据
					uni.$emit('sw-customer-detail-label', {
						newLabelArr: this.existTag.map(v => {
							return {
								name: v.label,
								value: v.customerLabelID
							}
						}),
					});

					uni.navigateBack({
						delta: 1
					});
				});
			} else if (this.fromCustomerSidebar) { // 从客户列表侧边栏，更新vuex状态，且保存选中标签们到本地
				// 更新vuex中侧边栏请求中的参数tags
				const filter = that.sidebarFilter;
				filter.tags = that.existTag.map(v => {
					return v.customerLabelID
				}).toString();
				that.setSidebarFilter(filter);
				console.log("vuex中侧边栏filter", that.sidebarFilter);

				// 更新vuex中侧边栏的标签文字展示
				const tagsObj = that.currentTagsObj;
				let content = '',
					ids = '';
				let existTag = this.existTag;
				existTag.forEach((v, index) => {
					content += v.label + (index === this.existTag.length - 1 ? '' : ', ');
					ids += v.customerLabelID + (index === this.existTag.length - 1 ? '' : ',');
				});
				tagsObj.content = content;
				tagsObj.ids = ids;
				
				that.setCurrentTagsObj(tagsObj);
				console.log("vuex中客户列表侧边栏标签选择", that.currentTagsObj);


				// 保存当前已选中标签到本地
				this.$storage.setCurrentTagList(this.existTag);

				uni.navigateBack({
					delta: 1
				});
			} else if (this.fromReserveSidebar) { // 从预订列表侧边栏，更新vuex状态，且保存选中标签们到本地					
				// 更新vuex中侧边栏的标签文字展示
				const tagsObj = that.currentReserveTagsObj;
				let content = '',
					ids = '';
				let existTag = this.existTag;
				existTag.forEach((v, index) => {
					content += v.label + (index === this.existTag.length - 1 ? '' : ', ');
					ids += v.customerLabelID + (index === this.existTag.length - 1 ? '' : ',');
				});
				tagsObj.content = content;
				tagsObj.ids = ids;
				that.setCurrentReserveTagsObj(tagsObj);
				console.log("vuex中预订台列表侧边栏标签选择", that.currentReserveTagsObj);


				// 保存当前已选中标签到本地
				this.$storage.setCurrentReserveTagList(this.existTag);

				uni.navigateBack({
					delta: 1
				});
			} else if (this.fromFollowSidebar) { // 从客户跟踪列表侧边栏，更新vuex状态，且保存选中标签们到本地
				// 更新vuex中侧边栏的标签文字展示
				const tagsObj = that.currentFollowTagsObj;
				let content = '',
					ids = '';
				let existTag = this.existTag;
				existTag.forEach((v, index) => {
					content += v.label + (index === this.existTag.length - 1 ? '' : ', ');
					ids += v.customerLabelID + (index === this.existTag.length - 1 ? '' : ',');
				});
				tagsObj.content = content;
				tagsObj.ids = ids;
				that.setCurrentFollowTagsObj(tagsObj);
				console.log("vuex中客户跟踪侧边栏标签选择", that.currentFollowTagsObj);


				// 保存当前已选中标签到本地
				this.$storage.setCurrentFollowTagList(this.existTag);

				uni.navigateBack({
					delta: 1
				});
			} else if (this.fromAddReceiveSidebar) { // 从添加收件人列表侧边栏，更新vuex状态，且保存选中标签们到本地
				// 更新vuex中侧边栏的标签文字展示
				const tagsObj = that.currentAddReceiveTagsObj;
				let content = '',
					ids = '';
				let existTag = this.existTag;
				existTag.forEach((v, index) => {
					content += v.label + (index === this.existTag.length - 1 ? '' : ', ');
					ids += v.customerLabelID + (index === this.existTag.length - 1 ? '' : ',');
				});
				tagsObj.content = content;
				tagsObj.ids = ids;
				that.setCurrentAddReceiveTagsObj(tagsObj);
				console.log("vuex中添加收件人侧边栏标签选择", that.currentAddReceiveTagsObj);
				// debugger

				// 保存当前已选中标签到本地
				this.$storage.setCurrentReceiveTagList(this.existTag);

				uni.navigateBack({
					delta: 1
				});
			} else if (this.fromCustomList) { // 客户列表批量更新过来
				var data = {
					cWCompanyId: that.$storage.getAppUserInfo().cwCompanyID,
					storeId: that.$storage.getAppUserInfo().currentStoreId,
					customerIdList: that.customerList.split(','),
					excludeCstIDList: that.unCustomerList.split(','),
					customerLabelIdList: that.existTag.map(v => {
						return v.customerLabelID
					}),
					marketerId: that.$storage.getAppUserInfo().marketerId,
					weight: 1,
					isClear: 1, // 目前只能添加，不能删除标签
					// isInPhone: 1, // 不用传
					cstDataGUID: this.cstDataGUID ? this.cstDataGUID : ''
				};
				// console.log(data);

				CY60.LabelingForCustomers(data, result => {
					// 通知客户列表页刷新页面
					uni.$emit('addLabelForCustomListBatch');
					// console.log(result);
					uni.navigateBack({
						delta: 1
					});
				});
			} else if (this.fromFollowList) { // 客户跟踪列表批量更新过来
				var data = {
					cWCompanyId: that.$storage.getAppUserInfo().cwCompanyID,
					storeId: that.$storage.getAppUserInfo().currentStoreId,
					customerIdList: that.followList.split(','),
					excludeCstIDList: that.unFollowList.split(','),
					customerLabelIdList: that.existTag.map(v => {
						return v.customerLabelID
					}),
					marketerId: that.$storage.getAppUserInfo().marketerId,
					weight: 1,
					isClear: 1, // 目前只能添加，不能删除标签
					// isInPhone: 1, // 不用传
					cstDataGUID: this.cstDataGUID2 ? this.cstDataGUID2 : ''
				};
				// console.log(data);

				CY60.LabelingForCustomers(data, result => {
					// 通知客户列表页刷新页面
					uni.$emit('addLabelForFollowListBatch');
					// console.log(result);
					uni.navigateBack({
						delta: 1
					});
				});
			} else { // 新增客户进来
				const selectTags = that.existTag.map(v => {
					return {
						name: v.label,
						value: v.customerLabelID
					}
				})
				uni.$emit('sw-add-customer-label', {
					newLabelArr: selectTags,
				});
				// 缓存标签
				this.$storage.setAddCustomerTagList(that.existTag);
				// console.log(selectTags);
				uni.navigateBack({
					delta: 1
				})
			}

		},
		// 获得等级图像
		getLeveImg: function(item) {
			if (item.customerLevelImgUrl) {
				return this.$cw.ImgServerUrl + item.customerLevelImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/al.png"
			}
		},
		// 获取客户经理图像
		getSalesImg: function(item) {
			if (item.marketerImgUrl) {
				return item.marketerImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png"
			}
		},
		// 获得客户图像
		getCustomerImg: function(item) {
			if (item.headImg) {
				return item.headImg;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png"
			}
		},
	}
}
