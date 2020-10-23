import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import util from '@/common/util.js';
// 引入uni自定义导航栏
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';

import {
	mapMutations
} from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import CY08 from '@/service/CY/CY08AppService.js';
import CY18 from '@/service/CY/CY18AppService.js';
import CY20 from '@/service/CY/CY20AppService.js';
import CY23 from '@/service/CY/CY23AppService.js';
import CY26 from '@/service/CY/CY26AppService.js';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';

export default {
	data() {
		return {
			fromPage: '',
			customerID: '',
			initMarketerID: '',
			bookInfo: {
				creatorID: '', // 用户ID
				checkerID: '', // 审核人ID
				id: '',
				customerID: '', // 用户ID
				bookerName: '', // 用户姓名
				bookerPhone: '', // 用户电话
				masterTableID: '', // 主桌号
				masterTableName: '', // 主桌名称
				company: '', // 单位
				companyID: '', //单位id
				marketerID: '', // 销售经理ID
				marketer: '', // 销售经理姓名
				storeID: '', // 门店ID
				cwCompanyID: '', // 企业ID
				bookFromType: 1, // 预订单来自（1手机，2PC）
				bookOrderTypeID: 0, // 预订单类型
				habit: '', // 喜好
				oredr: [{
					// 订单集合
					bookOn: '', // 订单日期
					listOrderDay: [{
						paid: 0,
						type: 0,
						willArrivedOn: '',
						bookNums: 0,
						fee: '',
						orderRealAmount: '',
						frontMoney: '',
						bookTableNum: 0,
					}, ],
				}, ],
				banquetOrderGUID: '', // 宴会详情id
				bookTable: [], // 桌台集合
			},
			copyBookInfo: {},
			navTitle: '立即预订',
			areaTable: [],
			areaTableCopy: [],
			pickerData: '',
			tablePanel: false,
			dinnerType: [],
			orderTimeIndex: 0,
			orderType: [],
			orderTypeIndex: null,
			marketList: [],
			marketerIndex: 0,
			bookNums: 0,
			bookTableNum: 0,
			paid: 0,
			frontMoney: '',
			fee: '',
			orderRealAmount: '',
			// 预订
			isEdit: false,
			orderTableId: [],
			copyOrderTableId: [],
			editCopyOrderTIds: [],
			curOrderTable: {},
			curOrder: {},
			bookID: '',
			statusStr: '',
			statusImg: '',
			storage: {},
			creatorID: '',
			_options: {}, // 传过来的参数
			// ------------------------- dataNavbar菜单 -----------------
			rightMenuArr: [{
					label: '发送微信评价', // 只有待关单的订单才有微信评价
					icon: '/static/banquet/share-to-customer.png',
					value: 'wx-evaluation',
					selected: true,
				},
				{
					label: '发送微信邀请函', // 只有未结账的订单才会有发邀请函
					icon: '/static/banquet/edit.png',
					value: 'wx-invitation',
					selected: true,
				},
			],
			sendMsgType: '0', //发送短信方式
			remarkText: '', //备注框 文字
			// isShowRemarkPopup: false, //是否展示remarkpopup
			// -------------------------------- 电话/单位 快捷搜索相关 -----------------------
			phoneSearchList: [], //快捷电话搜索的信息
			companySearchList: [], //快捷单位搜索的信息
		};
	},
	components: {
		uniNavBar,
		uniPopup,
	},
	onLoad(option) {
		let userInfo = this.$storage.getAppUserInfo();
		this._options = option;
		this.storage = {
			id: userInfo.id,
			storeId: userInfo.currentStoreId,
			cwCompanyID: userInfo.cwCompanyID,
		};
		this.creatorID = this.storage ? this.storage.id : '';
		this.initOption(option);
		if (!this.bookID) {
			this.isEdit = !this.bookID;
			this.init();
			this.rightMenuArr.forEach((menu, idx) => {
				menu.selected = false;
			});
		} else {
			uni.setNavigationBarTitle({
				title: '预订信息',
			});
			this.isEdit = !this.bookID;

			this.initArea(() => {
				this.areaTable.forEach((areaItem) => {
					areaItem.tableList.forEach((tableItem) => {
						if (tableItem.tableID == option.tableID) {
							this.curOrderTable = tableItem;
						}
					});
				});
				this.getOrderDetail((res) => {
					this.curOrder = {
						bookID: res.bookOrderID,
						bookOrderTypeID: res.bookOrderBookOrderTypeID,
						bookOrderTypeName: res.bookOrderTypeName,
						bookerName: res.bookerName,
						company: res.company,
						customerID: res.bookOrderCustomerID,
						customerName: res.customerName,
						cwCompanyID: res.bookOrderTypeCWCompanyID,
						fee: res.fee ? res.fee : '',
						orderRealAmount: res.orderRealAmount ? res.orderRealAmount : '',
						frontMoney: res.frontMoney ? res.frontMoney : '',
						imgUrl: res.imgUrl,
						isClose: res.isClose,
						isMaterial: res.isMaterial,
						isPayMateriaMoney: res.isPayMateriaMoney,
						mainOrderNo: res.mainOrderNo,
						marketer: res.marketer,
						materiaMoney: res.materiaMoney,
						paid: res.paid,
						phone: res.bookerPhone,
						picURL: res.picURL,
						status: res.status,
						statusStr: res.statusStr,
						willArrivedOn: res.willArrivedOn,
						habit: res.bookOrderHabit ? res.bookOrderHabit : '',
					};
					// 判断导航栏右上角展示的功能
					// isClose=0 fee=0 未结账
					// isClose=0，fee>0 待关单
					this.rightMenuArr.forEach((menu, idx) => {
						if (menu.value == 'wx-invitation') {
							// 只有未结账的订单才会有发邀请函
							menu.selected =
								this.isShowBtn && this.curOrder.fee == '' && this.curOrder.isClose == 0;
						}
						if (menu.value == 'wx-evaluation') {
							// 只有待关单的订单才有微信评价
							menu.selected =
								this.isShowBtn && this.curOrder.isClose == 0 && this.curOrder.fee > 0;
						}
					});
					if (option.isSearch) {
						this.bookInfo.customerID = option.customerID;
						this.bookInfo.bookerName = option.bookerName;
						this.bookInfo.bookerPhone = option.bookerPhone;
						this.bookInfo.company = option.company;
						this.isEdit = true;
					}
					this.getDinnerType();
					this.getMarketer(() => {
						this.getOrderType();
					});
				});
			});
		}
		//获取缓存发送短信方式
		if (!this.bookID) {
			this.sendMsgType = this.$storage.getBookNowMsgType() || '0';
		}
		this.$cw.getRecordsData(); //获取通讯录
	},
	onShow() { //接收搜索页面参数
		if (!this._.isEmpty(getApp().globalData.searchObj)) {
			this._options = getApp().globalData.searchObj;
			this.initOption(this._options);
			getApp().globalData.searchObj = {};
		}
	},
	computed: {
		// 已经选择的卓台
		alreadySelectTables() {
			let tempAreaTable = this.areaTable[0].selected ? [this.areaTable[0]] :
				this.areaTable;
			let list = this._(tempAreaTable)
				.flatMap((x) => x.tableList)
				.filter(
					(x) =>
					(!this.bookID && x.selected) ||
					(this.bookID && ~this.orderTableId.indexOf(x.tableID))
				)
				.uniqBy('tableID')
				.value();
			return list;
		},
		// 导航栏右侧动态菜单
		rightDynamicMenuArr() {
			return this.rightMenuArr.filter(v => v.selected === true);
		},
		// 当前区域桌台
		curTable() {
			return this.areaTable.filter(item => item.advance)[0];
		},
		// 当前区域桌台的copy
		curTableCopy() {
			let tableList = this.areaTableCopy.filter((item) => item.selected)[0];
			return tableList;
		},
		number() {
			let num = 0;
			let tempAreaTable = this.areaTable[0].selected ?
				this.areaTable.filter((v) => v.isAllArea) :
				this.areaTable.filter((v) => !v.isAllArea);
			tempAreaTable.forEach((item) => {
				num = num + item.tableList.filter((item) => item.selected).length;
			});
			// console.log(this.areaTable, tempAreaTable);
			return !num || num <= 9 ? `0${num}` : num;
		},
		orderTime() {
			let sel = this.dinnerType.filter((item) => item.selected)[0];
			return sel ? sel.times : null;
		},
		// 预订类型
		orderTypeName() {
			return this.orderType.map((item) => item.name);
		},
		// 销售经理
		marketerNames() {
			return this.marketList.map((item) => item.marketerName);
		},
		isApproveInAppBook() { //该门店的订单是否需要审核(审核订单默认不发送信息)
			return this.$cw.approveInAppBook();
		},
		isSelf() {
			return this.bookInfo.marketerID == this.$storage.getAppUserInfo().marketerId;
		},
		isCanEdit() { //是否有编辑权限 
			if (!this.bookID) return true;
			//是否可编辑自己的预订单，默认只能编辑单位、预订类型、备注字段，不能取消
			let isSelf = this.bookInfo.marketerID == this.$storage.getAppUserInfo().marketerId; //是否是自己的订单
			let isCanEditSelf = this.$cw.canEdit();
			//是否可编辑取消他人预订
			let isCanEditOther = this.$cw.canEditCancelOfOther();
			let bol = this.isEdit ? isSelf ? isCanEditSelf : isCanEditOther : false;
			return bol
		},
		//底部取消按钮控制
		isShowBtn() {
			let isSelf = this.bookInfo.marketerID == this.$storage.getAppUserInfo().marketerId; //是否是自己的订单
			let isCanEditSelf = this.$cw.canEdit(); // ;
			//是否可编辑取消他人预订
			let isCanEditOther = this.$cw.canEditCancelOfOther(); //;
			let bol = isSelf ? isCanEditSelf : isCanEditOther;
			return bol
		}
	},
	filters: {
		selArea(item) {
			return item.tableList.filter((item) => item.selected).length;
		},
		noOrderLength(item) {
			return item.tableList.filter((item) => item.orderList.length == 0).length;
		},
		selOrderNum(item, orderTableIds) {
			return item.tableList.filter((tableItem) => {
				return ~orderTableIds.indexOf(tableItem.tableID);
			}).length;
		},
	},
	methods: {
		...mapMutations(['setArea']),
		// ----------- methods导航栏 ------------------
		// 返回
		tapLeftFromNav() {
			uni.navigateBack({
				delta: 1,
			});
		},
		tapRightFromNav() {
			this.$refs.morePopup.open();
		},
		//底部弹窗中排除已预订的桌台 ，判断是否可以选桌台（没有订单或者只有待审核的订单）
		isCanSelect(list) {
			if (list.length == 0) {
				return true
			} else {
				let bol = this._.every(list, {
					status: 1
				});
				return bol;
			}
		},
		// 右侧按钮跳转到对应页面
		async seleMenu(item) {
			switch (item.value) {
				case 'wx-evaluation': // 发送微信评价
					if (this.$cw.isApp(true)) {
						let id = this.bookInfo.id;
						let shopId = storage.getAppUserInfo().currentStoreId;
						let shopName =
							storage.getAppUserInfo().businessName +
							'(' +
							this.$storage.getAppUserInfo().currentStoreName +
							')';
						let salerId = storage.getAppUserInfo().marketerId;
						let salerName = storage.getAppUserInfo().userName;
						// let title = '亲,' + shopName + '期待您的评价'
						// let desc = '亲,' + shopName + '期待您的评价'
						let title = '期待您对我们的服务做出评价';
						let desc = '期待您对我们的服务做出评价';
						// let imgUrl = this.$cw.ImgServerUrl + '/upload/img/20200211/1130373037_invitePic.png';
						let imgUrl = '';
						let int = this.$cw.weixinIntType;
						let webpageurl = 'https://mp.weixin.qq.com';
						let pagePath =
							'pages/myOrderSub/commentsDetail/commentsDetail?id=' +
							id +
							'&shopId=' +
							shopId +
							'&salerId=' +
							salerId +
							'&salerName=' +
							salerName;
						let bgData = {
							shareBgType: 5, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
							banquetOrderGUID: '', // 宴会单id
							banquetProjectGUID: '', // 宴会项目id
							banquetTaskGUID: '', // 宴会任务id
							bookOrderId: id, // 预订单id
						};
						// 获取动态imgUrl
						let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
						const {
							bgUrl
						} = result;
						imgUrl = bgUrl;
						console.log(
							`
								webpageurl: ${webpageurl},
								pagePath: ${pagePath},
								title: ${title},
								desc: ${desc},
								imgUrl: ${imgUrl},
								int: ${int}
							`
						);
						// 线上测试
						if (this.fee == 23333 && this.bookInfo.habit == '测试Lance') {
							alert(
								`
								webpageurl: ${webpageurl},
								pagePath: ${pagePath},
								title: ${title},
								desc: ${desc},
								imgUrl: ${imgUrl},
								int: ${int}
							`
							);
						}
						this.$cw.sendMiniPrograme(
							webpageurl,
							pagePath,
							title,
							desc,
							imgUrl,
							int
						);
					}
					break;
				case 'wx-invitation': // 发送微信邀请函
					let area = this.bookInfo.masterTableName;
					let id = this.bookInfo.id;
					if (area.length != 0) {
						if (area.match(/[\u4e00-\u9fa5]+/)) {
							let reg = /[\u4e00-\u9fa5]+/;
							area = reg.exec(area)[0];
						} else {
							area = '';
						}
					} else {
						console.log('没有数据'); // .net中就这么写的
					}
					let reg1 = /\d+/;
					// ["8010", index: 3, input: "杨春湖8010", groups: undefined]
					let tableNumberArr = reg1.exec(this.bookInfo.masterTableName) || [''];
					let table = tableNumberArr && tableNumberArr[0];
					let storename = storage.getAppUserInfo().currentStoreName;
					let date = moment(this.bookInfo.bookOn).format('YYYY-MM-DD');
					if (this.$cw.isApp(true)) {
						//    //let sendWeiXinInviteInfo = self.sendWeiXinInviteInfo
						let webpageurl = 'https://mp.weixin.qq.com';
						let pagePath =
							'pages/myOrderSub/Invite/Invite?isShare=yes&id=' +
							this.bookInfo.id;
						let title = '您已成功预订，期待您到来';
						let desc = '您已成功预订，期待您到来';
						// let imgUrl = this.$cw.ImgServerUrl + '/upload/img/20200211/1130373037_invitePic.png';
						let imgUrl = '';
						let int = this.$cw.weixinIntType;
						let bgData = {
							shareBgType: 5, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
							banquetOrderGUID: '', // 宴会单id
							banquetProjectGUID: '', // 宴会项目id
							banquetTaskGUID: '', // 宴会任务id
							bookOrderId: id, // 预订单id
						};
						// 获取动态imgUrl
						let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
						const {
							bgUrl
						} = result;
						imgUrl = bgUrl;
						console.log(
							`
								webpageurl: ${webpageurl},
								pagePath: ${pagePath},
								title: ${title},
								desc: ${desc},
								imgUrl: ${imgUrl},
								int: ${int}
							`
						);
						this.$cw.sendMiniPrograme(
							webpageurl,
							pagePath,
							title,
							desc,
							imgUrl,
							int
						);
					}
					break;
				default:
					break;
			}
			this.$refs.morePopup.close();
		},
		init() {
			this.initArea(() => {
				// 初始化预订桌数
				this.bookTableNum = parseInt(this.number);
				this.getDinnerType();
				this.getMarketer(() => {
					this.getOrderType();
				});
			});
		},
		// 初始化区域(
		// 不管有没有bookID传过来,都会进此方法;
		// 如果有bookID,区域只可能有一个(因为从一个桌台过来的)
		// 如果没有bookID,区域就有可能有多个(因为可以跨区域选择桌台)
		initArea(success) {
			let areaId;
			this.areaTable = this.getAreaTable();
			this.areaTable.forEach((areaItem) => {
				if (areaItem.selected) {
					areaId = areaItem.tableAreaID;
				}
			});
			this.getAreaAllOrder(areaId, success);
		},
		// 还原订单信息
		initBookInfo() {
			this.orderTableId = JSON.parse(JSON.stringify(this.editCopyOrderTIds));
			this.bookInfo = JSON.parse(JSON.stringify(this.copyBookInfo));
			this.pickerData = this.bookInfo.oredr[0].bookOn;
			this.bookNums = this.bookInfo.oredr[0].listOrderDay[0].bookNums;
			this.bookTableNum = this.bookInfo.oredr[0].listOrderDay[0].bookTableNum;
			this.fee = this.bookInfo.oredr[0].listOrderDay[0].fee;
			this.orderRealAmount = this.bookInfo.oredr[0].listOrderDay[0].orderRealAmount;
			this.frontMoney = this.bookInfo.oredr[0].listOrderDay[0].frontMoney;
			this.paid = this.bookInfo.oredr[0].listOrderDay[0].paid;
			this.marketList.forEach((item, index) => {
				if (item.marketerID == this.bookInfo.marketerID) {
					this.marketerIndex = index;
				}
			});
			this.dinnerType.forEach((item) => {
				if (item.diningTypeID == this.bookInfo.oredr[0].listOrderDay[0].type) {
					item.selected = true;
				} else {
					item.selected = false;
				}
			});
			this.orderType.forEach((item, index) => {
				if (item.bookOrderTypeID == this.bookInfo.bookOrderTypeID) {
					this.orderTypeIndex = index;
				}
			});
			//查看预订单时 选中之前已有的桌台
			this.areaTable.forEach(x => {
				x.tableList.forEach(item => {
					let n = this._(this.orderTableId).findIndex(em =>
						em == item.tableID
					);
					if (n != -1) {
						item.selected = true;
					} else {
						item.selected = false;
					}
				})
			})
		},
		initOption(option) {
			this.fromPage = option.fromPage;
			this.banquetId = option.banquetId;
			this.bookID = option.bookID;
			this.customerID = option.customerID ? option.customerID : '';
			this.bookInfo.bookerName = option.bookerName ?
				decodeURIComponent(option.bookerName) :
				'';
			this.bookInfo.customerID = option.customerID ? option.customerID : '';
			this.bookInfo.company = option.company ? option.company : '';
			this.bookInfo.companyID = option.companyID ? option.companyID : '';
			this.bookInfo.oredr[0].listOrderDay[0].type = option.dinnerType ?
				option.dinnerType :
				'';
			this.pickerData = option.bookOn ? option.bookOn : '';
			this.bookInfo.oredr[0].bookOn = this.pickerData + ' 00:00:00';
			// 如果从宴会详情过来,会拿到预订类型(丢弃,如果没删但能够正常工作,表示废弃代码)
			// this.bookInfo.bookOrderTypeID = option.banquetThemeTypeID ? option.banquetThemeTypeID : '';
			this.initMarketerID = option.marketerId;
			if (option.bookerPhone) {
				this.bookInfo.bookerPhone = option.bookerPhone;
				this.bookInfo.banquetOrderGUID = this.$cw.emptyToString(
					option.banquetId
				);
			} else {
				this.bookInfo.bookerPhone = '';
			}
			//从搜索页面进来 匹配客服池经理 有 默认显示客户经理 否者显示自己
			if (this.initMarketerID && this.marketList.some((item) => item.marketerID == this.initMarketerID)) {
				this.bookInfo.marketerID = this.initMarketerID;
				this.marketList.forEach((item, index) => {
					if (item.marketerID == this.initMarketerID) {
						this.marketerIndex = index;
						this.bookInfo.marketer = this.marketList[
							this.marketerIndex
						].marketerName;
					}
				});
				// console.log('有客户经理匹配后', this.bookInfo.marketer, this.marketerIndex)
			} else {
				// 没有客户经理则默认设置为当前登录人为客户经理，即使列表找不到也把当前登录人添加到客服列表中去
				const userInfo = this.$storage.getAppUserInfo();
				if (
					this.marketList.some(
						(item) => item.marketerID == userInfo.marketerId
					)
				) {
					// console.log('没有客户经理，列表有当前登陆人id')
					this.marketList.forEach((item, index) => {
						if (item.marketerID == userInfo.marketerId) {
							this.marketerIndex = index;
							this.bookInfo.marketer = this.marketList[
								this.marketerIndex
							].marketerName;
						}
					});
				} else {
					this.marketList.unshift({
						marketerID: userInfo.marketerId,
						marketerName: userInfo.userName,
					});
					this.bookInfo.marketerID = this.marketList[0].marketerID;
					this.bookInfo.marketer = this.marketList[0].marketerName;
				}
			}
		},
		goCustomInfo(bookInfo) {
			if (
				bookInfo.customerID !== '' &&
				typeof bookInfo.customerID !== 'undefined' &&
				bookInfo.customerID != 'null'
			) {
				this.$cw.gotoCustomInfo(bookInfo.customerID, 'bookNow');
			}
		},
		getAreaTable() {
			return JSON.parse(JSON.stringify(this.$store.state.area));
		},
		async getAreaAllOrder(areaID, success, copy) {
			let areaIDs = [];
			// 选择桌台时copy才会为true,其他情况都为false
			let allArea = copy ? this.areaTableCopy : this.areaTable;
			if (areaID == 'TA00000000000') {
				areaIDs = allArea.map(x => x.tableAreaID);
			} else {
				areaIDs.push(areaID);
			}

			let bookOn = ~this.bookInfo.oredr[0].bookOn.indexOf('00:00:00') ?
				this.bookInfo.oredr[0].bookOn :
				this.bookInfo.oredr[0].bookOn + ' 00:00:00';
			let res = await CY08.GetTabelInApp({
				areaID: areaIDs,
				bookOn: bookOn,
				type: this.bookInfo.oredr[0].listOrderDay[0].type,
				storeID: this.storage.storeId,
				isGetOrder: 1,
			}, false, false, null);

			// 请求的桌子展平
			const allTable = this._(res.areaTable).flatMap(x => x.datalist).value();
			allArea.forEach((areaItem) => {
				areaItem.tableList.forEach((tableItem) => {
					let findTableItem = allTable.find(x => x.tableID == tableItem.tableID);
					if (findTableItem) {
						tableItem.orderList = findTableItem.orderList;
					}
				});
			});
			!copy && this.setArea(this.areaTable);
			success && success();
		},
		// 获取销售经理
		async getMarketer(success) {
			let data = {
				pageIndex: 1,
				pageSize: 99999,
				order: 'MarketerStoreID asc',
				filter: {
					conditions: [{
							attribute: 'StoreID',
							datatype: 'nvarchar',
							operatoer: 'eq',
							value: this.storage.storeId,
						}
					],
					type: 'and',
				},
				select: 'new(MarketerID,MarketerName,DefaultType)',
			};
			let res = await CY18.GetViewPageSelect(data, null, false);
			// 看列表中有没有当前登录用户,如果没有加上去
			let curUser = res.dataList.filter(
				(v) => v.marketerID == this.$storage.getAppUserInfo().marketerId
			);
			if (!curUser[0]) {
				res.dataList.push({
					marketerID: this.$storage.getAppUserInfo().marketerId,
					marketerName: this.$storage.getAppUserInfo().userName,
					defaultType: null,
				});
			}
			this.marketList = res.dataList;

			// options有没有传过marketerID,传了就有initMarketerID
			if (this.initMarketerID) {
				if (
					this.marketList.some((item) => item.marketerID == this.initMarketerID)
				) {
					this.bookInfo.marketerID = this.initMarketerID;
					this.marketList.forEach((item, index) => {
						if (item.marketerID == this.initMarketerID) {
							this.marketerIndex = index;
							this.bookInfo.marketer = this.marketList[
								this.marketerIndex
							].marketerName;
						}
					});
				} else {
					// 没有客户经理则默认设置为当前登录人为客户经理，即使列表找不到也把当前登录人添加到客服列表中去
					const userInfo = this.$storage.getAppUserInfo();
					if (
						this.marketList.some(
							(item) => item.marketerID == userInfo.marketerId
						)
					) {
						this.marketList.forEach((item, index) => {
							if (item.marketerID == userInfo.marketerId) {
								this.marketerIndex = index;
								this.bookInfo.marketer = this.marketList[
									this.marketerIndex
								].marketerName;
							}
						});
					} else {
						this.marketList.unshift({
							marketerID: userInfo.marketerId,
							marketerName: userInfo.userName,
						});
						this.bookInfo.marketerID = this.marketList[0].marketerID;
						this.bookInfo.marketer = this.marketList[0].marketerName;
					}
				}
			} else {
				if (!this.bookID) {
					// 没有客户经理则默认设置为当前登录人为客户经理，即使列表找不到也把当前登录人添加到客服列表中去
					const userInfo = this.$storage.getAppUserInfo();
					if (
						this.marketList.some(
							(item) => item.marketerID == userInfo.marketerId
						)
					) {
						this.marketList.forEach((item, index) => {
							if (item.marketerID == userInfo.marketerId) {
								this.marketerIndex = index;
								this.bookInfo.marketer = this.marketList[
									this.marketerIndex
								].marketerName;
								// SW 把当前用户设置给 bookInfo.marketerID,让预订的时候,预订类型默认显示当前用户之前设置的类型
								this.bookInfo.marketerID = this.marketList[
									this.marketerIndex
								].marketerID;
							}
						});
					} else {
						this.marketList.unshift({
							marketerID: userInfo.marketerId,
							marketerName: userInfo.userName,
						});
						this.bookInfo.marketerID = this.marketList[0].marketerID;
						this.bookInfo.marketer = this.marketList[0].marketerName;
					}
				} else {
					// 如果客户经理被禁用那么也需要展示 那么要把订单的销售经理展示出来
					let marketIndex= this.marketList.findIndex(x=>x.marketerID==this.bookInfo.marketerID);
					if(marketIndex==-1){
						this.marketList.unshift({
							marketerID: this.bookInfo.marketerID,
							marketerName: this.bookInfo.marketer,
						});
						// 设置订单客户经理默认index 为0
						marketIndex=0;
					}
					
					this.marketerIndex = marketIndex;
					
				}
			}
			success && success();
		},
		// 获取餐别
		async getDinnerType() {
			let data = {
				cwCompanyID: this.storage.cwCompanyID,
				storeID: this.storage.storeId,
				tableModel: this.orderTableId,
			};
			let res = await CY23.GetDiningTypeInApp(data, null, null, false);
			res.diningTypes.forEach((item) => {
				item.selected = false;
				if (item.diningTypeID == this.bookInfo.oredr[0].listOrderDay[0].type) {
					item.selected = true;
					this.bookInfo.oredr[0].listOrderDay[0].willArrivedOn = item.time;
				}
				item.time = [item.time];
			});
			this.dinnerType = res.diningTypes;
		},
		// 获取预订类型
		async getOrderType() {
			let data = {
				pageIndex: 1,
				pageSize: 999999,
				order: 'sort asc ',
				select: 'new(bookOrderTypeID, name)',
				filter: {
					type: 'and',
					conditions: [{
						attribute: 'storeId',
						datatype: 'nvarchar',
						operatoer: 'eq',
						value: this.storage.storeId,
					}],
				},
			};
			let res = await CY26.GetViewPageSelect(data, null, null, false);
			//
			this.orderType = res.dataList;
			// 没有bookID时,给默认值
			if (!this.bookID) {
				// 宴会详情过来会带上banquetThemeTypeID,优先级比客户经理的高
				if (this._options.banquetThemeTypeID) {
					this.bookInfo.bookOrderTypeID = this._options.banquetThemeTypeID;
					this.orderType.forEach((item, index) => {
						if (item.bookOrderTypeID == this.bookInfo.bookOrderTypeID) {
							this.orderTypeIndex = index;
						}
					});
					return;
				}
				// 如果有客户经理,就找客户经理配置的默认预订类型
				// let marketItem = this.marketList.find(
				// 	(item) => item.marketerID == this.bookInfo.marketerID
				// );
				// if (marketItem && marketItem.defaultType) {
				// 	this.orderType.forEach((item, index) => {
				// 		if (item.bookOrderTypeID == marketItem.defaultType) {
				// 			this.bookInfo.bookOrderTypeID = item.bookOrderTypeID;
				// 			this.orderTypeIndex = index;
				// 		}
				// 	});
				// } else {
				// 	// 否则取第一个
				// 	this.bookInfo.bookOrderTypeID = this.orderType[0].bookOrderTypeID;
				// }
			} else {
				this.orderType.forEach((item, index) => {
					if (item.bookOrderTypeID == this.bookInfo.bookOrderTypeID) {
						this.orderTypeIndex = index;
					}
				});
			}
		},
		// 获取餐别的订单
		async getOrderDetail(success) {
			if (!this.bookID) return;
			let res = await CY20.GetOrderInfo({
				orderID: this.bookID,
			});
			this.bookInfo.id = res.bookOrderID;
			this.bookInfo.customerID = res.bookOrderCustomerID;
			this.bookInfo.bookerName = res.bookerName;
			this.bookInfo.bookerPhone = res.bookerPhone;
			this.bookInfo.masterTableID = res.masterTableID;
			this.bookInfo.masterTableName = res.masterTableName;
			this.bookInfo.company = res.bookOrderCompany ? res.bookOrderCompany : '';
			this.bookInfo.marketerID = res.bookOrderMarketerID;
			this.bookInfo.marketer = res.bookOrderMarketer;
			this.bookInfo.storeID = res.tableAreaStoreID;
			this.bookInfo.cwCompanyID = res.tableAreaCWCompanyID;
			this.bookInfo.bookOrderTypeID = res.bookOrderBookOrderTypeID;
			this.bookInfo.willArrivedOn = res.willArrivedOn;
			this.sendMsgType = res.sendMsgType;
			if (this.orderType) {
				this.orderType.forEach((item, index) => {
					if (item.bookOrderTypeID == this.bookInfo.bookOrderTypeID) {
						this.orderTypeIndex = index;
					}
				});
			}
			this.bookInfo.habit = res.bookOrderHabit ? res.bookOrderHabit : '';
			this.bookInfo.oredr = [{
				bookOn: res.bookOn ? res.bookOn.split(' ')[0] : '',
				listOrderDay: [{
					paid: res.paid ? res.paid : '',
					type: res.bookOrderType,
					willArrivedOn: res.willArrivedOn,
					bookNums: res.bookNums,
					fee: res.fee ? res.fee : '',
					orderRealAmount: res.orderRealAmount ? res.orderRealAmount : '',
					frontMoney: res.frontMoney ? res.frontMoney : '',
					bookTableNum: res.bookTableNum,
				}, ],
			}, ];
			this.bookInfo.bookTable = res.orderTableList;

			this.copyBookInfo = JSON.parse(JSON.stringify(this.bookInfo));
			this.pickerData = this.bookInfo.oredr[0].bookOn;
			this.bookNums = this.bookInfo.oredr[0].listOrderDay[0].bookNums;
			this.bookTableNum = this.bookInfo.oredr[0].listOrderDay[0].bookTableNum;
			this.fee = this.bookInfo.oredr[0].listOrderDay[0].fee;
			this.orderRealAmount = this.bookInfo.oredr[0].listOrderDay[0].orderRealAmount;
			this.frontMoney = this.bookInfo.oredr[0].listOrderDay[0].frontMoney;
			this.paid = this.bookInfo.oredr[0].listOrderDay[0].paid;

			let tableIds = [];
			res.orderTableList.forEach((tableItem) => {
				tableIds.push(tableItem.tableID);
			});
			this.orderTableId = tableIds;
			this.editCopyOrderTIds = JSON.parse(JSON.stringify(this.orderTableId));

			// 判断导航栏右上角展示的功能
			// isClose=0 fee=0 未结账
			// isClose=0，fee>0 待关单
			this.rightMenuArr.forEach((menu, idx) => {
				if (menu.value == 'wx-invitation') {
					// 只有未结账的订单才会有发邀请函
					menu.selected =
						this.isShowBtn && res.fee == '' && res.isClose == 0;
				}
				if (menu.value == 'wx-evaluation') {
					// 只有待关单的订单才有微信评价
					menu.selected =
						this.isShowBtn && res.isClose == 0 && res.fee > 0;
				}
			});
			success && success(res);
		},
		// 改变预订单状态
		async UpdateByDto(status) {
			let data = {
				id: this.curOrder.bookID,
				status: status,
			};
			let res = await CY20.UpdateByDto(data);
			this.areaTable.forEach((areaItem) => {
				areaItem.tableList.forEach((tableItem) => {
					tableItem.orderList.forEach((orderItem) => {
						if (orderItem.bookID == res.id) {
							orderItem.status = 3;
							// 解决 watch 监听 areaTable 改变时,tableList的selected全部为false导致 bookTabelNum为0的bug
							this.$nextTick(() => {
								this.bookTableNum = res.bookTableNum;
							});
							this.curOrder = orderItem;
						}
					});
				});
			});
			uni.showToast({
				title: '成功到店！',
				duration: 2000,
			});

			this.setArea(this.areaTable);
		},
		// 修改订单
		async changeOrder() {
			if (this.fee == 0 && this.orderRealAmount > 0) { //应付金额为0  实付金额不为0时  把实付金额赋给应付金额
				this.fee = this.orderRealAmount;
			}
			this.bookInfo.oredr[0].listOrderDay[0].bookNums = this.bookNums;
			this.bookInfo.oredr[0].listOrderDay[0].bookTableNum = this.bookTableNum;
			this.bookInfo.oredr[0].listOrderDay[0].fee = this.fee ? this.fee : '';
			this.bookInfo.oredr[0].listOrderDay[0].orderRealAmount = this
				.orderRealAmount ?
				this.orderRealAmount :
				'';
			this.bookInfo.oredr[0].listOrderDay[0].paid = this.paid;
			this.bookInfo.oredr[0].listOrderDay[0].frontMoney = this.frontMoney ?
				this.frontMoney :
				'';
			this.bookInfo.bookTable = [];

			// 如果不是全部就排除全部
			let tempAreaTable = this.areaTable[0].isAllArea ?
				this.areaTable.filter((v) => v.isAllArea) :
				this.areaTable.filter((v) => !v.isAllArea);

			tempAreaTable.forEach((areaItem) => {
				areaItem.tableList.forEach((tableItem) => {
					if (~this.orderTableId.indexOf(tableItem.tableID)) {
						this.bookInfo.bookTable.push({
							tableID: tableItem.tableID,
							tableName: tableItem.tableName,
						});
					}
				});
			});
			let data = {
				id: this.bookInfo.id,
				customerID: this.bookInfo.customerID,
				bookerName: this.bookInfo.bookerName,
				company: this.bookInfo.company,
				bookerPhone: this.bookInfo.bookerPhone,
				bookOn: '',
				type: this.bookInfo.oredr[0].listOrderDay[0].type,
				bookOrderTypeID: this.bookInfo.bookOrderTypeID,
				masterTableID: this.bookInfo.bookTable[0] ?
					this.bookInfo.bookTable[0].tableID : '',
				masterTableName: this.bookInfo.bookTable[0] ?
					this.bookInfo.bookTable[0].tableName : '',
				bookNums: this.bookInfo.oredr[0].listOrderDay[0].bookNums,
				bookTableNum: this.bookInfo.oredr[0].listOrderDay[0].bookTableNum,
				fee: this.bookInfo.oredr[0].listOrderDay[0].fee,
				orderRealAmount: this.bookInfo.oredr[0].listOrderDay[0].orderRealAmount,
				paid: this.bookInfo.oredr[0].listOrderDay[0].paid,
				frontMoney: this.bookInfo.oredr[0].listOrderDay[0].frontMoney,
				habit: this.bookInfo.habit,
				marketerID: this.bookInfo.marketerID,
				marketer: this.bookInfo.marketer,
				tableList: this.bookInfo.bookTable,
				willArrivedOn: this.bookInfo.oredr[0].listOrderDay[0].willArrivedOn,
			};
			if (~this.bookInfo.oredr[0].bookOn.indexOf('00:00:00')) {
				data.bookOn = this.bookInfo.oredr[0].bookOn;
			} else {
				data.bookOn = this.bookInfo.oredr[0].bookOn + ' 00:00:00';
			}
			let res = await CY20.UpdateOrder(data);
			this.isEdit = false;
			await uni.showToast({
				title: '修改成功!'
			});
			
			// 刷新预订列表
			uni.$emit('todayBookRefresh', 'refresh');
			
			// 暂不考虑 换桌台联动的情况
			// setTimeout(()=>this.goBackPage(),2000)
			
			// const changeArea = (res) => {
			// 	this.bookInfo.willArrivedOn = res.willArrivedOn;
			// 	// if (this.isShowRemarkPopup) {
			// 	// 	this.$refs.remarkPopup.close();
			// 	// 	this.isShowRemarkPopup = false;
			// 	// }
			// 	return {
			// 		bookID: res.bookOrderID,
			// 		bookOrderTypeID: res.bookOrderTypeBookOrderTypeID,
			// 		bookOrderTypeName: res.bookOrderTypeName,
			// 		bookerName: res.bookerName,
			// 		company: res.company,
			// 		customerID: res.bookOrderCustomerID,
			// 		customerName: res.customerName,
			// 		cwCompanyID: res.bookOrderTypeCWCompanyID,
			// 		fee: res.fee,
			// 		frontMoney: res.frontMoney,
			// 		imgUrl: res.imgUrl,
			// 		isClose: res.isClose,
			// 		isMaterial: res.isMaterial,
			// 		isPayMateriaMoney: res.isPayMateriaMoney,
			// 		mainOrderNo: res.mainOrderNo,
			// 		marketer: res.bookOrderMarketer,
			// 		materiaMoney: res.materiaMoney,
			// 		paid: res.paid,
			// 		phone: res.customerPhone,
			// 		picURL: res.picURL,
			// 		status: res.status,
			// 		willArrivedOn: res.willArrivedOn,
			// 	};
			// };

			// this.areaTable.forEach((areaItem) => {
			// 	areaItem.tableList.forEach((tableItem) => {
			// 		let existOrderIndex = tableItem.orderList.findIndex((orderItem) => {
			// 			return orderItem.bookID == res.bookOrderID;
			// 		});
			// 		let existTableIndex = res.orderTableList.findIndex(
			// 			(orderTableLItem) => {
			// 				return orderTableLItem.tableID == tableItem.tableID;
			// 			}
			// 		);
			// 		if (existOrderIndex == -1) {
			// 			if (existTableIndex > -1) {
			// 				tableItem.orderList.push(changeArea(res));
			// 			}
			// 		} else {
			// 			if (existTableIndex > -1) {
			// 				tableItem.orderList[existOrderIndex] = changeArea(res);
			// 				this.curOrder = tableItem.orderList[existOrderIndex];
			// 			} else {
			// 				let deleIndex = tableItem.orderList.findIndex((orderItem) => {
			// 					return orderItem.bookID == res.bookOrderID;
			// 				});
			// 				deleIndex != -1 && tableItem.orderList.splice(deleIndex, 1);
			// 			}
			// 		}
			// 	});
			// });
			// this.setArea(this.areaTable);
		},
		searchTelPhone() {
			if (!this.isCanEdit) return;
			this.$util.baiduEvent('客户搜索', '立即预订页顶部客户搜索');
			let bookOn;
			let bookID;
			if (this.curOrder.bookID) {
				bookID = this.curOrder.bookID;
			} else {
				if (this.curOrder.bookOrderID) {
					bookID = this.curOrder.bookOrderID;
				} else {
					bookID = '';
				}
			}
			let type = this.bookInfo.oredr[0].listOrderDay[0].type ?
				this.bookInfo.oredr[0].listOrderDay[0].type :
				'';
			if (~this.bookInfo.oredr[0].bookOn.indexOf('00:00:00')) {
				bookOn = this.bookInfo.oredr[0].bookOn.split(' ')[0];
			} else {
				bookOn = this.bookInfo.oredr[0].bookOn;
			}
			uni.navigateTo({
				url: `/pages/_common/searchRecord/searchRecord?bookID=${bookID}&bookOn=${bookOn}&dinnerType=${type}`,
			});
		},
		plus(data) {
			if (this.bookID && !this.isEdit) return;
			this[data]++;
		},
		minus(data) {
			if (this.bookID && !this.isEdit) return;
			this[data] > 0 && this[data]--;
		},
		selDinnerType(index) {
			if (this.bookID && !this.isCanEdit) return;
			this.dinnerType.forEach((item) => (item.selected = false));
			this.dinnerType[index].selected = true;
			this.orderTimeIndex = 0; //改变预订餐别选择时间默认显示第一个
			this.bookInfo.oredr[0].listOrderDay[0].type = this.dinnerType[
				index
			].diningTypeID;
			this.bookInfo.oredr[0].listOrderDay[0].willArrivedOn = this.dinnerType[
				index
			].times[0];
		},
		// 选择日期
		chooseDate(e) {
			this.pickerData = e.target.value;
			this.bookInfo.oredr[0].bookOn = this.pickerData + ' 00:00:00';
		},
		// 选择预订时间
		selOrderTime(event) {
			this.orderTimeIndex = event.detail.value;
			this.bookInfo.oredr[0].listOrderDay[0].willArrivedOn = this.orderTime[
				this.orderTimeIndex
			];
		},
		// 选择桌台
		selectTable(item) {
			item.selected = !item.selected;
			//
			// 如果当前是全部，就同步其他各区域全部中选中的
			if (this.areaTable[0].selected) {
				this.areaTable
					.filter((v) => !v.isAllArea)
					.forEach((area) => {
						area.tableList.forEach((table) => {
							if (table.tableID == item.tableID) {
								table.selected = item.selected;
							}
						});
					});
				// console.log(this.areaTable);
			} else {
				// 否则在全部中，找这个桌台，改为selected
				// console.log('不是全部');
				this.areaTable
					.filter((v) => v.isAllArea)[0]
					.tableList.forEach((table) => {
						if (table.tableID == item.tableID) {
							table.selected = item.selected;
						}
					});
			}
			this.setArea(this.areaTable);
		},
		// 选择预订类型
		selOrderType(event) {
			this.orderTypeIndex = event.detail.value;
			this.bookInfo.bookOrderTypeID = this.orderType[
				this.orderTypeIndex
			].bookOrderTypeID;
		},
		// 选择销售经理
		selMarket(event) {
			this.$util.baiduEvent('更换销售经理', '立即预订页中部更换销售经理');
			this.marketerIndex = event.detail.value;
			this.bookInfo.marketerID = this.marketList[this.marketerIndex].marketerID;
			this.bookInfo.marketer = this.marketList[this.marketerIndex].marketerName;
			let marketItem = this.marketList.find(
				(item) => item.marketerID == this.bookInfo.marketerID
			);
			// if (marketItem.defaultType) {
			// 	this.orderType.forEach((item, index) => {
			// 		if (item.bookOrderTypeID == marketItem.defaultType) {
			// 			this.bookInfo.bookOrderTypeID = item.bookOrderTypeID;
			// 			this.orderTypeIndex = index;
			// 		}
			// 	});
			// }
		},
		// 选择金额
		selectOrderFee(event) {
			if (this.bookID && !this.isEdit) return;
			if (event.detail.value[0]) {
				this.paid = +event.detail.value[0];
			} else {
				this.paid = 0;
			}
		},
		// 取消选择
		delSelect(item) {
			if (this.bookID && !this.isEdit) return;

			// if (!this.bookID) {
			item.selected = false;
			// if (this.areaTable[0].selected) {
			this.areaTable
				// .filter((v) => !v.isAllArea)
				.forEach((area) => {
					area.tableList.forEach((table) => {
						if (table.tableID == item.tableID) {
							// console.log("table", table);
							table.selected = false;
						}
					});
				});
			// console.log(this.areaTable);
			// } else {
			// // 否则在全部中，找这个桌台，改为selected
			// console.log('不是全部');
			// this.areaTable
			// 	.filter((v) => v.isAllArea)[0]
			// 	.tableList.forEach((table) => {
			// 		if (table.tableID == item.tableID) {
			// 			table.selected = false;
			// 		}
			// 	});
			// }
			this.setArea(this.areaTable);
			// } else {
			if (this.bookID) {
				if (this.orderTableId.length == 1) return;
				let index = this.orderTableId.indexOf(item.tableID);
				this.orderTableId.splice(index, 1);
			}
			// }
		},
		// 桌台选择面板弹出
		tablePanelShow() {
			if (this.bookID && !this.isEdit) return;
			this.$refs.popup.open();
			this.tablePanel = true;
			this.areaTableCopy = JSON.parse(JSON.stringify(this.areaTable));
			if (this.bookID) {
				this.copyOrderTableId = JSON.parse(JSON.stringify(this.orderTableId));
				//查看预订单时 选中之前已有的桌台
				this.areaTableCopy.forEach(x => {
					x.tableList.forEach(item => {
						let n = this._(this.copyOrderTableId).findIndex(em =>
							em == item.tableID
						);
						if (n != -1) {
							item.selected = true;
						}
					})
				})
			}

		},
		// 选择区域(uni-pop弹窗才会选择)
		selectArea(item) {
			this.getAreaAllOrder(
				item.tableAreaID,
				() => {
					this.areaTableCopy.forEach((areaItem) => {
						areaItem.selected = false;
					});
					item.selected = true;
				},
				true
			);
		},
		// 选择桌台(uni-pop新增才会选择)
		selectAreaTa(item) {
			item.selected = !item.selected;
			// 同步全部or其他桌台下的当前桌台
			if (this.areaTableCopy[0].selected) {
				// console.log('是全部');
				//
				let notAll = this.areaTableCopy.filter((v) => !v.isAllArea);
				// console.log(notAll);
				notAll.forEach((area) => {
					area.tableList.forEach((table) => {
						if (table.tableID == item.tableID) {
							table.selected = item.selected;
						}
					});
				});
				// console.log(this.areaTableCopy);
			} else {
				// 否则在全部中，找这个桌台，改为selected
				// console.log('不是全部');
				let all = this.areaTableCopy.filter((v) => v.isAllArea)[0];
				// console.log(all);
				all.tableList.forEach((table) => {
					if (table.tableID == item.tableID) {
						table.selected = item.selected;
					}
				});
			}
			// this.setArea(this.areaTableCopy);
		},
		// 取消桌台选择面板
		tableSelCancel() {
			this.$refs.popup.close();
		},
		// 确认桌台选择面板
		tableSelConfirm() {
			this.$refs.popup.close();
			this.areaTable = this.areaTableCopy;
			this.setArea(this.areaTable);
			this.bookID && (this.orderTableId = this.copyOrderTableId);
		},
		// 新增预订单
		async confirm() {
			let that = this;
			if (!this.bookInfo.bookerPhone) {
				this.$cw.showError('请输入电话！');
				return;
			}
			if (!this.checkMobile(this.bookInfo.bookerPhone)) {
				this.$cw.showError('手机号格式错误！');
				return;
			}
			if (!this.bookInfo.bookerName) {
				this.$cw.showError('请输入姓名！');
				return;
			}
			if (!this.bookInfo.bookOrderTypeID) {
				this.$cw.showError('请选择预订类型！');
				return;
			}
			if (!this.bookNums || this.bookNums == 0) {
				this.$cw.showError('人数不能为0！');
				return;
			}
			if (!this.bookTableNum || this.bookTableNum == 0) {
				this.$cw.showError('桌数不能为0！');
				return;
			}
			if (this.bookTableNum && this.alreadySelectTables.length == 0) {
				this.$cw.showError('请至少选择一个桌台');
				return;
			}
			let [error, res] = await uni.showModal({
				title: '确认预订吗？'
			});
			if (res.confirm) {
				if (this.fee == 0 && this.orderRealAmount > 0) { //应付金额为0  实付金额不为0时  把实付金额赋给应付金额
					this.fee = this.orderRealAmount;
				}
				that.bookInfo.creatorID = that.creatorID;
				that.bookInfo.checkerID = that.creatorID;
				that.bookInfo.oredr[0].listOrderDay[0].bookNums = that.bookNums;
				that.bookInfo.oredr[0].listOrderDay[0].bookTableNum = that.bookTableNum;
				that.bookInfo.oredr[0].listOrderDay[0].fee = that.fee;
				that.bookInfo.oredr[0].listOrderDay[0].orderRealAmount = that.orderRealAmount;
				that.bookInfo.oredr[0].listOrderDay[0].paid = that.paid;
				that.bookInfo.oredr[0].listOrderDay[0].frontMoney = that.frontMoney;
				// 如果不是全部就排除全部
				let tempAreaTable = that.areaTable[0].isAllArea ?
					that.areaTable.filter((v) => v.isAllArea) :
					that.areaTable.filter((v) => !v.isAllArea);

				that.bookInfo.bookTable = [];
				let selectTables = that.alreadySelectTables.map(x => ({
					tableID: x.tableID,
					tableName: x.tableName,
				}));

				that.bookInfo.bookTable = that.bookInfo.bookTable.concat(selectTables);

				that.bookInfo.masterTableID = that.bookInfo.bookTable[0] ?
					that.bookInfo.bookTable[0].tableID :
					'';
				that.bookInfo.masterTableName = that.bookInfo.bookTable[0] ?
					that.bookInfo.bookTable[0].tableName :
					'';
				that.bookInfo.storeID = that.storage.storeId;
				that.bookInfo.cwCompanyID = that.storage.cwCompanyID;
				that.bookInfo.customerID = that.customerID;
				that.bookInfo.sendMsgType = that.isApproveInAppBook ? 0 : that.sendMsgType; //发送短信方式(需要审核时 默认不发送短信)
				that.bookInfo.enablePay = that.frontMoney > 0 ? 1 : 0; //是否支付定金（app比商户少一步支付定金操作；暂定：只要输入定金就是定金已支付状态）
				that.bookInfo.status = that.isApproveInAppBook ? 1 : 2;
				let data = that.bookInfo;
				let res = await CY20.CreateOrder(data);
				if (res) {
					// 桌子已被预订
					if (res.error) {
						that.$cw.showError(res.error.message);
						return;
					}
					// 通知 reserve 清空 selectTable 的桌台选择
					uni.$emit('clearCurSelectedTable');
					
					// banquetDetail来源:banquetDetail点击[立即预订]传给selectTable,selectTable将其参数保存到vuex的bookerInfo带给bookNow
					//选择是否添加联系人 只添加安卓 
					let name = that.bookInfo.bookerName;
					let phone = that.bookInfo.bookerPhone;
					if (that.$cw.isApp(false) && !this._.isEmpty(getApp().globalData.recordsData) && (that.$cw.isAndroid() || (that.$cw
							.isiOS() && getApp().globalData.isIOSAddressAuth)) && !that._.has(getApp().globalData.recordsData, phone)) {
						let [errorCall, resCall] = await uni.showModal({
							title: '该客户不在手机通讯录，是否保存到通讯录？'
						});
						if (resCall.confirm) {
							that.$cw.insertPhone(name, phone, async (res) => {
								if (res == 'success') {
									//跟新联系人
									getApp().globalData.recordsData[phone] = name;
									await uni.showToast({
										title: '添加成功!'
									});
									that.goBackPage(res.msgContent)
									// 读取本机当前用户的通讯录名称
								} else {
									that.$cw.showError(res);
								}
							});
						} else {
							that.goBackPage(res.msgContent)
						}
					} else {
						that.goBackPage(res.msgContent);
					}

				} else {
					// 通知 reserve 清空 selectTable 的桌台选择
					uni.$emit('clearCurSelectedTable');
				}
			}
		},
		goBackPage(msgContent) { //页面跳转
			debugger;
			if (this.fromPage == 'banquetDetail') {
				const url =
					`/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.banquetId}&banquetInfoSelected=0`;
				uni.navigateTo({
					url,
				});

			} else {
				if (msgContent) {
					//发送微信需要调用公用接口
					this.$cw.sendWeixinText(msgContent, this.bookInfo.bookerPhone);
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						})
					}, 500);
				} else {
					uni.navigateBack({delta: 1});
				}
			}
		},
		/**         预订编辑            **/
		// 获取预订单被选桌台
		getOrderTableId(bookID) {
			if (!bookID) return [];
			let tableIDs = [];
			// 如果不是全部就排除全部
			let tempAreaTable = this.areaTable[0].isAllArea ?
				this.areaTable.filter((v) => v.isAllArea) :
				this.areaTable.filter((v) => !v.isAllArea);
			// console.log(tempAreaTable);
			tempAreaTable.forEach((areaItem) => {
				areaItem.tableList.forEach((tableItem) => {
					let boolean;
					tableItem.orderList.forEach((orderItem) => {
						if (bookID == orderItem.bookID) {
							boolean = true;
							this.curOrder = orderItem;
						}
					});
					if (boolean) {
						tableIDs.push(tableItem.tableID);
					}
				});
			});
			return tableIDs;
		},
		// 选择预订桌台
		selectOrderTable(item) {
			if (this.isEdit) return;
			this.curOrderTable = item;
			this.orderTableId = [];
			if (this.bookID != item.orderList[0].bookID) {
				this.bookID = item.orderList[0].bookID;
				this.getOrderDetail();
			}
			this.curOrder = item.orderList[0];
			this.orderTableId = this.getOrderTableId(item.orderList[0].bookID);
		},
		// 预订桌台class
		orderTableClass(table) {
			let className;
			let orderItem = table.orderList[0];
			if (orderItem) {
				switch (orderItem.status) {
					case 1:
						className = 'bookNow-orderItem bookNow-audit';
						table &&
							~this.orderTableId.indexOf(table.tableID) &&
							(className = className + ' bookNow-orderSel');
						break;
					case 2:
						className = 'bookNow-orderItem bookNow-reserve';
						table &&
							~this.orderTableId.indexOf(table.tableID) &&
							(className = className + ' bookNow-orderSel');
						break;
					case 3:
						className = 'bookNow-orderItem bookNow-arrive';
						table &&
							~this.orderTableId.indexOf(table.tableID) &&
							(className = className + ' bookNow-orderSel');
						break;
					case 4:
						className = 'bookNow-orderItem bookNow-close';
						table &&
							~this.orderTableId.indexOf(table.tableID) &&
							(className = className + ' bookNow-orderSel');
						break;
					default:
						break;
				}
				if (orderItem.isClose == 1) {
					className = 'bookNow-orderItem bookNow-close';
					table &&
						~this.orderTableId.indexOf(table.tableID) &&
						(className = className + ' bookNow-orderSel');
				} else if (orderItem.status != 1 && orderItem.fee > 0) { //待审核订单可以输入金额
					className = 'bookNow-orderItem bookNow-purchase';
					table &&
						~this.orderTableId.indexOf(table.tableID) &&
						(className = className + ' bookNow-orderSel');
				}
			} else {
				table &&
					~this.orderTableId.indexOf(table.tableID) &&
					(className = 'bookNow-orderItem bookNow-reserve bookNow-orderSel');
			}
			return className;
		},
		// 选择桌台
		selectOrderTa(item) {
			item.selected = !item.selected;
			let index = this.copyOrderTableId.indexOf(item.tableID);
			if (~index) {
				// 找到了，就删除
				// console.log(~index);
				if (this.copyOrderTableId.length == 1) return;
				this.copyOrderTableId.splice(index, 1);

				// if (this.areaTableCopy[0].selected) {
				// 	this.areaTableCopy.filter(v => !v.isAllArea).forEach(area => {
				// 		area.tableList.forEach(table => {
				// 			if (table.tableID == item.tableID) {
				// 				table.selected = item.selected;
				// 			}
				// 		})
				// 	});
				// 	console.log(this.areaTableCopy);
				// } else { // 否则在全部中，找这个桌台，改为selected
				// 	console.log('不是全部')
				// 	this.areaTableCopy.filter(v => v.isAllArea)[0].tableList.forEach(table => {
				// 		if (table.tableID == item.tableID) {
				// 			table.selected = item.selected;
				// 		}
				// 	})
				// }
				// this.setArea(this.areaTableCopy);
			} else {
				// 没找到新增
				// console.log(index);
				this.copyOrderTableId.push(item.tableID);
			}
		},
		changePeople(item) {
			this.curOrder = item;
			this.bookID = this.curOrder.bookID;
			this.getOrderDetail();
		},
		// 被选桌台的选中样式
		orderPanelClass(tableItem) {
			if (~this.copyOrderTableId.indexOf(tableItem.tableID)) {
				return 'tablePanel-table-item tablePanel-table-sel';
			} else {
				return 'tablePanel-table-item';
			}
		},
		// 取消订单
		cancelReason(orderItem) {
			uni.navigateTo({
				url: `/pages/homePageSub/cancelReason/cancelReason?bookID=${orderItem.bookID}`,
			});
		},
		// 机会跳转
		chance(orderItem) {
			// console.log(orderItem)
			uni.navigateTo({
				url: `/pages/homePageSub/todayChance/todayChance?bookID=${orderItem.bookID}`,
			});
		},
		// 编辑模式
		editOrder() {
			this.isEdit = true;
			this.copyBookInfo = JSON.parse(JSON.stringify(this.bookInfo));
			this.editCopyOrderTIds = JSON.parse(JSON.stringify(this.orderTableId));
			//判断编辑状态下 顾客之前的预订时间
			if (this.bookInfo.willArrivedOn && this.orderTime) {
				let index = this._(this.orderTime).findIndex(
					(x) => x == this.bookInfo.willArrivedOn
				);
				if (index != -1) {
					this.orderTimeIndex = index;
				}
			}
		},
		editCancel() {
			this.initBookInfo();
			this.isEdit = false;
		},
		editConfirm() {
			if (!this.bookInfo.bookerPhone) {
				this.$cw.showError('请输入电话！');
				return;
			}
			if (!this.checkMobile(this.bookInfo.bookerPhone)) {
				this.$cw.showError('手机号格式错误！');
				return;
			}
			if (!this.bookInfo.bookerName) {
				this.$cw.showError('请输入姓名！');
				return;
			}
			this.changeOrder();
		},
		sendMsg(bookInfo) {
			this.$util.baiduEvent('发短信', '预订详情顶部发短信');
			let ctInfo = bookInfo;
			// 证明数据加载成功
			if (ctInfo.bookerName) {
				// customerID应该传递：bookID 预订单id
				let url =
					`/pages/customerSub/sendMsg/sendMsg?isClue=3&customerID=${
          this.bookID
        }&customerName=${ctInfo.bookerName}&phone=${
          ctInfo.bookerPhone
        }&msgName=${ctInfo.msgName || ctInfo.bookerName}&customSaveName=''`;
				uni.navigateTo({
					url,
				});
			}
		},
		changeSendMsg(str) {
			if (this.bookID) {
				return;
			}
			//选择发送预订信息方式 sendMsg=0  会发短信
			this.sendMsgType = str;
			this.$storage.setBookNowMsgType(str); //缓存发送短信方式
		},
		// isEditRemark() { //在有权限isCanEditPartBook情况下 点击备注
		// 	this.remarkText = this.bookInfo.habit;
		// 	this.$refs.remarkPopup.open();
		// 	this.isShowRemarkPopup = true;
		// },
		// cancel() { //取消备注弹窗
		// 	this.remarkText = '';
		// 	this.$refs.remarkPopup.close();
		// 	this.isShowRemarkPopup = false;
		// },
		confirmRemark() { //确认备注
			this.bookInfo.habit = this.remarkText;
			this.changeOrder();
		},
		checkMobile(mobile) {
			return RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/).test(mobile) || RegExp(/^1[1234576890]\d{9}$/).test(
				mobile);
		},
		// ---------------------------------------------输入电话 快捷搜索相关事件-------------------------------------------
		changePhone: util.debounce(function(e) {
			if (!this.bookInfo.bookerPhone) {
				this.phoneSearchList = [];
				return;
			}
			this.searchPhone();
		}, 500),
		changeCompany: util.debounce(function(e) {
			if (!this.bookInfo.company) {
				this.closeMenban();
				return;
			}
			this.searchCompony();
		}, 500),
		closeMenban() { //关闭蒙版
			this.phoneSearchList = [];
			this.companySearchList = [];
		},
		selectCustom(item) { //选择客户
			let obj = {
				customerID: item.customerID,
				bookerName: item.name || '',
				bookerPhone: item.phone,
				company: item.company,
				companyID: item.companyId ? item.companyId : '',
				marketerId: item.marketerId ? item.marketerId : '',
				isSearch: 1,
			}
			if (this.curOrder.bookID) {
				obj.bookID = this.curOrder.bookID;
			} else {
				if (this.curOrder.bookOrderID) {
					obj.bookID = this.curOrder.bookOrderID;
				} else {
					obj.bookID = '';
				}
			}
			obj.dinnerType = this.bookInfo.oredr[0].listOrderDay[0].type ?
				this.bookInfo.oredr[0].listOrderDay[0].type :
				'';
			if (~this.bookInfo.oredr[0].bookOn.indexOf('00:00:00')) {
				obj.bookOn = this.bookInfo.oredr[0].bookOn.split(' ')[0];
			} else {
				obj.bookOn = this.bookInfo.oredr[0].bookOn;
			}
			this.initOption(obj);
			this.closeMenban();
		},
		selectCompany(item) {
			this.bookInfo.companyID = item.id;
			this.bookInfo.company = item.name;
			this.closeMenban();
		},
		async searchPhone() { //根据号码搜索客户
			let data = {
				cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID,
				search: this.bookInfo.bookerPhone,
				pageSize: 5,
			}
			let res = await CY20.Searchuser(data, null, null, false);
			if (res) {
				this.phoneSearchList = this._.take(res.items, 5)
			}
		},
		async searchCompony() { //单位快捷搜索
			let data = {
				search: this.bookInfo.company
			}
			let res = await CY20.Searchcompany(data, null, null, false);
			if (res) {
				this.companySearchList = this._.take(res.items, 5);
			}
		}
	},
	watch: {
		areaTable: {
			handler: function(value) {
				let selectCount = 0;
				// 获取选中的桌数刷新桌数
				let tempVal = value[0].selected ?
					value.filter((v) => v.isAllArea) :
					value.filter((v) => !v.isAllArea);
				this._(tempVal).forEach((item) => {
					selectCount += this._(item.tableList)
						.filter((x) => x.selected)
						.value().length;
				});
				this.bookTableNum = selectCount;
			},
			deep: true,
		},
		curOrder(value) {
			if (value) {
				switch (value.status) {
					case 1:
						this.statusStr = '待审核';
						this.statusImg = '';
						break;
					case 2:
						this.statusStr = '已预订';
						this.statusImg = '';
						break;
					case 3:
						this.statusStr = '已到店';
						this.statusImg = '';
						break;
					case 4:
						this.statusStr = '已关单';
						this.statusImg = '';
						break;
					default:
						break;
				}
				if (value.isClose == 1) {
					this.statusStr = '已关单';
					this.statusImg = '';
				} else if (value.fee > 0) {
					this.statusImg = '';
					this.statusStr = '已结账';
				}
			} else {
				this.statusImg = '';
				this.statusStr = '';
			}
		},
		fee: {
			handler(val) {
				if (this.isEdit && !this.bookID) {
					this.orderRealAmount = val;
				}
			},
		},
	},
};
