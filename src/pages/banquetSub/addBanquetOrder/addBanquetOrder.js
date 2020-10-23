import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import storage from '@/common/unistorage/index.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
import YHClue from '@/service/YH/YHClueAppService.js';
import CY18 from '@/service/CY/CY18AppService.js';
import CY22 from '@/service/CY/CY22AppService.js';
const app = getApp();
// import {
// 	CreateByDto,
// 	UpdateByDto,
// 	GetBanquetFOrderType,
// 	GetbanquetPackage,
// 	GetViewDto
// } from '@/service/YH/YHBanquetOrderAppService.js'


export default {
	// 右上角保存按钮
	onNavigationBarButtonTap(e) {
		var self = this;
		self.next();
		// if (self.index != 3) {
		//   uni.showToast({
		//     title: '请选择下一步',
		//     icon: 'none'
		//   });
		// } else {
		//  self.next();
		// }

		// e.text="aaa";

		// const index = e.index;
		// console.log(this)
		// console.log(this.$mp.page.$getAppWebview())
		// var currentWebview = this.$mp.page.$getAppWebview();
		// currentWebview.setTitleNViewButtonStyle(0, {
		//     text: "编辑",
		// });
	},
	components: {
		uniPopup
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			fromtype: -1,
			navBarTitle: '新增宴会单',
			navbuttontext: '下一步',
			banquetFOrderData: {
				id: null, //订单ID
				orderCstName: '', //客户姓名
				orderCstPhone: '', //客户手机
				banquetOrderName: '', //宴会名称
				orderCstCompany: '', //客户单位
				banquetThemeTypeID: '', //宴会类型
				banquetThemeTypeName: '', //宴会类型名称
				banquetDate: '', //执行时间
				banquetDate_Date: '', //执行时间
				orderSignDate: '', //签单时间
				orderSignDate_Date: '', //签单时间
				packageTableCount: '', //桌数
				PackageSpareTableCount: '', //备用桌数
				coordinatorID: '', //统筹经理
				coordinatorName: '', //统筹经理姓名
				marketerID: '', //客户经理
				marketerName: '', //客户经理姓名
				banquetImgUrl: '', //宴会图片
				banquetOrderState: 1, //宴会状态
				banquetOrderRemar: '', //宴会备注
				banquetPackageGUID: '', //宴会套餐
				banquetPackageName: '', //宴会名称
				packagePrice: '', //套餐价格
				packageRemark: '', //套餐备注
				clueGUID: '',
			},
			banquetFOrder: [], //宴会类型
			marketers: [], //客户经理
			index: 1, //页码
			isChecked1: 0, //控制选中class
			readyTableNumLen: 2, //选择桌数长度
			tableNumDesc: '', //桌数
			tableNumDesc2: '', //备桌数
			msg: '', //表单显示的桌数和备桌数
			isShow: true, //调换桌数和备桌数
			banquetPackageList: [], //宴会套餐
			navbar: null, //navbar
			marketerindex: '',
			coordinatorindex: '',
			banquetThemeTypeindex: '',
			banquetPackageGUIDindex: '',
			clueGUID: null,
			companys: [],
			marketerID: null,
			isCompanysShow: false, //是否显示单位列表

		};
	},

	async onLoad(option) {
		let self = this;
		// console.log(option.id);
		if (option.fromtype) {
			self.fromtype = option.fromtype;
		}
		self.clueGUID = option.clueGUID;
		window.localStorage.getItem('CW.YYT.App.ChooseMarketData');
		// uni.getStorage({
		//     key: 'marketers',
		//     success: res => {
		//         console.log(res.data);
		//         self.marketers = res.data.slice(3);
		//         // self.marketers = self._.cloneDeep(res.data)
		//     }
		// });

		var cy18data = {
			"pageIndex": 1,
			"pageSize": 10000,
			"order": "createTime desc",
			"filter": {
				"conditions": [{
					"attribute": "StoreID",
					"datatype": "navarchar",
					"operatoer": "eq",
					"value": storage.getAppUserInfo().currentStoreId,
				}],
				"type": "and",
			},
			"select": "new(MarketerID,MarketerName)"
		}
		let res = await CY18.GetViewPageSelect(cy18data);
		self.marketers = res.dataList;

		if (self._(self.marketers).some(x => x.marketerID == self.marketerID)) {
			// console.log(self._(self.marketers).find(x => x.marketerID == self.marketerID).marketerName);
			self.marketerindex = self._(self.marketers).findIndex(x => x.marketerID == self.marketerID);
			self.banquetFOrderData.marketerName = self._(self.marketers).find(x => x.marketerID == self.marketerID).marketerName;
			self.banquetFOrderData.marketerID = self.marketerID;
		}
		// console.log(self.marketers)



		//获取今天日期
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		self.banquetFOrderData.orderSignDate_Date = year + '-' + month + '-' + day;
		self.banquetFOrderData.orderSignDate = self.banquetFOrderData.orderSignDate_Date + " 00:00:00"


		self.getbanquetFOrder();
		self.getbanquetPackageList();
		if (!self.isEmpty(option.id)) {
			let res=await YHBanquetOrder.GetViewDto({
					id: option.id});
					self.banquetFOrderData = res;
					self.marketerindex = self._(self.marketers).findIndex(x => x.marketerID == res.marketerID);
					self.banquetThemeTypeindex = self._(self.banquetFOrder).findIndex(x => x.bookOrderTypeID == res.banquetThemeTypeID);
					self.banquetPackageGUIDindex = self._(self.banquetPackageList).findIndex(x => x.id == res.banquetPackageGUID);
					self.coordinatorindex = self._(self.marketers).findIndex(x => x.marketerID == res.coordinatorID);
					self.banquetFOrderData = Object.keys(self.banquetFOrderData).map(k => ({
						[k]: (self.banquetFOrderData[k] || '')
					})).reduce((d1, d2) => ({ ...d1,
						...d2
					}))
					self.banquetFOrderData.orderCstCompany = self.banquetFOrderData.orderCstCompany == null ? "" : self.banquetFOrderData
						.orderCstCompany;
					self.banquetFOrderData.orderSignDate_Date = res.orderSignDate == null ? '' : res.orderSignDate.substring(0, 10);
					// console.log(self.banquetFOrderData.orderSignDate_Date + '时间');
					self.navBarTitle = '编辑宴会单';
					self.banquetFOrderData.banquetDate_Date = res.banquetDate == null ? '' : res.banquetDate.substring(0, 10);
					self.msg = `${self.banquetFOrderData.packageTableCount}桌备${self.banquetFOrderData.packageSpareTableCount}`;
				
		} else if (!self.isEmpty(option.clueGUID)) {
			//判断是否是线索
			let res=await YHClue.GetViewDto({
					id: option.clueGUID
				});
					res = self.$util.null2str(res);
					// console.log(res);
					// console.log(self.banquetFOrderData);
					self.banquetFOrderData.orderCstName = res.clueUserName;
					self.banquetFOrderData.orderCstPhone = res.clueUserPhone;
					self.banquetFOrderData.orderCstCompany = res.clueUserCompany;
					self.banquetFOrderData.clueGUID = option.clueGUID;
					if (!self.isEmpty(res.clueScheduleDate)) {
						self.banquetFOrderData.banquetDate = res.clueScheduleDate;
						self.banquetFOrderData.banquetDate_Date = res.clueScheduleDate.substring(0, 10);
					}
					// console.log(self.banquetFOrder);

					if (!self.isEmpty(res.bookOrderTypeID)) {
						self.banquetFOrderData.banquetThemeTypeID = res.bookOrderTypeID;
						if (self.banquetFOrder.length != 0) {

							self.banquetThemeTypeindex = self._(self.banquetFOrder).findIndex(x => x.bookOrderTypeID == res.bookOrderTypeID);
							self.banquetFOrderData.banquetThemeTypeName = self._(self.banquetFOrder).find(x => x.bookOrderTypeID == res.bookOrderTypeID)
								.name;
						}

					}

					self.banquetFOrderData.banquetOrderRemark = option.clueRemark;
					self.banquetFOrderData.packageTableCount = res.clueTableCount;
					self.banquetFOrderData.bakTableCount = res.bakTableCount;
					self.banquetFOrderData.packageSpareTableCount = res.bakTableCount;
					self.msg = `${self.banquetFOrderData.packageTableCount}桌备${self.banquetFOrderData.packageSpareTableCount}`;

					
					if (self._(self.marketers).some(x => x.marketerID == res.marketerID)) {
						self.marketerindex = self._(self.marketers).findIndex(x => x.marketerID == res.marketerID);
						self.banquetFOrderData.marketerName = self._(self.marketers).find(x => x.marketerID == res.marketerID).marketerName;
						self.banquetFOrderData.marketerID = res.marketerID;
					} else {
						self.marketerID = res.marketerID;
					}
					self.banquetFOrderData.banquetOrderName = res.clueUserName + self.banquetFOrderData.banquetDate_Date + res.name;


					// self.banquetFOrderData.banquetDate=res.clueScheduleDate;
					// self.banquetFOrderData.orderSignDate_=res.clueScheduleDate;
					// self.banquetFOrderData.packageTableCount=res.clueTableCount;
					// self.banquetFOrderData.PackageSpareTableCount=res.bakTableCount;
					// self.banquetFOrderData.marketerID=res.marketerID;
					// self.banquetFOrderData.marketerName=res.marketerName;
					// self.banquetFOrderData.banquetOrderRemar=res.clueRemark;
					// self.banquetFOrderData.orderSignDate_Date = self.banquetFOrderData.banquetDate.substring(0,10);
					// self.banquetFOrderData.banquetDate_Date = self.banquetFOrderData.banquetDate.substring( 0,10);
					// self.msg = `${self.banquetFOrderData.packageTableCount}桌备${self.banquetFOrderData.packageSpareTableCount}`;
				
		}




		// let isSeeAll = self.getSalesAuthority.isSeeAll;
		// if (isSeeAll == 0) {
		// 	self.marketer = self.$storage.getAppUserInfo().userName;
		// }
		// this.banquetFormData.marketerID = self.$storage.getAppUserInfo().marketerId;
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},

	methods: {



		//公司得到焦点 关闭提示
		companysShow() {
			this.isCompanysShow = true;
		},
		//公司失去焦点 关闭提示
		closeCompany() {
			setTimeout(() => {
				this.isCompanysShow = false;
			}, 0)
			// this.queryFllow.clueUserCompany=this.companyNameText;
		},
		//搜索单位
		async getSearchCompany() {
			const self = this;
			let result=(await CY22.GetFilterEnterprise({
										cWCompanyID:storage.getAppUserInfo().cwCompanyID,
										name_like:self.banquetFOrderData.orderCstCompany,
										quickCheckCode_like:self.banquetFOrderData.orderCstCompany,
										})).result;
				self.companys = result.dataList;
				// if (self.companys.length > 0) {
				// 	let newName = self.banquetFOrderData.orderCstCompany;
				// 	self.companys.forEach(function(item) {
				// 		if (item.companyID && newName == item.name) {
				// 			self.banquetFormData.clueUserCompany = item.name;
				// 		} else {
				// 			self.banquetFormData.clueUserCompany = '';
				// 		}
				// 	})
				// } else {
				// 	self.banquetFormData.clueUserCompany = self.banquetFOrderData.orderCstCompany;
				// }
			
		},
		// 选择单位
		gotoCompany(item) {
			this.banquetFOrderData.orderCstCompany = item.name;
			const self = this;
			setTimeout(function() {
				self.companys = [];
			}, 1000)
		},
		onBack() {
			let self = this;
			if (self.index == 1) {
				uni.navigateBack({
					delta:1
				});
			} else {
				self.index--;
				self.navbuttontext = '下一步';
			}
		},
		getRegeo() {
			this.amapPlugin.getRegeo({
				success: res => {
					this.addressName = res[0].regeocodeData.addressComponent.district;
					// console.log(this.addressName);
					// #ifdef APP-PLUS
					// let pages = getCurrentPages();
					// let page = pages[pages.length - 1];
					// let currentWebview = page.$getAppWebview();
					// let titleObj = currentWebview.getStyle().titleNView;
					// this.addressName 位置
					titleObj.buttons[0].text = this.addressName;
					currentWebview.setStyle({
						titleNView: titleObj
					});
					// #endif
				}
			});
		},
		// 判断字符串是否为空
		isEmpty(obj) {
			if (typeof obj == 'undefined' || obj == null || obj == '') {
				return true;
			} else {
				return false;
			}
		},
		checkMobile(mobile) {
			return RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/).test(mobile) || RegExp(/^1[1234576890]\d{9}$/).test(mobile);
		},
		//下一步
		async next() {

			var self = this;
			var banquetFOrderData = self.banquetFOrderData;
			switch (self.index) {
				case 1:
					if (
						self.isEmpty(banquetFOrderData.orderCstName) ||
						self.isEmpty(banquetFOrderData.banquetOrderName) ||
						self.isEmpty(banquetFOrderData.orderCstPhone)
					) {
						uni.showToast({
							title: '请输入必填字段',
							icon: 'none'
						});
					} else {
						if (!self.checkMobile(banquetFOrderData.orderCstPhone)) {
							uni.showToast({
								title: '手机号格式错误',
								icon: 'none'
							});
						} else {
							self.navbuttontext = '下一步',
								self.index = 2;
						}

					}
					break;
				case 2:
					if (
						self.isEmpty(banquetFOrderData.banquetDate) ||
						self.isEmpty(banquetFOrderData.coordinatorID) ||
						self.isEmpty(banquetFOrderData.marketerID) ||
						self.isEmpty(banquetFOrderData.orderSignDate)
					) {
						uni.showToast({
							title: '请输入必填字段',
							icon: 'none'
						});
					} else {
						(self.navbuttontext = '完成'), self.index++;
					}
					break;
				case 3:
					if (!self.isEmpty(self.banquetFOrderData.id)) {
						let res=await YHBanquetOrder.UpdateByDto(
							self.banquetFOrderData);
								if (self.fromtype == 2) {
									uni.redirectTo({
										url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.banquetFOrderData.id}`
									});
									uni.$emit('reloadPage', 'refresh');
								} else {
									// storage.setBanquetIsactive({ isactive: 1 });
									uni.$emit('reloadPageOrder', 'refresh');
									uni.switchTab({
										url: '/pages/banquet/banquet'
									});
								}

							
					} else {
						delete self.banquetFOrderData.id;
						self.banquetFOrderData.cWCompanyID = this.$storage.getAppUserInfo().cwCompanyID;
						let res=await YHBanquetOrder.CreateByDto(
							self.banquetFOrderData);

								if (!self.isEmpty(self.clueGUID)) {
									uni.redirectTo({
										url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${res.id}`
									});
									uni.$emit('reloadPage', 'refresh');
								} else {
									uni.redirectTo({
										url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${res.id}`
									});
									
									// storage.setBanquetIsactive({ isactive: 1 });
									// uni.$emit('reloadPageOrder', 'refresh');
									// uni.$emit('reloadPage', 'refresh');
									// uni.switchTab({
									// 	url: '/pages/banquet/banquet'
									// });
								}

							
					}

					break;
			}
		},

		// 获取宴会类型
		async getbanquetFOrder() {
			var self = this;
			let res=await YHBanquetOrder.GetBanquetFOrderType({
					pageIndex: 1,
					pageSize: 999999,
					order: 'createTime desc ',
					select: 'new(BookOrderTypeID, Name)',
					filter: {
						type: 'and',
						conditions: [{
								attribute: 'BookOrderTypeType',
								datatype: 'int',
								operatoer: 'eq',
								value: '3'
							},
							{
								attribute: 'storeId',
								datatype: 'nvarchar',
								operatoer: 'eq',
								value: self.$storage.getAppUserInfo().currentStoreId
							}
						]
					}
				});
				if(res)
				{
				self.banquetFOrder = res.dataList;
				
				if (self.banquetFOrderData.banquetThemeTypeID != '') {
					self.banquetThemeTypeindex = self._(self.banquetFOrder).findIndex(x => x.bookOrderTypeID == self.banquetFOrderData
						.banquetThemeTypeID);
					self.banquetFOrderData.banquetThemeTypeName = self._(self.banquetFOrder).find(x => x.bookOrderTypeID == self.banquetFOrderData
						.banquetThemeTypeID).name;
				}	
				}
				
				
		},
		// 返回上一页
		// 选择宴会类型
		banquetThemeTypeSelect(e) {
			let index = e.target.value==-1?0:e.target.value;
			this.banquetFOrderData.banquetThemeTypeID = this.banquetFOrder[
				index
			].bookOrderTypeID;
			this.banquetFOrderData.banquetThemeTypeName = this.banquetFOrder[
				index
			].name;
		},
		// 签单时间
		chooseDate(e) {
			this.banquetFOrderData.orderSignDate = e.target.value + ' 00:00:00';
			this.banquetFOrderData.orderSignDate_Date = e.target.value;
		},
		// 执行时间
		banquetDateSelect(e) {
			this.banquetFOrderData.banquetDate = e.target.value + ' 00:00:00';
			this.banquetFOrderData.banquetDate_Date = e.target.value;
		},
		// 选择统筹经理
		coordinatorSelect(e) {
			let index = e.target.value==-1?0:e.target.value;
			this.banquetFOrderData.coordinatorID = this.marketers[index].marketerID;
			this.banquetFOrderData.coordinatorName = this.marketers[
				index
			].marketerName;
		},
		// 选择客户经理
		marketerSelect(e) {
			var self = this;
			let index =e.target.value==-1?0:e.target.value;
			self.banquetFOrderData.marketerID = self.marketers[index].marketerID;
			self.banquetFOrderData.marketerName = self.marketers[index].marketerName;
		},

		// 获取套餐
		async getbanquetPackageList() {
			var self = this;
			let res=await YHBanquetOrder.GetbanquetPackage({
					pageIndex: 1,
					pageSize: 999999,
					order: 'createTime desc ',
					select: 'new(id, banquetPackageName,packagePrice,packageRemark)',
					filter: {
						type: 'and',
						conditions: [{
							attribute: 'buUnitGUID',
							datatype: 'nvarchar',
							operatoer: 'eq',
							value: self.$storage.getAppUserInfo().currentStoreId
						}]
					}
				});
					self.banquetPackageList = res.dataList;
				
		},

		// 套餐类型
		banquetPackageListSelect(e) {

			let index = e.target.value;
			index = index == -1 ? 0 : index;
			var ccc = this.banquetPackageList;
			this.banquetFOrderData.banquetPackageGUID = this.banquetPackageList[
				index
			].id;
			this.banquetFOrderData.banquetPackageName = this.banquetPackageList[
				index
			].banquetPackageName;
			this.banquetFOrderData.packagePrice = this.banquetPackageList[
				index
			].packagePrice;
			this.banquetFOrderData.packageRemark = this.banquetPackageList[
				index
			].packageRemark;
		},
		openPopup() {
			this.$refs.tableCount.open();
		},
		selectExtraDesknum(num) {
			//选择桌数

			var self = this;
			if (this.isShow) {
				if (this.tableNumDesc.length < 2) {
					this.tableNumDesc += num;
					self.packageTableCount = num;
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					});
				}
			} else {
				if (this.tableNumDesc2.length < 2) {
					this.tableNumDesc2 += num;
					self.PackageSpareTableCount = num;
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					});
				}
			}
		},
		confirm1() {
			//选择桌数确认键
			if (this.isShow) {
				this.isShow = false;
			} else {
				this.banquetFOrderData.packageTableCount = this.tableNumDesc;
				this.banquetFOrderData.PackageSpareTableCount = this.tableNumDesc2;
				this.msg = `${this.banquetFOrderData.packageTableCount}桌备${this.banquetFOrderData.PackageSpareTableCount}`;
				this.cancel1();
			}
		},
		cancel1() {
			//选择桌数取消键
			this.$refs.tableCount.close();
			this.tableNumDesc = '';
			this.tableNumDesc2 = '';
			this.isShow = true;
		}
	},
	watch: {
		'banquetFOrderData.orderCstCompany': {
			handler: function() {
				var self = this;

				this.getSearchCompany();
			},
		}
		// "companyNameText": {
		// 	handler: function(val, oldval) {
		// 		if (val) {
		// 			this.getSearchCompany();
		// 		}
		// 	}
		// },
		// companyNameText: {
		//     handler: function (val, oldval) {
		//         if (val) {
		//             this.getSearchCompany();
		//         }
		//     }
		// }
	}
};
