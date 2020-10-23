import cw from '@/common/ceiwei/common.js';
import CY18 from '@/service/CY/CY18AppService.js';
import CY19 from '@/service/CY/CY19AppService.js';
import CY22 from '@/service/CY/CY22AppService.js';
import CY24 from '@/service/CY/CY24AppService.js';
import CY59 from '@/service/CY/CY59AppService.js';
import storage from '@/common/unistorage/index.js';
import util from '@/common/util.js';
var graceChecker = require("@/common/ceiwei/graceChecker.js");
const app = getApp();
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			navBarTitle: '新增客户',
			index: 0,
			modalName: null,
			customFormData: {
				name: "", // 优先通讯录名称，再才是customerName
				msgName: "",
				phone: "",
				birthday: "",
				company: "",
				sex: "男", // (男，女)
				isArrange: "",
				levelID: null,
				marketerID: storage.getAppUserInfo() ? storage.getAppUserInfo().marketerId : '',
				marketer: storage.getAppUserInfo() ? storage.getAppUserInfo().userName : '',
				cwCompanyID: storage.getAppUserInfo() ? storage.getAppUserInfo().cwCompanyID : '',
				followType: null,
				customerTags: [], // 已选标签器为数组
			},
			customerLabelQuery: {
				PageIndex: 1,
				PageSize: 10000,
				Order: "Sort desc",
				Filter: {
					Type: "and",
					Conditions: [{
						Attribute: "CWCompanyId",
						Datatype: "nvarchar",
						Operatoer: "eq",
						Value: storage.getAppUserInfo() ? storage.getAppUserInfo().cwCompanyID : ''
					}]
				}
			},
			selectTags: [], // 已选标签数组
			CustomerLabelDatas: [], // 客户标签
			// 销售经理
			salesQuery: {
				pageIndex: 1,
				pageSize: 99999,
				order: "MarketerID desc",
				select: "new(MarketerID,MarketerName)",
			},
			// sales:[],// 销售经理数组
			CustomerLevelQueryData: [], // 客户等级查询到的数据
			copyCustomFormData: {}, // 对上面客户信息 customFormData 的拷贝
			companyNameText: '', //搜索单位
			companys: [], // 单位列表
			isCompanysShow: false, //是否显示单位列表
			customerId: '-1',
			options: {},
			isSelectedCompanyList: false, // 是否是选中搜索出来的单位更改的单位
		};
	},
	computed: {
		sales() {
			// { 示例
			// 	salseImg: "https://pic.cwyyt.cn//upload/img/20190704/1521362136_003.jpg"
			// 	text: "01"
			// 	value: "SL9449800000125"
			// }
			var chooseMarketData = storage.getChooseMarketData();
			// console.log(chooseMarketData);
			return chooseMarketData;
		},
	},
	onLoad(payload) {
		// 该页面有三个跳转来源
		// 1. 首页菜单新增客户
		// 2. 首页搜索 searchRecord 输入非客户电话而来，会带上电话和名称
		// 3. 从客户详情点编辑按钮进来，会带上 customerId, 即用户id
		// 4. 从[我的线索]转过来,会带上所有数据,字段名:bcustomInfo
		const that = this;
		this.options = payload;
		// 获取客户等级
		this.getCustomerLevels();
		// 初始化客户经理选中状态
		this.getSalesInfo();

		if (payload.customerId) { // 从编辑页来
			this.customerId = payload.customerId;
			this.getCustomerInfo(payload.customerId);
			this.navBarTitle = "编辑客户";
			uni.setNavigationBarTitle({
				title: '编辑客户'
			});
		} else if (payload.name || payload.customerPhone) { // 从搜索页面输入不是客户电话，点击新增用户而来
			// this.customFormData.storeID = this.$storage.getAppUserInfo().currentStoreId;
			this.customFormData.phone = payload.customerPhone;
			this.customFormData.name = payload.name;
			// alert(this.customFormData.name);
		} else if (payload.bcustomInfo) {
			// 姓名, 电话, 单位, 生日, 客户经理id, 客户经理姓名
			let {
				clueUserName,
				clueUserPhone,
				clueUserCompany,
				clueUserBirthdayDate,
				marketerID,
				marketerName
			} = JSON.parse(payload.bcustomInfo);

			this.customFormData.name = clueUserName;
			this.customFormData.phone = clueUserPhone;
			this.customFormData.company = clueUserCompany;
			this.customFormData.birthday = clueUserBirthdayDate;
			if (this.customFormData.birthday) {
				this.customFormData.birthday = this.customFormData.birthday.slice(0, 10);
			} else {
				this.customFormData.birthday = '';
			}
			if (marketerID) {
				console.log('线索来的客户marketerID', marketerID);
				this.customFormData.marketerID = marketerID;
			} else {
				console.log('线索来的客户没有marketerID');
			}
			// console.log(this.customFormData);
		} else { // 默认新增，什么都没传

		}

		// 监听：editCustomerLabel 保存事件（新增用户触发）
		// 新增的需要本页面保存更新
		uni.$on('sw-add-customer-label', function(data) {
			that.selectTags = data.newLabelArr;
			that.customFormData.customerTags = that.selectTags.map(v => {
				return {
					cWCompanyId: storage.getAppUserInfo().cwCompanyID,
					customerLabelId: v.value,
					marketerId: storage.getAppUserInfo().marketerId,
					storeID: storage.getAppUserInfo().currentStoreId,
				}
			});

			console.log("新增用户的当前选中标签", that.selectTags);
			console.log("更新后的customerTags：", that.customFormData.customerTags);
		});
		// 监听：editCustomerLabel 保存事件（编辑用户触发）
		// 编辑的在 editCustomerLabel 中已经对该用户标签更新，此处仅更新UI
		uni.$on('sw-customer-detail-label', data => {
			console.log({
				"emit-newLabelArr": data.newLabelArr
			});
			that.selectTags = data.newLabelArr;
			that.customFormData.customerTags = that.selectTags.map(v => v.value);
			console.log("当前选中标签", that.selectTags);
		});
	},
	onUnload() {
		uni.$off('sw-add-customer-label');
		uni.$off('sw-customer-detail-label');
	},
	methods: {
		// 设置bookerInfo / 设置customer tab 当前选中tab
		...mapMutations(['setBookerInfo', 'setReserveTab']),
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		// 保存
		onSave() {
			this.formSubmit(this.customFormData);
		},
		// 选择生日
		chooseDate(e) {
			this.customFormData.birthday = e.target.value;
		},
		// 选择销售经理
		chooseSales(e) {
			this.$util.baiduEvent('更换客户经理', '编辑客户页底部更换客户经理');
			this.index = e.target.value;
			this.customFormData.marketerID = this.sales[this.index].value;
			this.customFormData.marketer = this.sales[this.index].text;
		},
		//立即预订
		fastBook() {
			if (!this.$cw.todayScheduled()) {
				uni.showToast({
					title: '您没有开通预订台权限',
					icon: 'none'
				});
				this.modalName = null;
				// 从首页来则直接回首页，否则返回上一页
				if (getCurrentPages().length == 1) {
					uni.navigateBack();
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
				return;
			}
			this.modalName = null;
			let obj = {
				customerID: this.customFormData.customerID,
				bookerName: this.customFormData.name,
				bookerPhone: this.customFormData.phone,
			};
			let param = util.urlEncode(obj).substring(1);
			// console.log(param);

			// 切换到预订tab下的卡片模式
			this.setReserveTab(0);
			// switchtab无法传参,存vuex中
			this.setBookerInfo(obj);
			uni.navigateTo({
				url: `/pages/homePageSub/reserve/reserve`
			});
		},
		// 隐藏弹框
		hideModal(e) {
			this.modalName = null;
			uni.$emit('refreshDataToCustomerList');
			// 从首页来则直接回首页，否则返回上一页
			if (getCurrentPages().length == 1) {
				uni.navigateBack();
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		// 切换性别
		changeSex(sex) {
			this.customFormData.sex = sex;
		},
		//初始化销售经理选中状态
		getSalesInfo() {
			this.sales.forEach((v, index) => {
				if (v.value === this.customFormData.marketerID) { // 如果该用户客户经理在经理列表中，就选中
					this.index = index;
				}
			});
			let filter = this.sales.find(v => v.value == this.customFormData.marketerID);
			if (!filter && this.sales.length > 0) { // 没有当前登录人，就更改customFormData中客户经理id和名称为数组第一个
					this.customFormData.marketer = this.sales[0].text;
					this.customFormData.marketerID = this.sales[0].value;
			}
		},
		//公司得到焦点 关闭提示
		companysShow() {
			this.isCompanysShow = true;
		},
		//公司失去焦点 关闭提示
		closeCompany() {
			setTimeout(() => {
				this.isCompanysShow = false;
			}, 0)
			this.customFormData.company = this.companyNameText;
		},
		//搜索单位
		async getSearchCompany() {
			const self = this;
			let result = (await CY22.GetFilterEnterprise({
				cWCompanyID: storage.getAppUserInfo().cwCompanyID,
				name_like: self.companyNameText,
				quickCheckCode_like: self.companyNameText,
			})).result;
			self.companys = result.dataList;
			if (self.companys.length > 0) {
				var newName = self.companyNameText;
				self.companys.forEach(function(item) {
					if (item.companyID && newName == item.name) {
						self.customFormData.company = item.name;
					} else {
						self.customFormData.company = '';
						self.customFormData.companyID='';
					}
				})
			} else {
				self.customFormData.company = self.companyNameText;
				self.customFormData.companyID='';
			}
		},
		// 选择单位
		gotoCompany(item) {
			this.companyNameText = item.name;
			this.customFormData.companyID = item.companyID;
			const self = this;
			setTimeout(function() {
				self.companys = [];
				// 选择了公司列表更改的公司
				self.isSelectedCompanyList = true;
			}, 500);
		},

		// 获取所有客户等级
		async getCustomerLevels() {
			var self = this;
			let result = (await CY24.GetMembershipLevelScreening({
				cWCompanyID: storage.getAppUserInfo() ? storage.getAppUserInfo().cwCompanyID : '',
			}));

			console.log({
				"所有客户等级CustomerLevelQueryData": result.dataList
			})
			self.CustomerLevelQueryData = result.dataList;

		},
		// 去添加客户标签页
		gotoCustomerLabel() {
			this.$util.baiduEvent('打标签', '编辑客户页底部打标签');
			const query = this.customerId != '-1' ? '?customerId=' + this.customerId : '';
			uni.navigateTo({
				url: '/pages/_common/editCustomerLabel/editCustomerLabel' + query,
			});
		},
		// 提交表单
		formSubmit(modalName) {
			//将下列代码加入到对应的检查位置
			//定义表单规则 ^((0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$|^(0?[1][3578][0-9]{9})$|^(400[0-9]{7})$
			let telReg1 = new RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/);
			let telReg2 = new RegExp(/^1[1234576890]\d{9}$/);
			// console.log(modalName.name == '')
			modalName.name == '' ? uni.showToast({
					title: '请输入客户姓名',
					icon: 'none'
				}) :
				!telReg1.test(modalName.phone)&&!telReg2.test(modalName.phone) ?
				uni.showToast({
					title: '号码格式错误',
					icon: 'none'
				}) :
				// console.log(modalName)
				this.saveCustomerInfo(modalName)
		},
		// 获取用户信息
		async getCustomerInfo(customerId) {
			const data = {
				customerID: customerId,
				storeID: storage.getAppUserInfo().currentStoreId,
				cWCompanyId: storage.getAppUserInfo().cwCompanyID,
				isInPhone: 1,
			}
			let result = await CY19.GetCustomerDetail(data);
			var self = this;
			if (result) {
				console.log({
					"根据id获取用户信息customFormData": result
				});
				// 如果没有客服经理信息
				if (!result.marketerID) {
					result.marketerID = self.customFormData.marketerID;
					result.marketer = self.customFormData.marketer;
				}
				self.customFormData = result;
				
				self.copyCustomFormData = JSON.parse(JSON.stringify(result));
				result.name = result.customerName;

				if (result.marketerMarketerID && (typeof result.marketerMarketerID) != 'object') {
					// 只有上面条件满足，才更改 customFormData 中要更新的下面两个字段
					result.marketer = result.marketerName;
					result.marketerID = result.marketerMarketerID;
				}
				self.companyNameText = result.companyName || '';
				result.msgName = result.msgName ? result.msgName : result.name;
				// 标签
				// console.log(self.customFormData.customerTags);
				// console.log(self.CustomerLabelDatas);
				// FIXED：展示标签
				self.selectTags = self.customFormData.customerTags.map(v => {
					return {
						name: v.name,
						value: v.value
					}
				});
				result.isArrange = result.isArrange ? '1' : '0';

				// 初始化设置销售经理
				self.sales.forEach((v, index) => {
					// console.log(v.value, result.customerMarketerID);
					if (v.value === result.customerMarketerID) { // 如果该用户客户经理在经理列表中，就选中
						self.index = index;
					}
				});

				setTimeout(function() {
					self.companys = [];
				}, 1000);

				if (result.birthday && (typeof result.birthday) != 'object') {
					self.customFormData.birthday = self.$moment(result.birthday).format("YYYY-MM-DD");
				} else {
					self.customFormData.birthday = '';
				}
			} else {
				uni.showToast({
					title: '没有该用户，查询失败',
					icon: 'none'
				})
			}
		},
		//保存客户信息（添加或更新）
		async saveCustomerInfo(modalName) {
			const self = this;
			let data = self.customFormData;
			if (data.birthday.length > 0) {
				data.birthday = self.$moment(data.birthday).format('YYYY-MM-DD') + " 00:00:00";
			}
			data = {
				birthday: data.birthday,
				company: self.companyNameText,
				companyID:data.companyID,// this.isSelectedCompanyList ?  data.companyID : '',
				id: data.customerID,
				marketer: data.marketer,
				marketerID: data.marketerID,
				msgName: data.msgName,
				name: data.name,
				phone: data.phone,
				sex: data.sex,
				isArrange: data.isArrange,
				customerRemark:data.customerRemark
				// 不需要更新标签,标签有单独页面
			}
			let result = await CY19.CreateOrUpdateByDto(data);

			// 成功后重置时间和清除之前临时在 editCustomerLabel页面中缓存在本地的标签们
			self.customFormData.birthday = self.customFormData.birthday.length > 0 ? self.$moment(self.customFormData.birthday)
				.format('YYYY-MM-DD') : '';
			this.$storage.removeAddCustomerTagList();

			// if (cw.currentAddCustomer) {
			// 	cw.currentAddCustomer.customerId = data.id
			// 	cw.currentAddCustomer.customerName = data.name
			// 	cw.currentAddCustomer.customerPhone = data.phone
			// }
			// 从更新来，而且有currentCustomerPoolItem
			if (this.$cw.currentCustomerPoolItem && this.options.customerId) {
				this.$cw.currentCustomerPoolItem.customerName = data.name;
				this.$cw.currentCustomerPoolItem.marketerName = data.marketer;
				this.$cw.currentCustomerPoolItem.phone = data.phone;
				this.$cw.currentCustomerPoolItem.companyName = data.company;
				this.$cw.currentCustomerPoolItem.isLockMarket = result.isLockMarket;
			}
			console.log({curCustoemr: this.$cw.currentCustomerPoolItem, data});

			if (data.id) { // 如果是更新直接返回
				// 保存成功后，把当前existTag中的值，重新包装后返回给 customInfo 客户详情页，局部刷新页面数据
				uni.$emit('sw-customerinfo-update');
				uni.navigateBack({
					delta: 1
				});
			} else { // 新增客户，保存成功会弹窗询问登录人是否立即给该客人预订
				this.modalName = 'DialogModal1';
				// 获取刚创建成功的客户id
				data.customerID = result.customID;
				uni.$emit('addContactsFromCallRecords');
			}
		},
	},
	watch: {
		"companyNameText": {
			handler: function(val, oldval) {
				if (val) {
					// 直接更改了单位input，而不是通过搜索列表点过来的
					this.isSelectedCompanyList = false;
					this.getSearchCompany();
				}
			}
		},
	}

}
