import cw from '@/common/ceiwei/common.js';
import CY18 from '@/service/CY/CY18AppService.js';
import CY19 from '@/service/CY/CY19AppService.js';
import CY24 from '@/service/CY/CY24AppService.js';
import CY27 from '@/service/CY/CY27AppService.js';
import CY63 from '@/service/CY/CY63AppService.js';
import storage from '@/common/unistorage/index.js';
import graceChecker from '@/common/ceiwei/graceChecker.js';
import moment from '@/lib/moment/moment.min.js';
export default {
	data() {
		return {
			// 生日/机会日期
			date: cw.pikerGetDate(),
			startDate: cw.pikerGetDate('start'),
			endDate: cw.pikerGetDate('end'),

			//客户信息
			PhoneQueryText: "",
			customerInfoQuery: {
				pageIndex: 1,
				pageSize: 1,
				order: "CustomerName",
			},
			customData: [],
			customQueryData: {
				Order: "Name desc",
				PageIndex: 1,
				PageSize: 5
			},

			//保存需要填写选择的资料
			customFormDataText: {
				remark: '',
				expectOn: '',
				customerName: '',
				company: '',
				birthday: '',
			},
			customFormData: {
				phone: "",
				levelID: "",
				marketerId: storage.getAppUserInfo() ? storage.getAppUserInfo().marketerId : '',
				customerID: "",
				createOn: "",
				cwCompanyID: "",
				storeID: "",
				sex: "男",
				marketerName: storage.getAppUserInfo() ? storage.getAppUserInfo().userName : '',
			},
			// //机会备注(type=4)
			cy63TagQuery: {
				PageIndex: 1,
				PageSize: 10000,
				Order: "TagID asc",
				StoreId: storage.getAppUserInfo() ? storage.getAppUserInfo() : '',
				TagType: 4,
			},
			// 机会备注列表
			cy63TagData: [],
			// 当前选择的tag
			currentSelectTag: {
				tagID: 0,
				tagContent: ''
			},
			tagListIsOpen: false, // 默认折叠机会面板

			customerLevelQueryData: [],
			currentFollow: {
				value: storage.getAppUserInfo() ? storage.getAppUserInfo().marketerId : '',
				text: storage.getAppUserInfo() ? storage.getAppUserInfo().userName : ''
			}, // 当前跟踪人
			// 登录人各种权限
			salesAuthority: storage.getSalesAuthority(),
			// 销售经理
			salesQuery: {
				pageIndex: 1,
				pageSize: 99999,
				order: "MarketerID desc",
				select: "new(MarketerID,MarketerName)",
			},
			sales: [], // 销售经理列表
			index: 0, // 销售经理默认索引
		};
	},
	onLoad() {
		// 获取销售经理列表
		this.getSalesInfo();
		// 获取快捷备注标签
		this.getcy63TagData();
		// 获取客户等级
		this.getCustomerLevels();
	},
	methods: {
		// 返回上一页
		onBack() {
			uni.navigateBack({
					delta:1
				});
		},
		// 点击客户名候选人列表item
		gotoCustom(item) {

			this.PhoneQueryText = item.phone;
			this.PhoneQuery();
			const self = this;
			setTimeout(function() {
				self.customData = [];
			}, 1000);
		},
		// 电话号码查询
		PhoneQuery() {
			const tel = this.PhoneQueryText;
			if (tel) {
				this.getCustomInfo(tel);
			} else {
				this.customFormData = {
					phone: "",
					levelID: "",
					marketerId: "",
					customerID: "",
					createOn: "",
					cwCompanyID: "",
					storeID: "",
					sex: "男",
					marketerName: this.$storage.getAppUserInfo().userName
				}
				this.customFormDataText = {
					remark: '',
					expectOn: '',
					customerName: '',
					company: '',
					birthday: '',

				};
			}
		},
		async getCustomDate() {
			const self = this;
			let data = self.customQueryData;
			let result = (await CY19.GetFilteredCustomers({
				CWCompanyID: this.$storage.getAppUserInfo().cwCompanyID,
				CustomerName_like: this.PhoneQueryText,
				Phone_like: this.PhoneQueryText,
				QuickCheckCode_like: this.PhoneQueryText,
			
			})).result;

			self.customData = result.dataList;

		},
		// 客户详情查询
		async getCustomInfo(tel) {
			const self = this;
			const data = self.customerInfoQuery;
			data.filter = {
				conditions: [{
					attribute: "Phone",
					datatype: "nvarchar",
					operatoer: "eq",
					value: tel
				}]
			}
			let result = (await CY19.GetFilteredCustomers({
				Phone: tel,
			})).result;

			if (result.dataList[0] && self.PhoneQueryText == result.dataList[0].phone) {
				//layer.msg("客户信息已存在", { time: 2000 });
				self.customFormData = result.dataList[0];
				self.customData = result.dataList[0];

				//self.getLevel(result.dataList[0].levelID);

			} else {
				self.customFormData = {
					phone: "",
					levelID: "",
					marketerId: "",
					customerID: "",
					createOn: "",
					cwCompanyID: "",
					storeID: "",
					sex: "男",
					marketerName: this.$storage.getAppUserInfo().userName
				}
				self.customFormDataText = {
					remark: '',
					expectOn: '',
					customerName: '',
					company: '',
					birthday: '',
				};
				uni.showToast({
					title: '暂无该客户信息,您可以新增此客户',
					duration: 2000
				});
			}

		},
		// 保存
		async save() {
			const self = this;
			const Inputtext = self.customFormDataText
			const data = self.customFormData;

			if (data && self.PhoneQueryText == data.phone) {
				if (!Inputtext.expectOn || !Inputtext.remark) {
					uni.showToast({
						title: '请填写日期和备注!',
						icon: 'none'
					})
					return;
				}

				data.marketerId = self.customFormData.marketerMarketerID;
				data.customerID = self.customFormData.customerID;
				data.customerName = self.customFormData.customerName;
				data.phone = self.customFormData.phone;
				data.company = self.customFormData.company;
				data.createOn = moment().format("YYYY-MM-DD HH:mm:ss");
				data.cwCompanyID = self.$storage.getAppUserInfo().cwCompanyID;
				data.remark = Inputtext.remark;
				data.storeID = self.$storage.getAppUserInfo().currentStoreId;
				data.expectOn = Inputtext.expectOn + " 00:00:00";
				data.birthday = self.customFormData.birthday;
				data.sex = self.customFormData.sex;
				data.levelID = self.customFormData.levelID
			} else {
				if (!self.PhoneQueryText || !Inputtext.customerName) {
					uni.showToast({
						title: '请填写客户手机号和客户姓名!',
						icon: 'none'
					})
					return;
				}
				if (!Inputtext.expectOn || !Inputtext.remark) {
					uni.showToast({
						title: '请填写日期和备注!',
						icon: 'none'
					})
					return;
				}
				data.sex = self.customFormData.sex;
				data.customerName = Inputtext.customerName;
				data.birthday = Inputtext.birthday;
				data.phone = self.PhoneQueryText;
				data.company = Inputtext.company;
				data.marketerId = self.$storage.getAppUserInfo().marketerId;
				data.expectOn = Inputtext.expectOn + " 00:00:00";
				data.createOn = moment().format("YYYY-MM-DD HH:mm:ss");
				data.cwCompanyID = self.$storage.getAppUserInfo().cwCompanyID;
				data.storeID = self.$storage.getAppUserInfo().currentStoreId;
				data.remark = Inputtext.remark;
				data.levelID = self.customFormData.levelID

			}
			data.birthday = typeof Inputtext.birthday == 'object' ? '' : Inputtext.birthday;
			if (data.birthday !== '' && data.birthday.indexOf("00:00:00") == -1) {
				data.birthday = data.birthday + " 00:00:00";
			}

			let res = await CY27.CreateByDto(data);
			if (getCurrentPages().length === 1) {
				this.$cw.backToHome(1);
			} else {
				uni.navigateBack({
					delta: 1
				})
			}

		},
		//获取销售经理
		async getSalesInfo() {
			const self = this;
			const data = self.salesQuery;
			data.filter = {
				type: 'and',
				conditions: [{
					attribute: 'StoreID',
					datatype: 'nvarchar',
					operatoer: 'eq',
					value: this.$storage.getAppUserInfo().currentStoreId,
				}, ],
			};
			let result = await CY18.GetViewPageSelect(data);
			self.sales = result.dataList;

		},
		// 折叠面板change事件
		changeRemarkWrapper() {
			this.tagListIsOpen = !this.tagListIsOpen;
		},
		// 获取机会备注
		async getcy63TagData() {
			const self = this;
			var data = self.cy63TagQuery;
			let result = (await CY63.GetLabelFilter(self.cy63TagQuery)).result;
			self.cy63TagData = result.dataList;
		},
		// 点击机会备注
		remarkClick(item) {
			if (item.TagID == this.currentSelectTag.tagID) {
				this.currentSelectTag = {
					tagID: 0,
					tagContent: ''
				}
				let remark = this.customFormDataText.remark;
				remark = this.customFormDataText.remark.replace(item.tagContent, "");
				if (remark[0] == ",") {
					remark = this.customFormDataText.remark.replace(item.tagContent + ",", "");
				}
				this.customFormDataText.remark = remark;

			} else {
				this.currentSelectTag = {
					tagID: item.tagID,
					tagContent: item.tagContent
				}
				let remark = this.customFormDataText.remark;
				if (remark) {
					remark = item.tagContent + "," + this.customFormDataText.remark;
				} else {
					remark = item.tagContent;
				}
				this.customFormDataText.remark = remark;
			}
		},
		//获取等级
		async getCustomerLevels() {
			const self = this;

			let result = (await CY24.GetMembershipLevelScreening({
				cWCompanyID: storage.getAppUserInfo() ? storage.getAppUserInfo().cwCompanyID : '',
			})).result;

			self.customerLevelQueryData = result.dataList;

		},
		// 客户等级
		RadioChange(e) {
			this.radio = e.detail.value;
		},
		// 生日
		chooseBirthday(e) {

			this.customFormDataText.birthday = e.target.value + ' 00:00:00';
		},
		// 机会日期
		chooseDate(e) {

			// var chooseDate = selectItems.y.value + "-" + selectItems.m.value + "-" + selectItems.d.value;
			this.customFormDataText.expectOn = e.target.value;
		},
		// 切换性别
		changeSex(sex) {

			this.customFormData.sex = sex;
		},
		// 更换销售经理
		chooseSales(e) {
			const self = this;

			if (!this.salesAuthority.isAdjustMarket) return;

			uni.showModal({
				title: '提示',
				content: '确定更改客户经理？',
				success: function(res) {
					if (res.confirm) {
						self.index = e.target.value;
						self.customFormData.marketerMarketerID = self.sales[self.index].marketerID;
						self.customFormData.marketerName = self.sales[self.index].marketerName;
					} else if (res.cancel) {}
				}
			});
		},
	},
	watch: {
		PhoneQueryText: {
			handler: function(val, oldval) {
				if (val) {
					this.getCustomDate();
				} else {
					this.customFormData = {
						phone: "",
						levelID: "",
						marketerId: "",
						customerID: "",
						createOn: "",
						cwCompanyID: "",
						storeID: "",
						sex: "男",
						marketerName: this.$storage.getAppUserInfo().userName
					}
					this.customFormDataText = {
						remark: '',
						expectOn: '',
						customerName: '',
						company: '',
						birthday: '',

					}
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
				}
			}
		}
	}
}
