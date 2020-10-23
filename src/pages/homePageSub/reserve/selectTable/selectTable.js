import cw from '@/common/ceiwei/common.js';
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import CY08 from '@/service/CY/CY08AppService.js';
import CY18 from '@/service/CY/CY18AppService.js';
import CY23 from '@/service/CY/CY23AppService.js';
import NCY from '@/service/NCY/NCYTableLockAppService.js';
import uniTag from '@/components/uni-tag/uni-tag.vue';
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";
import util from "@/common/util.js";
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';

export default {
	data() {
		return {
			// 顶部默认时间选择
			defaultDate: moment().format('YYYY-MM-DD').split('-'),
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				textOutOffset: '下拉加载上个区域',
				textInOffset: '释放加载上个区域',
				textLoading: '正在加载...' // 配置上拉加载文字
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				offset: 1, // 离底部多少进行更新数据
				textLoading: '正在加载下个区域...', // 配置上拉加载文字
			},
			// 左滑常用配置
			leftOption: {
				use: true, // 是否启用上拉加载; 默认false
				content: '' // 显示左边的文字
			},
			// 右滑常用配置
			rigthOption: {
				use: true, // 是否启用上拉加载; 默认false
				content: '' // 显示左边的文字
			},
			moveAreaHeight: '100%', // moveArea高度
			isShowMoveView: true, // 默认显示moveview
			canUse: true,
			tempDate: cw.pikerGetDate(), // 临时选中时间（存储上一次选中时间）
			curMealIdx: 0, // 当前餐别数组索引
			tempMealIdx: 0, // 临时餐别数组索引
			scrollLeft: 0, // 顶部餐别scroll-view滑动距离
			floorsSelectShow: false, // 右上角区域下拉列表是否显示
			areaIsLoaded: false, // 区域信息是否加载完成（默认否）
			pickerData: {
				date: cw.pikerGetDate(), // 当前选中时间（默认当前时间）
				curMealTypeID: 0, // 当前餐别typeID
				curFloorIdx: 0, // 当前区域索引
			},
			tempAreaID: '', // 临时区域ID
			endYear: cw.pikerGetDate('end').slice(0, 4), // 时间选择范围1960-当前年份+2
			mealsType: [], // 餐别list详情
			areatbs: [], // 各区域订单信息
			items: [], // 当前区域各桌台信息
			sumtbs: {}, // 汇总个数信息（区域下拉列表【全部】板块，已废弃）
			isShowMealsModal: false, // 是否显示选择餐别的底部弹出modal，（默认不显示）
			isShowBtn: false, // 是否显示底部确认按钮
			lockBtnInfo: false, // 底部锁台按钮信息
			storeID: '', // 门店ID
			statusBarHeight: 0, // 状态栏高度
			mainHeight: 0, // 表格页面高度
			payload: {}, // 假装有payload
			isFirstLoad: true, // 默认表示当前组件第一次加载
			scrollHeight: 0, // 滚动区域高度,用于设置滑动块高度

			canShowLockModal: false, // 是否显示锁台modal
			lockTable: null, // 被锁台modal
			ready: false, // 是否加载完了数据

			pressTimer: null, // 长按计时器
			lockSelArr: [], // 锁台或者想要解锁的所选桌台数组
		};
	},
	components: {
		uniTag,
		// yytPicker,
		// MescrollUni, // 滚动
	},
	mounted() {
		// 表格页面高度计算
		this.mainHeight = this.statusBarHeight + uni.upx2px(84);
		this.payload = this.bookerInfo;
		this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

		const storeId = this.$storage.getAppUserInfo().currentStoreId;
		this.storeID = storeId;

		// 读取vuex保存的上次顶部选择结果
		const {
			date,
			curMealIdx,
			curFloorIdx
		} = this.todayOptions;
		this.pickerData.date = date;
		this.tempDate = date;
		if (this.payload.bookOn) {
			this.pickerData.date = this.payload.bookOn;
			this.defaultDate = this.payload.bookOn.split('-');
		} else if (this.tempDate) {
			this.defaultDate = this.tempDate.split('-');
		}
		this.pickerData.curFloorIdx = curFloorIdx;
		this.curMealIdx = curMealIdx;
		
		let btnInfo = this.isShowMultipleBtn();
		this.isShowBtn = btnInfo.canConfirm;
		this.lockBtnInfo = btnInfo.lockInfo;
		this.calcMoveAreaHeight();
	},
	computed: {
		...mapState(['area', 'todayOptions', 'curSelectedTable', 'bookerInfo']),
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		// 根据每个订单状态设置背景色和文字
		selfOrderList(order) {
			return function(order) {
				// 状态class名，预计到达时间，状态文字，状态是否显示icon图片，图片路径
				let statusClass = '',
					showWillArrivedOn = true,
					statusStr = '',
					showImg = false,
					imgSrc = '';
				switch (order.status) {
					case 1:
						statusClass = 'awaitReview';
						statusStr = '待审核';
						break;
					case 2:
						statusClass = 'reserved';
						statusStr = '已预订';
						break;
					case 3:
						statusClass = 'arrived';
						statusStr = '已到店';
						break;
					case 4:
						statusClass = 'leave';
						statusStr = '已离店';
						break;
					default:
						statusClass = '';
						statusStr = '';
						break;
				}
				if (order.isMaterial) {
					statusStr = '已点菜';
					// showWillArrivedOn = false;
					showImg = true;
					imgSrc = 'https://pic.cwyyt.cn/upload/yytApp/images/yidiancai.png';
				}
				if (order.isPayMateriaMoney) {
					statusStr = '点菜并支付';
					// showWillArrivedOn = false;
					showImg = true;
					imgSrc = 'https://pic.cwyyt.cn/upload/yytApp/images/diancaibingzhifu.png';
				}

				// if(order.enablePay==1){
				// state=order.paid!=1?"定金未支付":order.frontMoney>0?"定金已支付":""
				// }

				// ↑ 根据上面后端逻辑来的 ↑
				if (order.enablePay == 1) {
					statusStr = order.paid != 1 ? '定金未支付' : order.frontMoney > 0 ? '定金已支付' : '';
					showImg = order.paid != 1 ? true : order.frontMoney > 0 ? true : false;
					imgSrc =
						order.paid != 1 ? 'https://pic.cwyyt.cn/upload/yytApp/images/dingjinweizhifu.png' :
						order.frontMoney > 0 ? 'https://pic.cwyyt.cn/upload/yytApp/images/dingjinyizhifu.png' : '';
				}

				if (order.isClose == 1) {
					statusClass = "closed";
					statusStr = "已关单";
					showImg = false;
					imgSrc = '';
				} else if (order.status != 1 && order.fee > 0) { //待审核订单可以输入金额
					statusClass = "check";
					statusStr = "结账" + (order.fee ? order.fee + "元" : "");
					showImg = false;
					imgSrc = '';
				};
				return {
					statusClass,
					showWillArrivedOn,
					statusStr,
					showImg,
					imgSrc
				}
			}
		},
		areasAll() {
			const self = this;
			let activeCount = 0,
				allCount = 0;
			self.areatbs.forEach(v => {
				// console.log(v);
				activeCount += v.tableNumber;
				allCount += v.sumCount;
			});
			return {
				activeCount,
				allCount
			}
		},
		// 锁台modal里的list
		calcLockModalList() {
			let arr = [{
				label: '锁台',
				value: 1,
			}, {
				label: '解锁',
				value: 0
			}];
			// 有锁台权限的人才能锁台
			if (this.$cw.canOperLockedTable()) {
				// 如果当前有选中的锁台并且被锁状态
				if (this.lockTable && this.lockTable.tableIsLock) {
					arr = arr.filter(v => v.value != 1);
				} else if (this.lockTable && !this.lockTable.tableIsLock) {
					arr = arr.filter(v => v.value != 0);
				} else {
					arr = [];
				}
			} else {
				arr = [];
			}
			console.log({arr})
			return arr;
		},
		// 是否显示锁台按钮
		showLockBtn() {
			if (this.$cw.canOperLockedTable()) {
				// 如果当前有选中的锁台并且被锁状态
				return this.lockTable && this.lockTable.tableIsLock;
			} else {
				return false;
			}
		},
		LockBtnInfo() {
			let arr = [{
				label: '锁台',
				value: 1,
			}, {
				label: '解锁',
				value: 0
			}];
			// 有锁台权限的人才能锁台
			if (this.$cw.canOperLockedTable()) {
				// 如果当前有选中的锁台并且被锁状态
				if (this.lockTable && this.lockTable.tableIsLock) {
					arr = arr.filter(v => v.value != 1);
				} else {
					arr = arr.filter(v => v.value != 0);
				}
			} else {
				arr = arr.filter(v => v == 0);
			}
			return arr;
		},
	},
	methods: {
		...mapActions(['getArea']),
		...mapMutations(['setArea', 'setTodayOptions', 'setCurSelectedTable']),
		// 滑动结束隐藏左右content
		swiperFinish() {
			this.rigthOption.content = "";
			this.leftOption.content = "";
		},
		// 滑动的时候展示content
		swiperTransition() {
			this.rigthOption.content = this.$moment(this.pickerData.date).add(1, 'days').format('YYYY-MM-DD');
			this.leftOption.content = this.$moment(this.pickerData.date).add(-1, 'days').format('YYYY-MM-DD');
		},
		// 右滑减一天
		rightCallback(mescroll) {
			this.ready = false;
			const currentData = this.$moment(this.pickerData.date).add(-1, 'days').format('YYYY-MM-DD');
			this.changeDate(currentData);
			this.tempDate = currentData;
			this.defaultDate = this.tempDate.split('-');
		},
		// 左滑加一天
		leftCallBack(mescroll) {
			this.ready = false;
			const currentData = this.$moment(this.pickerData.date).add(1, 'days').format('YYYY-MM-DD');
			this.changeDate(currentData);
			this.tempDate = currentData;
			this.defaultDate = this.tempDate.split('-');
		},
		// 下拉刷新 加载上个区域
		downCallback(mescroll) {
			//  下拉改成直接刷新当前区域
			const successFunction = () => {
				mescroll.endSuccess(1000, true);
			}
			this.selectFloor(this.pickerData.curFloorIdx, successFunction);
		},
		// 上拉加载下个区域
		upCallback(mescroll) {
			mescroll.endSuccess(1000, true);

			// 暂时先去掉下拉刷新 手机体验很不好
			// const index = this.pickerData.curFloorIdx + 1;
			// if (index < this.areatbs.length) {
			// 	const successFunction = () => {
			// 		mescroll.endSuccess(1000, true); // 1000 构建多页数据 默认每页10条 这个地方表示总共有100页
			// 		mescroll.scrollTo(0); // 滚动到顶部
			// 	}

			// 	// 节流
			// 	if (this.canUse) {
			// 		this.canUse = false;
			// 		this.selectFloor(index, successFunction);
			// 	} else {
			// 		mescroll.endSuccess(1000, true);
			// 	}
			// 	setTimeout(() => {
			// 		this.canUse = true;
			// 	}, 1000);
			// } else {
			// 	this.$cw.showMsg('已经是最后一个区域了');
			// 	mescroll.endSuccess(1000, true);
			// }
		},
		// 动态计算moveArea高度
		calcMoveAreaHeight() {
			let info = uni.createSelectorQuery().select("#select-table");
			info.boundingClientRect((data) => { //data - 各种参数
				if (data && data.height) {
					console.log("原始data.height", data.height);
					let height = 0;
					height = data.height - this.mainHeight;
					console.log("----------- isShowBtn ---------", this.isShowBtn);
					// if (this.isShowBtn) 
					height = height - uni.upx2px(120);
					this.moveAreaHeight = data.height == 0 ? '100%' : (height + 'px'); // 返回元素宽度
				} else {
					console.log('data.height为null');
				}
			}).exec();
		},
		// 刷新页面(原onShow方法,转成组件后没有该生命周期)
		async refresh() {
			this.ready = false;
			// 表格页面高度计算
			this.mainHeight = this.statusBarHeight + uni.upx2px(84);

			// console.log(this.bookerInfo);
			this.payload = this.bookerInfo;
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

			const storeId = this.$storage.getAppUserInfo().currentStoreId;
			// console.log(storeId);
			this.storeID = storeId;

			// 读取vuex保存的上次顶部选择结果
			const {
				date,
				curMealIdx,
				curFloorIdx
			} = this.todayOptions
			this.pickerData.date = date;
			// 从宴会详情来的立即预订来,会带上自己的bookOn
			if (this.payload.bookOn) {
				this.pickerData.date = this.payload.bookOn;
				this.defaultDate = this.payload.bookOn.split('-');
			}
			this.pickerData.curFloorIdx = curFloorIdx;
			this.curMealIdx = curMealIdx;
			// console.log(date, curMealIdx, curFloorIdx);

			this.initData();

			// 看需不需要显示按钮
			// this.isShowBtn = JSON.stringify(this.curSelectedTable) !== '{}';
			let btnInfo = this.isShowMultipleBtn();
			this.isShowBtn = btnInfo.canConfirm;
			this.lockBtnInfo = btnInfo.lockInfo;
			// console.log(this.isShowBtn);
		},
		async initData() {
			this.ready = false;
			// 初始化当前门店餐别+区域+房间
			const newMealsType = await this.initMealsType();
			const newAreaAndTable = await this.initAreaAndTable();
			// 请求当前区域下的所有桌台和订单
			this.requestOrders();
			this.setArea(newAreaAndTable);
		},
		// 初始化当前门店餐别
		async initMealsType(cb) {
			const self = this;
			let result = await CY23.GetDiningTypeInApp({
				storeID: self.storeID,
			}, null, null, false);
			// console.log(result);
			self.mealsType = result.diningTypes;
			// 判断当前是否之前选择过餐别，如果默认值为-1，代表从没选过（或者理解为刷新了页面），需要智能和当前时间判断。否则不做判断
			// 前提：中餐12:00、晚餐：18:00（餐别时间、餐别排序均可在后台设置）
			//    情况一：当前时间9:00，餐别默认显示中餐
			//    情况二：当前时间15:00，餐别默认显示晚餐
			//    情况三：当前时间20:00，餐别默认显示晚餐
			if (self.curMealIdx === -1) {
				// 19:00 [11:00, 17:00, 15:00]

				let minGap = 99999,
					idx = 0,
					maxTime = -1,
					maxIdx = 0;
				const hour = self.$moment().hour();
				const minute = self.$moment().minute();
				const curTime = hour + '.' + (minute > 9 ? minute : '0' + minute);
				// console.log(curTime);
				self.mealsType.map((v, index) => {
					// 餐别时间 - 当前时间，如果大于0代表当前可以选次餐别，通过循环找到最小gap差值的对应餐别索引
					const gap = parseFloat(v.time) - curTime;
					// console.log(v.time, gap);
					if (gap > 0 && minGap > gap) {
						minGap = gap;
						idx = index;
					}
					// 与此同时还通过循环找到所有餐别中最晚餐别时间
					if (parseInt(v.time) > maxTime) {
						maxTime = parseInt(v.time);
						maxIdx = index;
					}
				});
				// minGap为默认值代表没找到最近可选餐别，换句话说当前时间比所有餐别设置时间都晚，此时默认选中最晚的一个餐别
				if (minGap === 99999) {
					idx = maxIdx;
				}
				self.curMealIdx = idx;
			}
			self.pickerData.curMealTypeID = self.mealsType.length > 0 ? self.mealsType[self.curMealIdx].diningTypeID : 0;


		},
		// 初始化区域（区域中包含各自所有桌台【更新：不包含所有订单了】）
		async initAreaAndTable() {
			const self = this;
			const data = {
				storeID: self.storeID,
				dinnerType: self.pickerData.curMealTypeID,
				bookOn: self.pickerData.date + " 00:00:00"
			};
			const tableAreaList = await self.getArea(data);

			// 构造全部区域
			let allArea = this._.cloneDeep(tableAreaList[0]);
			allArea.tableAreaID = "TA00000000000";
			allArea.name = "全部";
			allArea.tableAreaSort = 0;
			allArea.sumCount = this._(tableAreaList).sumBy(x => x.sumCount);
			allArea.tableNumber = this._(tableAreaList).sumBy(x => x.tableNumber);
			allArea.isAllArea = true; // 标志是所有的table
			// allArea.tableList = this._(tableAreaList).flatMap(x => x.tableList).value();
			allArea.tableList = tableAreaList.map(v => v.tableList).flat(Infinity);
			tableAreaList.unshift(allArea);
			self.areatbs = tableAreaList;
			self.areaIsLoaded = true;

			// 设置右上角当前区域
			if (self.tempAreaID) {
				const idx = self.areatbs.findIndex(v => v.tableAreaID === self.tempAreaID)
				this.pickerData.curFloorIdx = idx > -1 ? idx : 0;
			} else {
				const tempArea = self.areatbs[self.todayOptions.curFloorIdx];
				if (tempArea) {
					const idx = self.areatbs.findIndex(v => v.tableAreaID === tempArea.tableAreaID)
					this.pickerData.curFloorIdx = idx > -1 ? idx : 0;
				}
			}

			// 获取当前选中区域所有桌台列表
			const curArea = self.areatbs.find(v => v.tableAreaID === self.areatbs[self.pickerData.curFloorIdx].tableAreaID);
			self.items = curArea ? curArea.tableList : [];
			return tableAreaList;
		},
		// 获取订单
		async requestOrders(successFunction) {
			let areaIDs = [];
			let currentArea = this.areatbs[this.pickerData.curFloorIdx];

			const tableAreaID = currentArea.tableAreaID;
			this.tempAreaID = tableAreaID; // 绑定当前的areaid

			// 全部的情况 把所有区域传到后端
			if (currentArea.isAllArea) {
				areaIDs = this.areatbs.map(x => x.tableAreaID);
			} else {
				areaIDs.push(tableAreaID);
			}


			// TODO：获取当前区域所有桌台的所有订单，并保存到vuex
			const data = {
				areaID: areaIDs,
				bookOn: this.pickerData.date + " 00:00:00",
				type: this.pickerData.curMealTypeID,
				storeID: this.storeID,
				isNotShowExists: 0, // 不显示已经有订单的桌台(1为不显示)
				isGetOrder: 1,
			};
			let result = await CY08.GetTabelInApp(data);
			this.ready = true;
			let showTableList = [];

			// 全部区域
			if (currentArea.isAllArea) {
				// 所有区域
				showTableList = this._(result.areaTable).flatMap(x => x.datalist).value();
			} else {
				// 当前区域
				showTableList = result.areaTable[0].datalist;
			}

			currentArea.tableList = showTableList;

			showTableList.forEach(v => {
				this.$set(v, 'selected', false);
			});
			this.items = showTableList;

			this.items.forEach((item, index) => {
				if (item.tableID in this.curSelectedTable && item.orderList.length === 0) {
					item.selected = true;
				}
				this.setArea(this.areatbs);
				// 设置下拉区域文字
				successFunction && successFunction();
			});
			// 动态绑定滑动块的高度
			this.$nextTick(() => {
				let view = uni
					.createSelectorQuery()
					.in(this)
					.select('.inner-content');
				view.boundingClientRect(data => {
					if (data) {
						this.scrollHeight = data.height
					}
				}).exec();
			})
		},
		// 弹出时间选择器
		popPickerModal() {
			this.$refs.datePicker.show();
		},
		// 隐藏时间选择器
		cancelDatePicker() {
			this.defaultDate = this.tempDate.split('-');
			this.$refs.datePicker.hide();
		},
		// 选择弹出modal中的日期
		chooseDate(e) {
			this.ready = false;
			this.tempDate = e.result;
			this.isShowBtn = false;
			this.lockBtnInfo.canLock = false;
			// 更新vuex中保存的picker状态
			this.changeDate(this.tempDate);
		},
		async changeDate(currentDate) {
			this.pickerData.date = currentDate;
			this.todayOptions.date = currentDate;
			this.setTodayOptions(this.todayOptions);
			// 清空当前勾选的所有房间
			this.setCurSelectedTable({});
			await this.initAreaAndTable();
			this.requestOrders();
		},
		// 顶部切换了餐别
		async mealSelect(e) {
			this.ready = false;
			this.curMealIdx = e.currentTarget.dataset.id;
			// 更新vuex中保存的picker状态
			this.todayOptions.curMealIdx = this.curMealIdx;
			this.setTodayOptions(this.todayOptions);
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			this.pickerData.curMealTypeID = this.mealsType[this.curMealIdx].diningTypeID;
			// 清空当前勾选的所有房间
			this.setCurSelectedTable({});
			// 隐藏确认按钮
			this.isShowBtn = false;
			this.lockBtnInfo.canLock = false;
			// 保存切换前的区域ID
			this.tempAreaID = this.area[this.pickerData.curFloorIdx].tableAreaID;
			await this.initAreaAndTable();
			this.requestOrders();
		},
		// 底部餐别选择的弹出modal逻辑
		// 隐藏modal
		hideMealsModal() {
			this.isShowMealsModal = false;
			this.$refs.datePicker.show();
		},
		// 触发顶部楼层选择列表的显示
		triggerFloors() {
			this.floorsSelectShow = !this.floorsSelectShow;
		},
		// 隐藏遮罩
		hideMask() {
			this.floorsSelectShow = !this.floorsSelectShow;
		},
		// 选择楼层, successFunction 用于上拉下拉成功后的回调
		selectFloor(index, successFunction, isHideMask = false) {
			this.ready = false;
			if (isHideMask) {
				this.floorsSelectShow = !this.floorsSelectShow;
			}
			this.pickerData.curFloorIdx = index;
			// 更新vuex中保存的picker状态
			this.todayOptions.curFloorIdx = index;
			this.setTodayOptions(this.todayOptions);
			// 点击其他区域
			this.requestOrders(successFunction);
		},
		// 勾选房间
		chooseTable(selTable) {
			// if (selTable.tableIsLock) return;
			let tableID = selTable.tableID;
			const table = this.items.filter(v => v.tableID == tableID)[0];
			// console.log(table.tableID, table.tableName);
			if (table && table.orderList.length == 0) {
				table.selected = !table.selected;
				
				let tempItems = this.items;
				// bug: vue用的 items.filter ，所以此处要强制刷新
				this.items = [];
				this.items = tempItems;
				if (!this.curSelectedTable[table.tableID]) { // 如果不存在于已选table中
					let curSelectedTableCopy = this.curSelectedTable;
					
					this._.assign(curSelectedTableCopy, {
						[table.tableID]: table
					});
					this.setCurSelectedTable(curSelectedTableCopy);
					
					// 看所有table的tableIsLock是否是同一种状态
					let curStatus = null, allCount = 0;

					for (const [key, value] of Object.entries(curSelectedTableCopy)) {
						if (allCount == 0) { // 第一次计数
							allCount += 1;
							curStatus = !!value.tableIsLock;
						} else { // 第1+次
							if (!!value.tableIsLock == curStatus) {
								allCount += 1;
							} else {
								allCount -= 1;
							}
						}
					}
					let curLen = Object.keys(curSelectedTableCopy).length;
					let same = allCount == curLen;
					if (!same) { // 不相同
						for (const [key, value] of Object.entries(curSelectedTableCopy)) {
							const tempTable = this.items.filter(v => v.tableID == value.tableID)[0];
							tempTable && (tempTable.selected = false);
						}
						// 先清空
						curSelectedTableCopy = {};
						this._.assign(curSelectedTableCopy, {
							[table.tableID]: table
						});
						table.selected = true;
						this.setCurSelectedTable(curSelectedTableCopy);
					} else { // 相同
						for (const [key, value] of Object.entries(curSelectedTableCopy)) {
							const tempTable = this.items.filter(v => v.tableID == value.tableID)[0];
							tempTable && (tempTable.selected = true);
						}
					}
					// debugger
				} else { // 如果存在与已选table中
					let curSelectedTableCopy = this.curSelectedTable;
					curSelectedTableCopy = this._.omit(curSelectedTableCopy, [
						[table.tableID]
					]);
					table.selected = false;
					this.setCurSelectedTable(curSelectedTableCopy);
				}
			}
			console.log(this.curSelectedTable);
			let btnInfo = this.isShowMultipleBtn();
			this.isShowBtn = btnInfo.canConfirm;
			this.lockBtnInfo = btnInfo.lockInfo;
			console.log({
				isShowBtn: this.isShowBtn,
				lockBtnInfo: this.lockBtnInfo
			})
		},
		// 是否能点击底部的按钮
		isShowMultipleBtn() {
			let canConfirm = true, lockInfo = {
				canLock: this.$cw.canOperLockedTable(), // 默认可以执行解锁or锁台操作
				lockStatus: 1, // 默认去锁定(1. 锁定 0. 解锁)
				curSelectedTable: [], // 需要锁台/解锁的桌台
			};
			let curSelectedTable = JSON.stringify(this.curSelectedTable);
			if (curSelectedTable != '{}') {
				// 有一个被锁，就都不能点确定了
				for (const [key, value] of Object.entries(this.curSelectedTable)) {
					// const tempTable = this.items.filter(v => v.tableID == value.tableID)[0];
					// tempTable && (tempTable.selected = false);
					if (!!value.tableIsLock) {
						canConfirm = false;
						lockInfo.lockStatus = 0;
					}
					lockInfo.curSelectedTable.push(value);
				}
				return {
					canConfirm,
					lockInfo
				};
			} else {
				return {
					canConfirm: false,
					lockInfo: {
						canLock: false, // 默认可以执行解锁or锁台操作
						lockStatus: 1, // 默认去锁定(1. 锁定 0. 解锁)
						curSelectedTable: [], // 需要锁台/解锁的桌台
					}
				};
			}
		},
		// 去当前订单详情
		gotoOrderInfo(tableIndex, order) {
			const curArea = this.area[this.pickerData.curFloorIdx];

			// 清空之前区域选中状态
			this.area.forEach(v => {
				v.selected = false;
				v.tableList.forEach(table => {
					table.selected = false;
				})
			});
			this.items.forEach(v => v.selected = false);
			// 清空之前桌台选中状态
			this.setCurSelectedTable({});
			curArea.selected = true;
			curArea.advance = true;
			this.setArea(this.area);

			console.log({
				'跳转到bookNow时的area信息': this.area
			});
			const url =
				`/pages/homePageSub/bookNow/bookNow?bookID=${order.bookID}&tableID=${order.tableID}&bookOn=${this.pickerData.date}&dinnerType=${this.pickerData.curMealTypeID}&isAllArea=${this.pickerData.curFloorIdx == 0 ? 1 : 0}`;
			// console.log(url);
			uni.navigateTo({
				url,
			});
		},
		// 确认预订
		confirm() {
			// 所有区域和当前区域
			const area = this.area;
			const curArea = this.area[this.pickerData.curFloorIdx];
			console.log(area);
			// 设置当前选中区域的selected为true
			area.forEach((item, index) => {
				item.selected = item.tableAreaID === curArea.tableAreaID;
				item.advance = item.tableAreaID === curArea.tableAreaID;
				item.tableList.forEach(table => {
					if (this.curSelectedTable[table.tableID]) {
						table.selected = true;
					} else {
						table.selected = false;
					}
				})
			})
			this.setArea(area);
			const {
				customerID,
				bookerName,
				bookerPhone,
				banquetId,
				fromPage,
				bookOn,
				banquetThemeTypeID,
			} = this.bookerInfo;
			let url = '';
			let param = util.urlEncode(this.bookerInfo).substring(1);
			// 如果存在电话，代表之前有选择过预订人【流程：首页——>搜索——>选择预订人——>立即预订——>selecTable】
			if (bookerPhone) { // 顺便把 banquetId,fromPage,bookOn 也带上,因为也有可能从宴会详情过来,bookerPhone也一定存在
				url =
					`/pages/homePageSub/bookNow/bookNow?${param}&dinnerType=${this.pickerData.curMealTypeID}&isAllArea=${this.pickerData.curFloorIdx == 0 ? 1 : 0}`;
				// 如果是宴会详情会带上bookOn,如果带上了就直接传,否则用本页面自己的pickerData.date
				url += bookOn ? '' : `&bookOn=${this.pickerData.date}`;
			} else {
				url =
					`/pages/homePageSub/bookNow/bookNow?bookOn=${this.pickerData.date}&dinnerType=${this.pickerData.curMealTypeID}&isAllArea=${this.pickerData.curFloorIdx == 0 ? 1 : 0}`;
			}
			// console.log(url);
			uni.navigateTo({
				url: url,
			});
		},
		// 拖动列表过程中触发的事件
		onChange(e) {
			// 事件节流
			if (this.canUse) {
				const {
					detail
				} = e;
				if (detail.source == 'out-of-bounds' && detail.y > 0) {
					let index = this.pickerData.curFloorIdx - 1;
					if (index >= 0) {
						this.selectFloor(index);
					}
					console.log('触发下拉回弹', e);
				}
				if (detail.source == 'out-of-bounds' && detail.y < 0) {
					let index = this.pickerData.curFloorIdx + 1;
					if (index < this.areatbs.length) {
						this.selectFloor(index);
					}
					console.log('触发上拉回弹', e);
				}
				this.canUse = false;
				setTimeout(() => this.canUse = true, 1000)
			}
		},
		// 触摸开始时，设置lockTable，阻止默认事件
		handleTouchStart(e, table) {
			// this.lockTable = table;
			// 先加进来
			// this.lockSelArr.push(table);
			// // 看所有table的tableIsLock是否是同一种状态
			// let curStatus = !!this.lockSelArr[0].tableIsLock, allCount = 0;
			// this.lockSelArr.forEach(v => {
			// 	if (!!v.tableIsLock == curStatus) {
			// 		allCount += 1;
			// 	}
			// });
			// let same = allCount == this.lockSelArr.length;
			// if (!same) { // 不相同
			// 	this.lockSelArr = [table];
			// }
			// console.log(this.lockSelArr);
		},
		// 一旦触摸滑动，取消lockTable
		handleTouchMove(e) {
			this.lockTable = null;
		},
		// touchend 清除计时
		handleTouchEnd(e) {
			clearInterval(this.pressTimer);
		},
		// 弹出锁台modal
		handleLongpress(e) {
			if (this.lockTable && this.lockTable.orderList.length == 0 && this.calcLockModalList.length > 0) {
				this.$refs.lockModal.open();
			}
		},
		handlePress(e, table) {
			console.log(e, table);
			this.lockTable = table;
			this.$nextTick(() => {
				this.$refs.lockModal.open();
			});
		},
		// 选择锁台modal
		async selectLockModal() {
			let tableInfo = this.lockBtnInfo;
			console.log(tableInfo.curSelectedTable.length);
			if (!tableInfo.curSelectedTable.length) return;
			let data = {
				bookLockData: this.pickerData.date + " 00:00:00", // 锁定预订的日期
				diningTypeID: this.pickerData.curMealTypeID, // 餐别主键ID
				tableID: [...tableInfo.curSelectedTable.map(v => v.tableID)], // 桌号维护表主键ID
				tableIsLock: tableInfo.lockStatus, // 桌子是否锁定(1锁定 0解锁)
			};
			const res = await NCY.TableLockingAndUnlocking(data);
			if (res) {
				uni.showToast({
					title: tableInfo.lockStatus == 1 ? '锁台成功' : '解锁成功',
				});
				tableInfo.curSelectedTable.forEach(rr => {
					// v.tableIsLock = tableInfo.lockStatus;
					const tempTable = this.items.filter(v => v.tableID == rr.tableID)[0];
					tempTable && (tempTable.selected = false);
					tempTable && (tempTable.tableIsLock = tableInfo.lockStatus);
				});
			}

			let curSelectedTableCopy = this.curSelectedTable;
			for (const [key, value] of Object.entries(curSelectedTableCopy)) {
				const tempTable = this.items.filter(v => v.tableID == value.tableID)[0];
				tempTable && (tempTable.selected = false);
			}
			// 先清空
			curSelectedTableCopy = {};

			this.setCurSelectedTable(curSelectedTableCopy);

			let btnInfo = this.isShowMultipleBtn();
			this.isShowBtn = btnInfo.canConfirm;
			this.lockBtnInfo = btnInfo.lockInfo;
		}
	},
	watch: {
		"userInfo.currentStoreId": {
			handler: function(val, oldval) {
				console.log('watch=>[selectTable]userInfo.currentStoreId');
				if (val) {
					// 重新获取客户经理列表
					this.setCurSelectedTable({});
					this.calcMoveAreaHeight();
					this.isShowMoveView = false;
					setTimeout(() => {
						this.isShowMoveView = true;
					});
				}
			},
		},
		"curSelectedTable": {
			handler: function(val) {
				console.log(val);
				let btnInfo = this.isShowMultipleBtn();
				this.isShowBtn = btnInfo.canConfirm;
				this.lockBtnInfo = btnInfo.lockInfo;
			},
			deep: true,
			immediate: true
		}
	}
}
