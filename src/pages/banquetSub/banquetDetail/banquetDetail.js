// 三方库
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import util from '@/common/util.js';

// 引入uni自定义导航栏
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
// 弹窗popup组件
import uniPopup from '@/components/uni-popup/uni-popup.vue';
// 网络请求
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
import YHBanquetTask from "@/service/YH/YHBanquetTaskAppService.js";
import YHBanquetHistoryLog from "@/service/YH/YHBanquetHistoryLogAppService.js";

const app = getApp();

import CY23 from '@/service/CY/CY23AppService.js';
import CY08 from '@/service/CY/CY08AppService.js';

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

// mock数据
// import {
// 	GetBanquetExectorDetail
// } from '@/static/mock/banquetDetail.js';

// 权限说明

// 统筹人:一切操作可进行
// 执行人:只有[宴会执行]板块,能对任务进行编辑,而且还只能是自己的任务

// 创建宴会单操作日志说明
// 此页面只有在删除项目时才需要

const banquetInfoArr = [{
		id: 'banquetRelevant',
		name: '宴会相关'
	},
	{
		id: 'accountProfile',
		name: '客户档案'
	},
	{
		id: 'dinnerMeal',
		name: '宴会套餐'
	},
	{
		id: 'serviceProject',
		name: '服务项目'
	}
];

export default {
	data() {
		return {
			sales: storage.getChooseMarketData(), // 销售经理列表
			index: 0, // 销售负责人picker索引
			indexes: [], // picker索引初始化
			waiter: {},
			picDomain: app.globalData.PicDomain,
			// ----------------------- data参数接收 -------------------
			banquetId: "", // 宴会订单id
			// ------------------------- dataNavbar菜单 -----------------
			rightMenuArr: [{
					label: "分享给客户",
					icon: app.globalData.PicDomain + "/upload/yytApp/banquet/share-to-customer.png",
					value: "share",
					selected: true
				},
				{
					label: "编辑",
					icon: app.globalData.PicDomain + "/upload/yytApp/banquet/edit.png",
					value: "edit",
					selected: true
				},
				{
					label: "添加主题",
					icon: app.globalData.PicDomain + "/upload/yytApp/banquet/change-theme.png",
					value: "theme",
					selected: true
				},
				{
					label: "查看操作日志",
					icon: app.globalData.PicDomain + "/upload/yytApp/banquet/query-log.png",
					value: "log",
					selected: true
				},
				{
					label: "取消订单",
					icon: app.globalData.PicDomain + "/upload/yytApp/banquet/cancel-book.png",
					value: "cancel",
					selected: true
				}
			],

			// -------------------- dataUI视图 --------------------
			isActive: 1, // 默认高亮宴会信息view [宴会信息:1/宴会执行:2]
			banquetInfoArr: banquetInfoArr, // 宴会信息tab
			banquetInfoSelected: 0, // 宴会信息选中
			banquetInfoScrollLeft: 0, // 宴会信息tab的x轴偏移

			projSelected: 0, // 宴会项目选中
			projTabScrollLeft: 0, // 宴会项目tab偏移量

			selectorQuery: {}, // selectorQuery 对象
			cunstomerBasicInfoHeight: 0, // 客户基本信息高度(加margin-top)
			navbarBottom: 0, // 导航栏bottom值
			actionWrapperTop: 0, // action操作栏top
			actionWrapperHeight: 0, // action操作栏高度(加margin-top)

			// --------------------- data宴会执行 ------------------
			execSortArr: [
				// 宴会执行,执行排序,默认按时间排序
				{
					label: "按项目执行",
					value: 1,
					selected: app.globalData.banquetDetailPageData.execSortLike == 1
				},
				{
					label: "按时间执行",
					value: 2,
					selected: app.globalData.banquetDetailPageData.execSortLike == 2
				},
			],
			isExecSort: false, // 是否显示执行排序panel
			exectorArr: [
				// 宴会执行,执行人筛选
				{
					executorUserID: "",
					executorName: "全部",
					executorImgUrl: null,
					executorImgUrl_Server: "",
					isCoordinator: 0,
					isMarketer: 1,
					phone: null,
					selected: true
				}
			],
			isExecutor: false, // 是否显示执行人panel
			taskStatusArr: [
				// 宴会执行,任务状态筛选(是否已执行)
				{
					label: "全部",
					value: "",
					selected: true
				},
				{
					label: "未完成",
					value: "0",
					selected: false
				},
				{
					label: "已完成",
					value: "1",
					selected: false
				}
			],
			isTaskStatus: false, // 是否显示执行人panel

			// --------------------- data网络请求 ------------------
			banquetExecQuery: {
				banquetOrderGUID: "", // 宴会订单id
				banquetExectorDisplayType: app.globalData.banquetDetailPageData.execSortLike, // 宴会执行方式(1:项目,2:时间)
				exectorId: "", // 执行人id
				isExecuted: "" // 任务执行(未完成:0, 已完成1,全部:空)
			},
			projectArr: [], // 宴会按项目排序数据
			timeArr: [], // 宴会按时间排序数据
			banquetServicePersonnelArr: [], // 宴会服务人员专用arr

			banquetDetailData: {
				// 客户基本信息
				banquetOrderName: "", // 订单名称
				banquetDate: "", // 宴会执行日期
				banquetImgUrl: "", // 宴会图片
				orderCstName: "", // 客户姓名
				orderCstPhone: "", // 客户电话
				orderCstCompany: "", // 客户单位
				headImg: "", // 客户头像

				// 宴会相关
				banquetThemeTypeName: "", // 宴会类型名称
				banquetThemeTypeID: "", // 宴会类型id
				themeConfName: "", // 宴会主题配置名称
				bOrderOfExecutorViewDtos: [], // 执行人集合
				banquetOrderRemark: "", // 宴会单备注(也是订单备注)
				clueRemark: "", // 线索备注

				// 预订单信息
				bookOrderBookOrderID: null, // 预订订单主键ID
				bookOn: "", // 预订日期
				bookOrderTypeName: "", // 宴会类型名称
				diningTypeName: "", // 餐别名称
				bookTableNum: 0, // 预订桌数
				frontMoney: 0.0, // 定金
				areaName: "", // 区域名称
				bOrderOfRecordViewDtos: "", // 档案信息集合[]

				// 宴会套餐
				banquetPackageName: "", // 宴会套餐名称
				packageTableCount: 0, // 桌数
				packagePrice: 0.0, // 套餐价格
				packageRemark: "", // 套餐备注

				// 服务项目
				bOrderOfProjectCommentViewDtos: [], // 项目评价集合[]

				// 暂未用到
				customerID: "", // 客户id
				orderCstAddress: "", // 客户住址
				themeConfGUID: "", // 宴会主题GUID

				orderSignDate: "", // 签单时间
				clueGUID: "", // 线索GUID(YH_Clue)

				coordinatorID: "", // 统筹人id
				coordinatorName: "", // 统筹人名称
				marketerName: "", // 销售经理名称
				marketerID: "", // 销售经理id

				banquetOrderState: "", // 宴会单状态(1,进行中;2,已完成;3,取消)

				banquetPackageGUID: "", // 套餐GUID(YH_BanquetPackage)
				banquetPackageName: "", // 宴会套餐名称
				packagePrice: 0.0, // 套餐价格
				packageRemark: "", // 套餐备注
				packageTableCount: 0, // 桌数
				packageSpareTableCount: 0, // 备用桌数
				yH_BanquetOrderBookOrderID: "", // 宴会单(门店)预订单ID(CY20001)

				executorUserID: "", // 执行人ID(CY17001)
				executorName: "", // 执行人名称
				executorImgUrl: "", // 执行人头像相对路径
				executorImgUrl_Server: "" // 执行人头像完整路径
			} // 宴会单详情
		};
	},
	components: {
		uniNavBar,
		uniPopup
	},
	computed: {
		...mapState(["area", "todayOptions", "curSelectedTable", "bookerInfo"]),
		// 导航栏右侧动态菜单
		rightDynamicMenuArr() {
			return this.rightMenuArr.filter((v) => v.selected === true);
		},
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != "") {
					return "url(" + encodeURI(url) + ")";
				} else {
					return "url('https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png')";
				}
			};
		},
		// 宴会执行filter第一项 按xx顺序
		execSortSelectedText() {
			var filters = this.execSortArr.filter(function(item) {
				return item.selected;
			})[0];
			return filters ? filters.label.substring(0, 5) : "";
		},
		// 宴会执行filter第二项,执行人
		executorText() {
			var filters = this.exectorArr.filter(function(item) {
				return item.selected;
			})[0];

			if (filters) {
				return filters.executorName == "全部" ?
					"执行人" :
					filters.executorName.substring(0, 4);
			} else {
				return "";
			}
		},
		taskStatusText() {
			var filters = this.taskStatusArr.filter(function(item) {
				return item.selected;
			})[0];
			if (filters) {
				return filters.label == "全部" ?
					"任务状态" :
					filters.label.substring(0, 4);
			} else {
				return "";
			}
		},
		// task-item 时间状态的颜色
		timeStateOfColor() {
			return function(date, type = 'pro') { // pro：按项目执行，time按时间执行
				const daysDiff = date;
				// 之前date是根据 taskItem.executeDate 判断的 ,现在用 diffaultTime
				// const minutesDiff = this.$moment(date).diff(this.$moment(), 'minutes');
				// console.log(hoursDiff);
				if (daysDiff < 0) {
					// 超时
					return type == 'pro' ? ["yyt-error-bg", "text-white"] : ['yyt-error'];
				} else if (daysDiff < 3 && daysDiff >= 0) {
					// 快截止,2天
					return type == 'pro' ? ["yyt-orange-bg", "text-white"] : ['yyt-orange'];
				} else {
					return ["yyt-black"];
				}
			};
		},
		// 项目tab时间状态颜色
		timeStateOfColorForTab() {
			return function(index) {
				if (this.projectArr.length > 0) {
					// 到期数量,临近过期数量
					let timeoutCount = 0,
						expiringCount = 0;
					// 从未完成任务中,找到期和临近过去的
					this.projectArr[index].bOrderOfTaskViewDtos
						.filter((task) => task.isExecuted == "0")
						.forEach((task) => {
							// const minutesDiff = this.$moment(task.executeDate).diff(
							// 	this.$moment(),
							// 	'minutes'
							// );
							const daysDiff = task.diffaultTime;
							if (daysDiff < 0) {
								// 超时
								++timeoutCount;
							} else if (daysDiff < 3 && daysDiff >= 0) {
								// 快截止,2天
								++expiringCount;
							} else {}
						});
					// console.log({
					// 	timeoutCount,
					// 	expiringCount
					// });
					if (timeoutCount > 0) {
						return ["yyt-error-bg"];
					} else if (expiringCount > 0) {
						return ["yyt-orange-bg"];
					} else {
						return [];
					}
				} else {
					return [];
				}
			};
		},
		// 客户经理和统筹人可以操作属于他自己宴会的所有操作
		isCoordinator() {
			return (
				this.banquetDetailData.coordinatorID ==
				storage.getAppUserInfo().marketerId ||
				this.banquetDetailData.marketerID ==
				storage.getAppUserInfo().marketerId || this.isEditAll
			);
		},
		// 是否可操作所有
		isEditAll() {
			return this.$cw.canEditAllBanquet();
		}
	},
	watch: {
		// [宴会执行]宴会项目/时间排序变化
		execSortArr: {
			deep: true,
			handler(array) {
				const self = this;
				array.forEach(function(item, index) {
					if (item.selected) {
						self.banquetExecQuery.banquetExectorDisplayType = item.value;
						self.getBanquetExec();
					}
				});
			}
		},
		// [宴会执行]执行人变化
		exectorArr: {
			deep: true,
			handler(array) {
				const self = this;
				array.forEach(function(item, index) {
					if (item.selected) {
						self.banquetExecQuery.exectorId = item.executorUserID;
						self.getBanquetExec();
					}
				});
			}
		},
		// [宴会执行]任务状态筛选
		taskStatusArr: {
			deep: true,
			handler(array) {
				const self = this;
				array.forEach(function(item, index) {
					if (item.selected) {
						// console.log(item);
						self.banquetExecQuery.isExecuted = item.value;
						self.getBanquetExec();
					}
				});
			}
		},
		// 蒙版弹出禁止页面滚动
		isExecSort(val) {
			this.forbiddenScroll(val);
		},
		isExecutor(val) {
			this.forbiddenScroll(val);
		},
		isTaskStatus(val) {
			this.forbiddenScroll(val);
		}
	},
	// 监听页面滚动
	onPageScroll(e) {
		// if (e.scrollTop > this.cunstomerBasicInfoHeight) {
		// 	this.$refs.actionWrapperRef.$el.className = 'action-wrapper fixed';
		// 	this.$refs.actionWrapperRef.$el.style.top = this.navbarBottom + 'px';
		// } else {
		// 	this.$refs.actionWrapperRef.$el.className = 'action-wrapper';
		// 	this.$refs.actionWrapperRef.$el.style.top = '0px';
		// }
	},
	onLoad(payload) {
		// 进入宴会详情页,请传递 banquetId ,也就是宴会订单ID

		const {
			banquetId, // 宴会单id
			banquetInfoSelected // 宴会信息下的tabIdx
		} = payload;
		this.banquetId = banquetId;

		// 如果有banquetInfoTabSelect,则默认选中 [宴会信息下对应的索引]
		// console.log(banquetInfoSelected);
		if (banquetInfoSelected) {
			this.isActive = 1;
			this.banquetInfoSelected = banquetInfoSelected;
		}
		// 临时id
		// this.banquetId = 'B35919A5-CD1F-EA11-BA53-FC0E03BF8D3E';
		this.banquetExecQuery.banquetOrderGUID = this.banquetId;
		// onLoad不用请求宴会执行数据,因为详情加载后会赋值执行人列表exectorArr,而watch监听了exectorArr的改变
		uni.$on('changeThemeForBanquetDetail', () => {
			this.projSelected = 0;
		})
	},
	onShow() {
		// console.log({
		// 	'projSelected': this.projSelected
		// });
		// 每次回此页面,重新请求数据
		// 请求宴会订单详情数据
		this.getBanquetDetailData();
		//清除添加项目页面缓存
		storage.removeTaskList(); //清除缓存
	},
	mounted() {
		this.initFixedTop();
	},
	methods: {
		// 设置bookerInfo / 设置customer tab 当前选中tab
		...mapMutations(["setBookerInfo", "setReserveTab"]),
		// 获取区域
		...mapActions(["getArea"]),
		...mapMutations(["setArea", "setTodayOptions", "setCurSelectedTable"]),

		// 是否有权限
		haveAuthority() {
			if (!this.isCoordinator) {
				uni.showToast({
					title: "您没有权限执行此操作",
					icon: "none"
				});
				return false;
			} else {
				return true;
			}
		},
		// 初始化默认picker选中
		initCSActive() {
			this.indexes = []
			this.banquetServicePersonnelArr.forEach((v, idx) => {
				let index = this.sales.findIndex(item => item.value === v.executorUserID)
				if (index > -1) {
					this.indexes.push(index)
				} else {
					this.indexes.push(0)
				}
			})
			console.log(this.indexes);
		},
		// 更换客户经理
		changeCS(e, waiter, idx) {
			const self = this;
			if (!this.isCoordinator) {
				uni.showToast({
					title: '您没有权限执行此操作',
					icon: 'none'
				})
				return;
			};
			this.$util.baiduEvent('更换宴会执行人', '宴会详情页更换宴会执行人');

			self.index = e.target.value;
			const value = self.sales[self.index].value;
			const text = self.sales[self.index].text;

			uni.showModal({
				title: '提示',
				content: '确定更换宴会的销售经理？',
				success: async (res) => {
					if (res.confirm) {
						let role = waiter.isCoordinator == 1 ? 1 : waiter.isMarketer == 1 ? 2 : 3
						var obj = {
							banquetOrderGUID: self.banquetId,// 宴会单id
							changeExecutorType: role, // 执行人类型(1,统筹人;2,客户经理;3,任务执行人)
							oldExecutorId: waiter.executorUserID, // 旧执行人id
							newExecutorId: value, // 新执行人id
						}

						let result= await YHBanquetOrder.ChangeYHTaskExecutor(obj);
						if (result) {
							// 把新执行人的信息替换掉
							this.banquetServicePersonnelArr.splice(idx, 1, {
								...result,
								isCoordinator: waiter.isCoordinator,
								isMarketer: waiter.isMarketer
							})
							uni.showToast({
								title: '更换成功！',
								icon: 'success',
								duration: 2000
							});
						}

					} else if (res.cancel) {}

				}
			});

		},

		// ---------------------- methods网络请求 ---------------------
		// 异步请求宴会订单详情
		async getBanquetDetailData() {
			const data = {
				id: this.banquetId
			};
			let result = await YHBanquetOrder.GetViewDto(data);
			if (result) {
				// 处理统筹人和客户经理都相同的情况:

				// 专门显示宴会服务成员横向滚动的UI(不能)
				let tempExecutorArr = this._.cloneDeep(result.bOrderOfExecutorViewDtos);
				let arr = tempExecutorArr.filter(v => v.isCoordinator && v.isMarketer);
				if (arr.length > 0) {
					tempExecutorArr.splice(1, 0, this._.cloneDeep(arr[0]));
					tempExecutorArr[0].isMarketer = 0;
					tempExecutorArr[1].isCoordinator = 0;
					// console.log({
					// 	'tempExecutorArr': tempExecutorArr
					// });
					this.banquetServicePersonnelArr = tempExecutorArr;
					this.initCSActive();
				} else {
					this.banquetServicePersonnelArr = tempExecutorArr;
					this.initCSActive();
				}

				// 如果 frontMoney 为空,视为没有打钩付定金,不显示.问稍贵
				// result.frontMoney = this.$cw.emptyToString(result.frontMoney);
				this.rightMenuArr.forEach((menu, idx) => {
					// 「添加主题」
					if (menu.value == 'theme') {

						// 不管主题完成与否,都显示主题;如果已经有主题,显示更换,反之显示添加
						if (result.themeConfName) {
							menu.label = "更换主题";
						} else {
							menu.label = '添加主题';
						}
						// 如果已经有任务执行过,就不能展示主题
						// if (result.executCount && result.executCount > 0) {
						// 	menu.selected = false;
						// } else {
						// 	menu.selected = true;
						// 	// 否则如果有主题,就显示更换
						// 	if (result.themeConfName) {
						// 		menu.label = "更换主题";
						// 	}
						// }
					}
					// 「取消订单」
					if (menu.value == 'cancel' && result.banquetOrderState == 3) {
						menu.selected = false;
					}
				});

				this.banquetDetailData = result;
				this.exectorArr = [{
					executorUserID: "",
					executorName: "全部",
					executorImgUrl: null,
					executorImgUrl_Server: "",
					isCoordinator: 0,
					isMarketer: 1,
					phone: null,
					selected: true
				}];
				// 执行人列表
				let exectorList = this.banquetDetailData.bOrderOfExecutorViewDtos;
				if (exectorList.length > 0) {
					this.exectorArr.push(...exectorList);
					// 设置selected为双向绑定
					this.exectorArr.forEach((item) => {
						this.$set(item, "selected", false);
					});
					// 设置[全部]默认selected为true
					this.$set(this.exectorArr[0], "selected", true);
				}
				// console.log({
				// 	请求数据执行人: this.banquetDetailData.bOrderOfExecutorViewDtos
				// });
				// console.log({
				// 	执行人: this.exectorArr
				// });
			}

		},
		// 异步请求宴会执行
		async getBanquetExec() {
			const data = this.banquetExecQuery;
			let result = await YHBanquetOrder.GetBanquetExectorDetail(data);
			// const result = GetBanquetExectorDetail; // mock的数据
			// console.log(result);
			const {
				bOrderOfProjectViewDtos,
				bOrderOfTimeViewDtos
			} = result;
			// 如果 banquetExectorDisplayType 为 1, 取项目,否则取时间
			if (this.banquetExecQuery.banquetExectorDisplayType == 1) {
				this.projectArr = [];
				setTimeout(() => {
					this.projectArr = bOrderOfProjectViewDtos;
				});
				// console.log({
				// 	projectArr: this.projectArr
				// });
			} else {
				this.timeArr = bOrderOfTimeViewDtos;
				// console.log({
				// 	timeArr: this.timeArr
				// });
			}

		},

		// --------------------- methods宴会信息 ----------------------

		// 去立即预订还是查看预订
		async gotoBooking() {
			const bookID = this.banquetDetailData.bookOrderBookOrderID;
			if (bookID) {
				await this.initAreaAndTable(() => {
					console.log({
						跳转到bookNow时的area信息: this.area
					});

					let obj = {
						bookID: this.banquetDetailData.bookOrderBookOrderID,
						tableID: this.banquetDetailData.tableModelIds[0],
						bookOn: this.banquetDetailData.bookOn.slice(0, 10),
						dinnerType: this.banquetDetailData.diningTypeID,
						fromPage: "banquetDetail"
					};

					let param = util.urlEncode(obj).substring(1);

					const url = `/pages/homePageSub/bookNow/bookNow?${param}`;
					// console.log(url);
					uni.navigateTo({
						url
					});
				});
			} else {
				if (!this.$cw.todayScheduled()) {
					uni.showToast({
						title: '您没有开通预订台权限',
						icon: 'none'
					});
					return;
				}
				let obj = {
					customerID: this.banquetDetailData.customerID,
					bookerName: this.banquetDetailData.orderCstName,
					bookerPhone: this.banquetDetailData.orderCstPhone,
					banquetId: this.banquetId, // 宴会单id
					banquetThemeTypeID: this.banquetDetailData.banquetThemeTypeID, // 宴会类型id
					bookOn: this.banquetDetailData.banquetDate.slice(0, 10), // 宴会预订日期
					fromPage: "banquetDetail",
					marketerId: this.banquetDetailData.marketerID, // 客户经理传过去
				};
				let param = util.urlEncode(obj).substring(1);
				// console.log(param);

				// 切换到预订tab下的卡片模式
				this.setReserveTab(0);
				// switchtab无法传参,存vuex中
				this.setBookerInfo(obj);
				// uni.switchTab({
				// 	url: "/pages/reserve/reserve"
				// });
				uni.navigateTo({
					url: `/pages/homePageSub/reserve/reserve`
				});
			}
		},
		// 添加订单备注
		addOrderComments() {
			if (!this.haveAuthority()) return;
			// 转null为空字符串
			const remark = this.banquetDetailData.banquetOrderRemark
			const url = `/pages/banquetSub/addRemark/addRemark?banquetId=${this.banquetId}&banquetOrderRemark=${remark}&type=1`;
			uni.navigateTo({
				url
			});
		},
		// 去打电话
		gotoCallPhone(phone) {
			this.$util.baiduEvent('打电话', '宴会详情客户档案打电话');
			if (!phone) return;
			if (cw.isApp(true)) {
				cw.callPhone(phone,1)
			}
		},
		// 添加档案
		addProfile() {
			if (!this.haveAuthority()) return;
			// 传递宴会单id + 当前[客户档案的tab索引]
			let url =
				`/pages/banquetSub/cstRecordConf/cstRecordConf?banquetOrderGUID=${this.banquetId}&banquetInfoSelected=${this.banquetInfoSelected}`;
			uni.navigateTo({
				url
			});
		},
		// 编辑档案(档案id)
		editProfile(id) {
			if (!this.haveAuthority()) return;
			// 传递档案id + 当前[客户档案的tab索引]
			let url = `/pages/banquetSub/writeFile/writeFile?id=${id}&banquetInfoSelected=${this.banquetInfoSelected}`;
			uni.navigateTo({
				url
			});
		},
		// 发送档案给客户
		async sendToTheCustomer(tabIdx = 0) {
			if (!this.haveAuthority()) return;

			if (cw.isApp(true)) {
				const webpageurl = "https://mp.weixin.qq.com";
				let title = '';
				let selectedIdx = 0; // 选中tab
				let desc = this.$storage.getAppUserInfo().userName + '';
				let imgUrl = '';
				let bgData = {
					shareBgType: 1, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
					banquetOrderGUID: this.banquetId, // 宴会单id
					banquetProjectGUID: '', // 宴会项目id
					banquetTaskGUID: '', // 宴会任务id
					bookOrderId: '', // 预订单id
				};
				switch (tabIdx) {
					case 0: // 掌中宴宴会详情页
						title = '即刻了解您的宴会情况';
						selectedIdx = 0;
						desc += '邀请您查看宴会详情';
						break;
					case 1: // 宴会详情页档案填写tab
						title = '真诚的邀请您完善档案';
						selectedIdx = 1;
						desc += '邀请您完善您的档案资料';
						bgData.shareBgType = 2;
						break;
					default:
						title = '即刻了解您的宴会情况';
						selectedIdx = 0;
						desc += '邀请您查看宴会详情';
						break;
				}
				// 获取动态imgUrl
				let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
				const {
					bgUrl
				} = result;
				imgUrl = bgUrl;
				let pagePath =
					`pages/myOrderSub/banquetDetail/banquetDetail?banquetId=${this.banquetId}&banquetInfoSelected=${selectedIdx}`;
				// const imgUrl = this.$cw.ImgServerUrl + '/upload/img/20200211/1130373037_invitePic.png';
				const int = this.$cw.weixinIntType;

				console.log(
					`
						webpageurl:${webpageurl}
						pagePath:${pagePath}
						title:${title}
						desc:${desc}
						imgUrl:${imgUrl}
						int:${int}`
				)
				uni.showToast({
					title: '正在打开微信...',
					icon: 'none',
				});
				this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int);
			}
		},
		// 发送给客户评价(宴会信息 -> 服务项目)
		async sendToCustomerReviews(rate) { // 项目对象
			if (!this.haveAuthority()) return;

			if (cw.isApp(true)) {
				const webpageurl = "https://mp.weixin.qq.com"
				const pagePath =
					`pages/myOrderSub/banquetDetail/banquetDetail?banquetId=${this.banquetId}&banquetInfoSelected=2`; // 掌中宴mp中服务项目tab索引为2
				const title = '期待您对我们的服务做出评价'
				const desc = this.$storage.getAppUserInfo().userName + '邀请您对服务进行评价'
				// let imgUrl = this.$cw.ImgServerUrl + '/upload/img/20200211/1130373037_invitePic.png';
				let imgUrl = '';
				const int = this.$cw.weixinIntType;
				let bgData = {
					shareBgType: 3, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
					banquetOrderGUID: this.banquetId, // 宴会单id
					banquetProjectGUID: rate.id, // 宴会项目id
					banquetTaskGUID: '', // 宴会任务id
					bookOrderId: '', // 预订单id
				};
				// 获取动态img
				let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
				const {
					bgUrl
				} = result;
				imgUrl = bgUrl;
				console.log(
					`
						webpageurl:${webpageurl}
						pagePath:${pagePath}
						title:${title}
						desc:${desc}
						imgUrl:${imgUrl}
						int:${int}`
				)
				uni.showToast({
					title: '正在打开微信...',
					icon: 'none',
				})
				this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int)

			}
		},
		// 立即回复(评价item)
		gotoReply(rate) {
			if (!this.haveAuthority()) return;
			const {
				id,
				projectConfName: projectTitle
			} = rate;
			let url =
				`/pages/banquetSub/reply/reply?projectId=${id}&projectTitle=${projectTitle}&orderTitle=${this.banquetDetailData.banquetOrderName}&orderTime=${this.banquetDetailData.banquetDate}`;
			uni.navigateTo({
				url
			});
		},
		// --------------------- methods宴会执行 --------------------
		// 去任务详情
		gotoTask(taskItem) {
			// 任务id+统筹人id
			let url =
				`/pages/banquetSub/taskDetail/taskDetail?id=${taskItem.id}&coordinatorId=${this.banquetDetailData.coordinatorID}&marketerId=${this.banquetDetailData.marketerID}`;
			uni.navigateTo({
				url
			});
		},
		// 项目执行 -> 任务勾选 uni-app复选框事件监听
		projCheckboxChange(e) {
			return;
			var items = this.projectArr[this.projSelected].bOrderOfTaskViewDtos,
				values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (values.includes(item.id)) {
					this.$set(item, "isExecuted", "1");
				} else {
					this.$set(item, "isExecuted", "0");
				}
			}
			// // 判断是否是全选
			// var allSelected = this.CustomPoolData.every(function (item) { return item.selected });
			// this.isAllSel = allSelected ? true : false;
			// console.log(this.CustomPoolData.map(v=>v.selected), this.isAllSel);
		},
		// 检查任务是否可关闭,如果关闭则刷新页面,否则跳转提醒页面
		async checkTheTaskCanBeClose(task) {
			// 没修改前的任务状态[1:已完成/0:未完成]
			let currentStatus = task.isExecuted;
			// 要修改成的任务状态
			let isExecuted = task.isExecuted == "1" ? "0" : "1";
			// 检查是否可关任务权限的同时提示任务还需要提交的内容
			let result = await YHBanquetTask.GetTaskCompleteTip({
				banquetTaskGUID: task.id,
				factExecutorID: storage.getAppUserInfo().marketerId
			});
			if (result.error) {
				// this.$cw.showError(result.error.message);
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			const {
				isUploadFile, // 是否需要上传文件
				isCanUPloadFile, // 是否有权限上传文件
				isUploadImg, // 是否需要上传图片
				isCanUploadImg, // 是否有权限能上传头像
				isRemark, // 是否备注
				isCanRemark, // 是否有权限备注
				isRelatedDate, // 是否关联日期
				isRelateDate, // 是否有权限关联日期
			} = result;
			let obj = result;
			obj.ralationTaskText = task.ralationTaskText;

			if (currentStatus == "1") {
				// 如果之前是已完成,现在就走取消已完成的逻辑
				// 更新任务状态
				let updateData = {
					id: task.id,
					isExecuted: isExecuted,
					factExecutorID: storage.getAppUserInfo().marketerId,
					modifiedName: storage.getAppUserInfo().userName
				};
				YHBanquetTask.UpdateByDto(updateData, (resp) => {
					this.getBanquetDetailData();
					this.getBanquetExec();
				});
			} else {
				// 否则是未完成转已完成的逻辑
				// 只要有一个项目需要提示,就跳转提示;否则直接执行更新操作
				if (
					this.$cw.isShowTaskTip(isUploadFile, isCanUPloadFile) ||
					this.$cw.isShowTaskTip(isUploadImg, isCanUploadImg) ||
					this.$cw.isShowTaskTip(isRemark, isCanRemark) ||
					this.$cw.isShowTaskTip(isRelatedDate, isRelateDate)
				) {
					// 跳转任务提示
					let params = util.urlEncode(obj).substring(1);
					// console.log(params);
					let url =
						"/pages/banquetSub/taskTip/taskTip?taskId=" +
						task.id +
						"&coordinatorId=" +
						this.banquetDetailData.coordinatorID +
						"&marketerId=" +
						this.banquetDetailData.marketerID + "&" +
						params;

					uni.navigateTo({
						url
					});
				} else {
					// 更新任务状态
					let updateData = {
						id: task.id,
						isExecuted: isExecuted,
						factExecutorID: storage.getAppUserInfo().marketerId
					};
					YHBanquetTask.UpdateByDto(updateData, (resp) => {
						this.getBanquetDetailData();
						this.getBanquetExec();
					});

				}
			}

		},
		// 时间执行 -> 任务勾选
		timeCheckboxChange(e, index) {
			return;
			var items = this.timeArr[index].bOrderOfTaskViewDtos,
				values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (values.includes(item.id)) {
					this.$set(item, "isExecuted", "1");
				} else {
					this.$set(item, "isExecuted", "0");
				}
			}
			// // 判断是否是全选
			// var allSelected = this.CustomPoolData.every(function (item) { return item.selected });
			// this.isAllSel = allSelected ? true : false;
			// console.log(this.CustomPoolData.map(v=>v.selected), this.isAllSel);
		},
		// 添加/更换宴会主题
		addTheme() {
			if (!this.haveAuthority()) return;

			this.$refs.changeThemePopupRef.close();
			uni.navigateTo({
				url: "/pages/banquetSub/banquetTheme/banquetTheme?banquetOrderGUID=" +
					this.banquetId
			});
		},
		// 取消更换宴会主题
		cancelChangeTheme() {
			this.$refs.changeThemePopupRef.close();
		},
		// 触发宴会执行的执行排序panel显示
		execSortToggle() {
			this.isExecSort = !this.isExecSort;
			this.isExecutor = false;
			this.isTaskStatus = false;
		},
		// 选中了某个宴会执行排序item
		seleExecSort(item) {
			this.isExecSort = false;
			if (item.selected) return;
			this.execSortArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
			// 缓存这次选择的排序方式
			app.globalData.banquetDetailPageData.execSortLike = item.value;

			// 重置项目索引
			// this.projSelected = 0;
		},
		// 触发宴会执行的执行人选中panel显示
		executorToggle() {
			this.isExecutor = !this.isExecutor;
			this.isExecSort = false;
			this.isTaskStatus = false;
		},
		// 选中了某个宴会执行人item
		seleExector(item) {
			this.isExecutor = false;
			if (item.selected) return;
			this.exectorArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;

			// 重置项目索引
			// this.projSelected = 0;
		},
		// 触发宴会执行的任务状态选中panel显示
		taskStatusToggle() {
			this.isTaskStatus = !this.isTaskStatus;
			this.isExecutor = false;
			this.isExecSort = false;
		},
		// 选中了某个任务状态item
		seleTaskStatus(item) {
			this.isTaskStatus = false;
			if (item.selected) return;
			this.taskStatusArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;

			// 重置项目索引
			// this.projSelected = 0;
		},
		// 隐藏dropdown和遮罩
		hideDropdownAndMask() {
			this.isExecSort = false;
			this.isExecutor = false;
			this.isTaskStatus = false;
		},
		// 宴会执行 => 按项目执行 => 添加任务(项目id)
		addTask(id) {
			let url = `/pages/banquetSub/addTask/addTask?banquetOrderGUID=${this.banquetId}&banquetProjectGUID=${id}`;
			uni.navigateTo({
				url
			});
		},
		// [项目tab右侧三个点]展示操作项目的popup弹窗
		showProjPopup() {
			if (!this.isCoordinator) {
				uni.showToast({
					title: "您没有权限执行此操作",
					icon: "none"
				});
				return;
			}
			// 没有主题是不允许添加项目的
			if (!this.banquetDetailData.themeConfGUID) {
				uni.showToast({
					title: '请先选择项目主题~',
					icon: 'none'
				});
				return
			};
			this.$refs.projPopupRef.open();
		},
		// [底部弹窗]隐藏操作项目的popup弹窗
		closeProjPopup() {
			this.$refs.projPopupRef.close();
		},
		// [底部弹窗]新增项目(id:宴会订单id)
		addProj() {
			if (!this.haveAuthority()) return;
			let url =
				"/pages/banquetSub/addProject/addProject?banquetId=" + this.banquetId;
			uni.navigateTo({
				url
			});
			this.$refs.projPopupRef.close();
		},
		// [底部弹窗]点了想要移除项目
		removeProj() {
			if (this.projectArr.length <= 1) {
				cw.showError('项目数量至少为1!');
				this.$refs.projPopupRef.close();
				return;
			}
			this.$refs.projWarningPopupRef.open();
		},
		// [中间弹窗]确认移除项目
		async confirmRemoveProj() {
			let targetProj = this.projectArr[this.projSelected];

			let result = await YHBanquetProject.DeleteByDto({
				id: targetProj.id
			});
			setTimeout(() => {
				uni.showToast({
					title: "项目移除成功!"
				});
			});
			// 创建操作日志
			this.createHistoryLogForProj(targetProj);
			if (this.projectArr.length >= 1) {
				if (this.projSelected > 0) {
					--this.projSelected;
				} else {
					this.projSelected = 0;
				}
			} else {
				this.projSelected = 0;
			}
			this.getBanquetExec();



			// 把中间弹窗和底部弹窗都隐藏
			this.$refs.projWarningPopupRef.close();
			this.$refs.projPopupRef.close();
		},
		// [中间弹窗]取消了移除项目
		cancelRemovetProj() {
			// 把中间弹窗和底部弹窗都隐藏
			this.$refs.projWarningPopupRef.close();
			this.$refs.projPopupRef.close();
		},
		async createHistoryLogForProj(targetProj) {
			// 创建操作日志
			const date = moment().format("YYYY-MM-DD HH:mm");
			const desc = `${
				storage.getAppUserInfo().userName
			}删除了项目 ${date} 项目名称:${targetProj.projectConfName}`;
			const data = {
				banquetOrderGUID: this.banquetId, // 宴会单id
				operatorName: storage.getAppUserInfo().userName, // 操作人
				orderHistoryLogContent: desc // 描述
			};
			let res = await YHBanquetHistoryLog.CreateByDto(data);
		},

		// ------------------- methodsUI视图 -------------------
		// 宴会信息顶部固定tab选择
		banquetInfoTabSelect(e) {
			this.banquetInfoSelected = e.currentTarget.dataset.id;
			this.banquetInfoScrollLeft = (this.banquetInfoSelected - 1) * 100;
		},
		// 滑动swiper改变[宴会信息顶部固定tab选择]
		changeBanquetInfoSelected(e) {
			const {
				current
			} = e.detail;
			this.banquetInfoSelected = current;
			this.banquetInfoScrollLeft = (this.banquetInfoSelected - 1) * 100;
		},
		// 宴会执行的项目固定tab选择
		projTabSelect(e) {
			this.projSelected = e.currentTarget.dataset.id;
			this.projTabScrollLeft = (this.projSelected - 1) * 100;
		},
		changeProjTabSelect(e) {
			const {
				current
			} = e.detail;
			// console.log({
			// 	"current": current
			// });
			this.projSelected = current;
			this.projTabScrollLeft = (this.projSelected - 1) * 100;
		},
		// 切换到宴会信息
		showBanquetInfo() {
			this.isActive = 1;
		},
		// 切换到宴会执行
		showBanquetExec() {
			this.isActive = 2;
		},
		moveHandle() {},

		forbiddenScroll(forbidden = true) {
			if (forbidden) {
				this.$refs.containerRef.$el.className = "container forbidden-scroll";
			} else {
				this.$refs.containerRef.$el.className = "container";
			}
		},
		// ------------------- methodsNavbar事件 -----------------
		// 导航栏左侧按钮事件
		tapLeftFromNav() {
			// uni.navigateBack({
			// 	delta: 1
			// });
			uni.$emit('reloadPageOrder', 'refresh');
			this.$cw.setSwitchTo({
				url: '/pages/banquet/banquet',
				payload: {
					tabIndex: 1,
				}
			});
		},
		// 导航栏右侧按钮事件
		tapRightFromNav() {
			// console.log("show more");
			this.$refs.morePopup.open();
		},
		// 右侧按钮跳转到对应页面
		seleMenu(item) {
			switch (item.value) {
				case "share": // 分享给客户
					this.sendToTheCustomer();
					break;
				case "edit": // 编辑
					uni.navigateTo({
						url: `/pages/banquetSub/addBanquetOrder/addBanquetOrder?id=${this.banquetId}&fromtype=2`
					});
					break;
				case "theme": // 更换主题
					if (this.banquetDetailData.themeConfGUID == '') {
						// 添加主题
						uni.navigateTo({
							url: "/pages/banquetSub/banquetTheme/banquetTheme?banquetOrderGUID=" +
								this.banquetId
						});
					} else {
						// 更换主题
						this.$refs.changeThemePopupRef.open();
					}
					break;
				case "log": // 查看操作日志
					uni.navigateTo({
						url: "/pages/banquetSub/workingLog/workingLog?banquetOrderGUID=" +
							this.banquetId
					});
					break;
				case "cancel": // 取消订单
					this.$refs.cancelPopup.open();
					break;
				default:
					break;
			}
			this.$refs.morePopup.close();
		},
		// 取消订单提示框的左右按钮
		cancelOrder() {
			this.$refs.cancelPopup.close();
		},
		// 确认取消订单
		async confirmCancel() {
			let result = await YHBanquetOrder.UpdateByDto({
				id: this.banquetDetailData.id,
				banquetOrderState: 3 // (1,进行中;2,已完成;3,取消)
			});
			// console.log(result);
			setTimeout(() => {
				uni.showToast({
					title: '取消订单成功!',
					duration: 2000
				});
			})
			setTimeout(() => {
				this.$cw.setSwitchTo({
					url: "/pages/banquet/banquet",
					payload: {
						tabIndex: 1
					}
				});
			}, 2000);

			this.$refs.cancelPopup.close();
		},

		// ----------------------- methods立即预订相关 -------------------
		// 初始化区域和桌台
		async initAreaAndTable(cb) {
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				storeID: storeId,
				dinnerType: this.banquetDetailData.diningTypeID,
				bookOn: this.banquetDetailData.bookOn
			};

			const tableAreaList = await this.getArea(data);
			// console.log(tableAreaList);

			this.requestOrders(cb);
		},
		// 请求当前区域下订单
		async requestOrders(cb) {
			// 当前区域id
			const areaID = this.banquetDetailData.areaID;
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				areaID: [areaID],
				bookOn: this.banquetDetailData.bookOn,
				type: this.banquetDetailData.diningTypeID,
				storeID: storeId,
				isNotShowExists: 0, // 不显示已经有订单的桌台(1为不显示)
				isGetOrder: 1
			};
			// 获取当前区域下所有桌台下的所有订单
			let result = await CY08.GetTabelInApp(data);
			// 当前区域
			const areaTable = result.areaTable[0];
			areaTable.datalist.forEach((v) => (v.selected = false));
			const curArea = this.area.find(
				(v) => v.tableAreaID === areaTable.areaID
			);

			// 下面两个true重要
			curArea.selected = true;
			curArea.advance = true;
			// console.log(curArea);
			curArea.tableList = areaTable.datalist;

			this.setArea(this.area);
			cb && cb();

		},
		// ----------------------- methods吸顶功能 -------------------
		// 初始化吸顶标题的工作
		initFixedTop() {
			// 获取 SelectorQuery 对象实例。可以在这个实例上使用 select 等方法选择节点
			this.selectorQuery = uni.createSelectorQuery().in(this);

			// 导航栏rect / 客户基本信息rect / action rect
			let uniNavbarRefRect = this.$refs.navbarRef.$el.getBoundingClientRect();
			let customerBasicInfoRefRect = this.$refs.customerBasicInfoRef.$el.getBoundingClientRect();
			let actionWrapperRefRect = this.$refs.actionWrapperRef.$el.getBoundingClientRect();

			// 计算 导航栏top + height 的 初始 top 值,以及 actionWrapper 的高度
			this.navbarBottom = uniNavbarRefRect.height + uniNavbarRefRect.top;
			// actionWrapper高度并没有把上下margin和padding算进去,所以得手动加
			this.cunstomerBasicInfoHeight =
				customerBasicInfoRefRect.height + uni.upx2px(20 + 60);
			// console.log({uniNavbarRefRect});
			// console.log({customerBasicInfoRefRect});
			// console.log({actionWrapperRefRect});
			this.actionWrapperTop = actionWrapperRefRect.top;
			this.actionWrapperHeight = actionWrapperRefRect.height;
		}
	}
};
