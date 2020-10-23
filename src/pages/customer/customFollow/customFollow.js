// 工具库
import moment from '@/lib/moment/moment.min.js';
import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';

// 网络请求
import CY18 from '@/service/CY/CY18AppService.js';
import CY19 from '@/service/CY/CY19AppService.js';
import CY57 from '@/service/CY/CY57AppService.js';
import CY61 from '@/service/CY/CY61AppService.js';
import CY69 from '@/service/CY/CY69AppService.js';

import {
	mapState,
	mapMutations
} from 'vuex';

const PAGESIZE = 10; // 列表每页请求数量

const app = getApp();

// 初始化侧边栏筛选条件数据
function initFilterData() {
	return {
		// 搜索条件
		classificationID: '', // 跟踪分类
		tags: '', // 标签
	};
}

export default {
	props: {
		payload: { // 接收从首页跳转过来传递的参数，用来判断「我的」还是「全店」跳转而来
			type: Object,
			default: function() {
				return {};
			},
		},
	},
	data() {
		return {
			// -------------- 批量操作多选客服经理picker START ---------------
			showMultipleSelPicker: false, // 是否显示批量操作的多选客服经理picker 双向绑定
			defaultSelected: [], // 批量操作的多选客服经理picker 默认选中项
			// -------------- 批量操作多选客服经理picker END ---------------

			// -------------- 图片link前缀 START -------------------
			picDomain: app.globalData.PicDomain,
			// -------------- 图片link前缀 END -------------------

			// ----------------------- data顶部筛选 START -----------------------
			isCSManagerFilter: false, // 是否展示客户经理panel
			currentFollow: { // 当前跟踪人
				value: storage.getAppUserInfo().marketerId,
				label: storage.getAppUserInfo().userName,
			},
			oriCSManagerArr: [], // storage中存储的客户经理

			traceStatusArr: [{ // 跟踪状态
					label: '待跟',
					value: '4',
					num: 0,
					numColor: 'yyt-error',
					selected: true,
				},
				{
					label: '已跟',
					value: '1',
					num: 0,
					numColor: 'yyt-warning',
					selected: false,
				},
				// {
				// 	label: '未跟',
				// 	value: '3',
				// 	num: 0,
				// 	numColor: 'yyt-orange',
				// 	selected: false,
				// },
				{
					label: '取消',
					value: '2',
					num: 0,
					numColor: 'text-grey',
					selected: false,
				},
			],
			// ----------------------- data顶部筛选 END -----------------------

			// ------------------------ data批量操作 START --------------------------
			isBatch: false, // 批量操作显示与否
			isAllSel: false, // 底部批量操作的全选按钮选中状态
			preAll: false, // 用户是否手动选择了全选按钮，默认为false
			checkboxSelectNum: 0, // checkbox已选中所有客户的个数(底部展示用)

			cstDataGUID: '', // 全选打标签等操作时，要传递的id
			isMarketConfirm: false, // 批量操作选择后弹出popup,true则弹窗,false不弹
			isMarketConfirmTips: false, // 是否展示popup弹窗提示
			marketConfirmTips: '', // popup弹窗提示
			tempChangeMarketerData: {}, // 批量操作的query, 确认CSManagerNoSelf后会用到
			isShowBatchOfCSManagerPanel: false, // 是否展示批量操作更换客户经理方式的panel
			customNum: 0, // 批量操作人数(用作批量操作[成功]后的提醒文字)
			marketConfirmRes: [], // 客户经理更改成功后的response数据
			curListRowCount: 0, // 当前筛选条件下,列表总条数
			// ------------------------ data批量操作 END --------------------------

			// ------------------------ data侧边栏 START ----------------------------
			isShowSidebar: false, // 默认不显示侧边栏
			trackClassificationArr: [], // 跟踪分类
			filterData: initFilterData(),
			// ------------------------ data侧边栏 END ----------------------------

			// ------------------------ data数据请求 START -------------------------
			CustomFollowQuery: {
				followDate: moment().format('YYYY-MM-DD') + ' 00:00:00',
				pageIndex: 1,
				pageSize: PAGESIZE,
				searchType: 1, // 1我的跟踪 2全部跟踪
				storeId: '',
				followState: 4, // 跟踪状态(1已跟踪 2已取消 3未跟踪 4待跟踪)
				isSearchMonth: 1,
				customerLabelIDList: [], // 侧边栏标签ids
				marketerId: storage.getAppUserInfo().marketerId,
				cwCompanyID: storage.getAppUserInfo().cwCompanyID,
				month: moment().format('YYYY-MM'),
				ruleCode: '', // 跟踪分类
			},
			customerList: [], // 客户跟踪列表数组
			moreList: [
				// 卡片list更多操作
				{
					label: '当月不再提醒',
					value: 0,
				},
			],
			// ------------------------ data数据请求 END -------------------------

			// ---------------------- dataMescroll配置 START ---------------------
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE, // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据',
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				},
			},
			// mescroll实例
			mescrollSingle: {},
			navFilterBottom: 288, // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度

			// 客户经理的数据 存储从远程过来的数据
			allMarketOrginData: [],
			// ---------------------- dataMescroll配置 END ---------------------
		};
	},
	mounted() {
		// 监听editCustomerLabel批量打标签成功事件
		uni.$on('addLabelForFollowListBatch', () => {
			// 刷新页面,关闭批量操作
			this.refresh();
			this.isBatch = false;
			this.preAll = false;
			this.checkboxSelectNum = 0;
		});
		uni.$on('refreshCustomFollow', () => {this.refresh();this.getViewcy18Page();});

		this.CustomFollowQuery.storeId = this.$storage.getAppUserInfo().currentStoreId;
		// 如果父组件传递了payload.dataType,证明从首页来,需判断[我的]还是[全店]
		let {
			dataType,
			tabIndex,
			status
		} = this.payload;
		// console.log(this.payload);
		if (dataType && tabIndex == 1) {
			this.dataType = dataType;
			this.traceStatusArr.forEach(v => v.selected = false);
			let filter = this.traceStatusArr.filter(v => v.label == status)[0];
			if (filter) {
				filter.selected = true;
				this.CustomFollowQuery.followState = filter.value;
			} else {
				this.CustomFollowQuery.followState = '';
			}
		}

		// 获取跟踪分类
		this.reqFollowClassification();
		// 获取客户经理列表
		this.reqCSManagerData(() => {
			this.transfCSManagerArr();
		});
	},
	methods: {
		// 侧边栏筛选[标签,公司]
		...mapMutations(['setCurrentFollowTagsObj']),
		...mapMutations(['setCurrentCustomerItem']),
		...mapMutations(['setUserInfo', 'setSalesAuthority']),

		// --------------------------- methods顶部筛选 START --------------------------------
		// 时间筛选
		chooseDate(e) {
			this.CustomFollowQuery.followDate = e.target.value + '-01 00:00:00';
		},
		// 弹出客户经理panel
		CSManagerFilterToggle() {
			if (!this.$cw.canSeeAllTrack()) return;
			this.isCSManagerFilter = !this.isCSManagerFilter;
		},
		// 选择客户经理
		seleCSManagerFilter(item) {
			// 重置全选状态，重置批量操作的显示
			this.isAllSel = false;
			this.preAll = false;
			this.checkboxSelectNum = 0;

			// item结构:
			// label: "黄芮"
			// value: "SL1855900000069"
			// selected: true
			this.isCSManagerFilter = false;

			if (item.selected) return;
			this.currentFollow = {
				label: item.label,
				value: item.value,
			};
			this.CustomFollowQuery.marketerId = item.value;
			this.CustomFollowQuery.searchType =
				this.CustomFollowQuery.marketerId == '' ? 2 : 1;
		},
		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.isCSManagerFilter = false;
		},
		// 顶部跟踪状态筛选
		selectTraceStatusFromFilter(item) {
			this.traceStatusArr.forEach((listItem) => {
				if (listItem.value == item.value) {
					listItem.selected = !listItem.selected;
					this.CustomFollowQuery.followState = listItem.selected ?
						item.value :
						'';
				} else {
					listItem.selected = false;
				}
			});
		},
		// --------------------------- methods顶部筛选 END --------------------------------

		// --------------------------- methods批量操作 START ---------------------------
		// 底部切换取消/全选
		toggleAllSel() {
			// 当切换前就是取消全选状态时，切换后就得把preAll状态改为true，代表用户想全选
			if (!this.isAllSel) {
				this.preAll = true;
			} else { // 当切换前是全选状态时，preAll这次就得为false
				this.preAll = false;
			}

			this.isAllSel = !this.isAllSel;

			// 如果用户点了全选，已选就应该是总数，否则为0
			if (this.preAll) {
				this.checkboxSelectNum = this.curListRowCount;
			} else {
				this.checkboxSelectNum = 0;
			}

			this.customerList.forEach((item) => {
				item.selected = this.preAll;
			});
		},
		// 展示更换客户经理panel
		showBatchCSManagerPanel() {
			if (!this.getCustomIDs().selected) {
				cw.showError('请选择客户!', 2000);
				return;
			}
			this.isShowBatchOfCSManagerPanel = true;
		},
		// 批量操作点击事件
		batchOperate() {
			this.isBatch = !this.isBatch;
		},
		// 返回以逗号隔开的当前选中客户id们
		getCustomIDs() {
			let selected = '';
			let unselected = '';
			this.customerList.forEach((item) => {
				if (item.selected) {
					selected += item.customerId + ',';
				} else {
					unselected += item.customerId + ',';
				}
			});
			return {
				selected: selected.substring(0, selected.length - 1),
				unselected: unselected.substring(0, unselected.length - 1),
			};
		},
		// 客户经理panel选择后触发
		changeMarketer(ruleType, tips) {
			this.$util.baiduEvent('更换客户经理', '客户跟踪页底部批量更换客户经理');
			let customIds = this.getCustomIDs().selected ? this.getCustomIDs().selected.split(',') : [];
			let unCustomIds = this.getCustomIDs().unselected ? this.getCustomIDs().unselected.split(',') : [];

			const data = {
				changeRule: ruleType,
				cstIDList: customIds, // 已选中
				excludeCstIDList: unCustomIds, // 未选中
				// isCstPool: isCstPool,
				marketerId: '',
				storeID: this.CustomFollowQuery.storeId,
				// 这里更改传的是 cW,本地存的又是cw,注意
				cWCompanyID: this.CustomFollowQuery.cwCompanyID,
				operatorID: storage.getAppUserInfo().id,
				cstDataGUID: this.isAllSel ? this.cstDataGUID : '',
			};
			// 临时存一份data,在确认picker后再用 confirmSalesNoSelf 方法
			this.tempChangeMarketerData = data;
			if (ruleType == 4) {
				// 更换到指定客户经理,要排除掉当前顶部筛选条件中已选中的客户经理(排己)
				this.CSManagerBatchArr = this.CSManagerBatchArr
					.filter(item => item.value != this.CustomFollowQuery.marketerId);
				this.$nextTick(() => {
					this.$refs.CSManagerNoSelfPicker.show();
				});
			} else if (ruleType == 3) { // 多选均分到客服经理
				this.showMultipleSelPicker = true;
			} else {
				this.isMarketConfirm = true;
				this.marketConfirmTips = tips;
				this.ruleType = ruleType;
			}
		},
		// 「modal前三种移动方式」确认某个规则下的批量更改客户经理的操作
		async confirmMarkert() {
			// 现有列表中已勾选的用户和未勾选的用户
			let customIds = this.getCustomIDs().selected ? this.getCustomIDs().selected.split(',') : [];
			let unCustomIds = this.getCustomIDs().unselected ? this.getCustomIDs().unselected.split(',') : [];

			let data = {
				changeRule: this.ruleType,
				cstIDList: customIds, // 选中的
				excludeCstIDList: unCustomIds, // 未选中的
				// isCstPool: isCstPool,
				marketerId: '',
				storeID: this.CustomFollowQuery.storeId,
				cWCompanyID: this.CustomFollowQuery.cwCompanyID,
				operatorID: storage.getAppUserInfo().id,
				cstDataGUID: this.preAll ? this.cstDataGUID : '',
			};

			// 当前顶部筛选的选中的客服经理
			var curTopSeleCS = this.CSManagerFilterArr.filter(v => v.selected)[0];
			if (curTopSeleCS) {
				data.selMarketerId = curTopSeleCS.value;
			}

			let result = await CY19.ChangeCstMarketer(data);
			if (result) {
				// dtos: 客户经理信息, cstIds: 被移动客户列表
				let {
					dtos,
					cstIds,
					delCstIds: needDels
				} = result;
				// 本地更新
				this.customNum = cstIds.length;

				// 更新当前已加载客户列表,移除已更换了客户经理的客户数据,并且更新顶部筛选当前客户经理旗下客户列表总个数
				let array = [],
					newRowCount = this.curListRowCount;
				this.customerList.forEach((item) => {
					item.selected = false;

					if (this.CustomFollowQuery.marketerId !== '') { // 不是全部筛选条件时
						// 看当前这个客户是否已经不属于自己(需要从当前列表中删除的)
						var needD = needDels ? needDels.some(ctId => ctId == item.customerId) : null;
						if (!needD) { // 1. 如果还属于自己 保留
							array.push(item); // 把没操作的客户数据推入array
						} else { // 2. 如果不属于自己，就减去已操作的客户数
							--newRowCount;
						}
					} else {
						if (dtos) {
							dtos.forEach(v => {
								// 该客服经理变更信息
								var csInfo = v;
								// dtos:[{
								// cstIds: ["CUS19050206000052517", "CUS18040409000021048"]
								// marketerId: "CY174585400000241"
								// marketerName: "蔡彩"
								// splitGetCstCount: 2
								// userGUID: "00000000-0000-0000-0000-000000000000"
								// }]
								// cstIds 是变更到此客服经理下的客户id集合
								if (csInfo.cstIds) {
									// 看当前客户在不在集合中，在就变更客服经理名称
									var target = csInfo.cstIds.some(cs => cs == item.customerId);
									if (target) item.marketer = v.marketerName;
								}
							});
						}
						array.push(item);
					}
				});
				// 更新当前列表
				this.customerList = array;
				// 变更客服经理后，客户就需要被锁定
				array.forEach(v => {
					v.isLockMarket = 1;
				});
				// 更新当前列表总条数
				this.curListRowCount = newRowCount >= 0 ? newRowCount : 0;
				// 选中数归零
				this.checkboxSelectNum = 0;

				// 仅更新顶部跟踪状态数据
				let data2 = Object.assign({}, {
					...this.CustomFollowQuery,
				});
				data2.isOnlyGetStatusStat = 1;
				let r = await CY61.GetSalesForecast(data2);
				if (r) {
					this.traceStatusArr.forEach((item) => {
						if (item.label == '待跟') {
							item.num = r.stayFollowCount;
						} else if (item.label == '已跟') {
							item.num = r.alreadyCount;
						} else if (item.label == '未跟') {
							item.num = r.noFollowCount;
						} else if (item.label == '取消') {
							item.num = r.cancelFollowCount;
						}
					});
				}

				// 重置各种状态
				this.isMarketConfirm = false;
				this.isShowBatchOfCSManagerPanel = false;
				this.isMarketConfirmTips = true;
				this.isBatch = false;

				// 更新「已将XXX个客户更换至：XXX」提示信息
				this.marketConfirmRes = dtos ? dtos : [];
				// 如果全选，刷新页面
				if (this.preAll) {
					this.refresh();
				}
				this.preAll = false;
				this.isAllSel = false;
				// 获取客户经理列表
				this.getViewcy18Page();
				// 重置批量多选客服经理的已选客服经理
				this.defaultSelected = [];
			}
		},
		// 取消批量操作的,更换到指定客户经理操作
		cancelChangeCSManagerNoSelfPicker() {
			// 啥也不做
		},
		// 批量操作 多选picker客服经理确认操作
		async confirmMultipleSel(items) {
			this.$util.baiduEvent('分配至客户经理', '客户列表页底部批量更换客户经理');

			let selectText = items.map(v => v.label).join(","); // 选中销售经理们的名字
			let selectItems = items.map(v => {
				return {
					label: v.label,
					value: v.value
				}
			});

			// 从changeMarketer临时存的变量过来的data
			let data = this.tempChangeMarketerData;
			data.marketerIds = items.map(v => v.value);
			data.cstDataGUID = this.preAll ? this.cstDataGUID : '';
			// 当前顶部筛选的选中的客服经理
			var curTopSeleCS = this.CSManagerFilterArr.filter(v => v.selected)[0];
			if (curTopSeleCS) {
				data.selMarketerId = curTopSeleCS.value;
			}

			let result = await CY19.ChangeCstMarketer(data);
			if (result) {
				// 被执行了分配操作的, 接收到分配客户的客服经理集合, 当前顶部选中客服经理下需要删除的客户id集合
				let {
					cstIds,
					dtos,
					delCstIds: needDels
				} = result;
				// result: {
				// cstIds:[0: "CUS20093621700253652"],
				// dtos:[{
				// marketerId: "CY176627400000237",marketerName: "ceshi",splitGetCstCount: 22
				// ]}

				this.isShowBatchOfCSManagerPanel = false;
				setTimeout(() => {
					uni.showToast({
						title: '更换客户经理成功!',
						duration: 2000,
					});
				});

				// 更新当前已加载客户列表,移除已更换了客户经理的客户数据,并且更新顶部筛选当前客户经理旗下客户列表总个数
				let array = [],
					newRowCount = this.curListRowCount;
				this.customerList.forEach((item) => {
					item.selected = false;
					if (this.CustomFollowQuery.marketerId !== '') { // 不是全部筛选条件时
						// 看当前这个客户是否已经不属于自己(需要从当前列表中删除的)
						var needD = needDels ? needDels.some(ctId => ctId == item.customerId) : null;
						if (!needD) { // 1. 如果还属于自己 保留
							array.push(item); // 把没操作的客户数据推入array
						} else { // 2. 如果不属于自己，就减去已操作的客户数
							--newRowCount;
						}
					} else { // 是全部筛选条件时，需要更新选中客户的新的客服经理名称
						if (dtos) {
							dtos.forEach(v => {
								// 该客服经理变更信息
								var csInfo = v;
								// dtos:[{
								// cstIds: ["CUS19050206000052517", "CUS18040409000021048"]
								// marketerId: "CY174585400000241"
								// marketerName: "蔡彩"
								// splitGetCstCount: 2
								// userGUID: "00000000-0000-0000-0000-000000000000"
								// }]
								// cstIds 是变更到此客服经理下的客户id集合
								if (csInfo.cstIds) {
									// 看当前客户在不在集合中，在就变更客服经理名称
									var target = csInfo.cstIds.some(cs => cs == item.customerId);
									if (target) item.marketer = v.marketerName;
								}
							});
						}
						array.push(item);
					}
				});
				// 更新当前列表
				this.customerList = array;
				// 变更客服经理后，客户就需要被锁定
				array.forEach(v => {
					v.isLockMarket = 1;
				})
				// 更新当前列表总条数
				this.curListRowCount = newRowCount >= 0 ? newRowCount : 0;

				// 更新顶部跟踪状态数据
				let data2 = Object.assign({}, {
					...this.CustomFollowQuery,
				});
				data2.isOnlyGetStatusStat = 1;
				let r = await CY61.GetSalesForecast(data2);
				if (r) {
					this.traceStatusArr.forEach((item) => {
						if (item.label == '待跟') {
							item.num = r.stayFollowCount;
						} else if (item.label == '已跟') {
							item.num = r.alreadyCount;
						} else if (item.label == '未跟') {
							item.num = r.noFollowCount;
						} else if (item.label == '取消') {
							item.num = r.cancelFollowCount;
						}
					});
				}

				this.isBatch = false;
				this.checkboxSelectNum = 0;
				// 如果全选，刷新页面
				if (this.preAll) {
					this.refresh();
				}
				this.preAll = false;
				this.isAllSel = false;
				// 获取客户经理列表
				this.getViewcy18Page();
				this.defaultSelected = [];
			}
		},
		// 「更换到指定客户经理」确定批量操作中,更换到指定客户经理操作
		async confirmChangeCSManagerNoSelf(e) {
			let selectText = e.result; // 选中销售经理名字
			let {
				label,
				value
			} = e.checkArr;
			let selectItems = {
				label,
				value,
			}; //  e.checkArr选中销售经理结构：(label,value) 和 selectedCS 需要的结构相同

			// 从changeMarketer临时存的变量过来的data
			let data = this.tempChangeMarketerData;
			data.marketerId = selectItems.value;
			data.cstDataGUID = this.preAll ? this.cstDataGUID : '';
			console.log({
				'批量更改,更换到指定客户经理的请求data': data,
			});

			let result = await CY19.ChangeCstMarketer(data);
			this.isShowBatchOfCSManagerPanel = false;
			setTimeout(() => {
				uni.showToast({
					title: '更换客户经理成功!',
					duration: 2000,
				});
			});
			// 更新当前已加载客户列表,移除已更换了客户经理的客户数据,并且更新顶部筛选当前客户经理旗下客户列表总个数
			let array = [],
				newRowCount = this.curListRowCount;
			this.customerList.forEach((item) => {
				item.selected = false;
				let someone = data.cstIDList.some((id) => item.customerId == id);
				if (!someone) array.push(item); // 把没操作的客户数据推入array
				if (someone && this.CustomFollowQuery.marketerId !== '') --newRowCount; // 减去已操作的客户数(当前位全部时,不减)
			});
			this.customerList = array;
			this.curListRowCount = newRowCount;

			// 更新顶部跟踪状态数据
			let data2 = Object.assign({}, {
				...this.CustomFollowQuery,
			});
			data2.isOnlyGetStatusStat = 1;
			let r = await CY61.GetSalesForecast(data2);
			if (r) {
				this.traceStatusArr.forEach((item) => {
					if (item.label == '待跟') {
						item.num = r.stayFollowCount;
					} else if (item.label == '已跟') {
						item.num = r.alreadyCount;
					} else if (item.label == '未跟') {
						item.num = r.noFollowCount;
					} else if (item.label == '取消') {
						item.num = r.cancelFollowCount;
					}
				});
				console.log(this.traceStatusArr);
			}

			this.isBatch = false;
			this.checkboxSelectNum = 0;
			// 如果权限，更新 共筛选客户文字
			if (this.preAll) {
				this.refresh();
			}
			this.preAll = false;
			this.isAllSel = false;
		},
		// 去批量打标签
		goBatchLables() {
			this.$util.baiduEvent('打标签', '客户跟踪页底部批量打标签');
			if (!this.getCustomIDs().selected || this.getCustomIDs().selected == '') {
				cw.showError('请选择客户!', 2000);
				return;
			}
			const ids = this.getCustomIDs().selected;
			const unids = this.getCustomIDs().unselected;
			const cstDataGUID = this.preAll ?
				`&cstDataGUID2=${this.cstDataGUID}` :
				'';
			uni.navigateTo({
				url: `/pages/_common/editCustomerLabel/editCustomerLabel?followList=${encodeURI(ids)}&unFollowList=${encodeURI(unids)}${cstDataGUID}`,
			});
		},
		// uni-app复选框事件监听
		checkboxChange(e) {
			var items = this.customerList,
				values = e.detail.value;

			// 上次列表选中数量，当前列表选中数量
			let preListSelTotal = items.reduce((total, cur, idx) => {
					return total += cur.selected == true;
				}, 0),
				curListSelTotal = values.length;
			// console.log(this.preAll);
			// 每次勾选的时候，先查看用户是否选择过全选
			if (this.preAll) {
				// currentCount=AllCount-未选中
				console.log(this.preAll, curListSelTotal);
				this.checkboxSelectNum = this.curListRowCount - (this.customerList.length - curListSelTotal);
			} else {
				this.checkboxSelectNum = curListSelTotal;
			}

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (values.includes(item.customerFollowID.toString())) {
					this.$set(item, 'selected', true);
				} else {
					this.$set(item, 'selected', false);
				}
			}
			// 判断是否是全选
			var allSelected = this.customerList.every((item) => item.selected);
			this.isAllSel = allSelected ? true : false;
			// console.log(this.customerList.map(v => v.selected), this.isAllSel);
		},
		// --------------------------- methods批量操作 END ---------------------------

		// ---------------------------- methods卡片 START -----------------------
		// 去客户详情页
		gotoCustomInfo(ct) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(ct);
			getApp().globalData.customerPageData.fllowData.customerFollowID = ct.customerFollowID;
			getApp().globalData.customerPageData.fllowData.phone = ct.phone;
			getApp().globalData.customerPageData.isFollowGo = true;
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${ct.customerId}&isFllow=${true}&fromPage=follow-list`,
			});
		},
		// 获取客户等级
		getCustomLevelImgUrl(item) {
			if (item.imgUrl) {
				return this.$cw.ImgServerUrl + item.imgUrl;
			} else if (item.customerLevelImgUrl) {
				return cw.ImgServerUrl + item.customerLevelImgUrl;
			} else {
				return 'https://pic.cwyyt.cn/upload/yytApp/images/level_D.png';
			}
		},
		// 去打电话
		gotoCallPhone(ct) {
			this.$util.baiduEvent('打电话', '客户跟踪页列表项打电话');
			if (cw.isApp(true)) {
				getApp().globalData.customerPageData.isFollowGo = true;
				getApp().globalData.customerPageData.fllowData.phone = ct.phone;
				getApp().globalData.customerPageData.fllowData.customerFollowID = ct.customerFollowID;
				cw.callPhone(ct.phone, 0,() => {
					this.refresh();
				});
			}
		},
		// 去发信息
		gotoSendMsg(ct) {
			this.$util.baiduEvent('发短信', '客户跟踪页列表项发短信');
			getApp().globalData.customerPageData.fllowData.customerFollowID = ct.customerFollowID;
			getApp().globalData.customerPageData.fllowData.phone = ct.phone;
			let url =
				`/pages/customerSub/sendMsg/sendMsg?isFllow=${true}&customerID=${
					ct.customerId
				  }&customerName=${ct.customerName}&phone=${ct.phone}&msgName=${
					ct.msgName || ct.customerName
				  }&customSaveName=${
					ct.saleForecastLastFollow
					  ? ct.saleForecastLastFollow.customSaveName
					  : ''
				  }`;
			uni.navigateTo({
				url,
			});
		},
		// 去跟踪记录
		gotoRecord(ct) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(ct);
			getApp().globalData.customerPageData.fllowData.customerFollowID = ct.customerFollowID;
			getApp().globalData.customerPageData.fllowData.phone = ct.phone;
			const url = `/pages/_common/customInfo/customInfo?customerId=${ct.customerId}&tabIndex=1&isFllow=${true}`;
			uni.navigateTo({
				url,
			});
		},
		// 计算每个客户item的morelist菜单有哪些选项
		calcMoreList(curCustomer) {
			// 如果当前选择的客户的客户经理不是当前登录人
			if (
				curCustomer.marketerID != storage.getAppUserInfo().marketerId
			) {
				return this.moreList.filter((menu) => menu.label != '当月不再提醒');
			} else {
				// 当前选择的客户的跟踪状态 followState 不是 [待跟4] ,也不能操作当月不再提醒
				if (curCustomer.followState != 4) {
					return this.moreList.filter((menu) => menu.label != '当月不再提醒');
				} else {
					return this.moreList;
				}
			}
		},
		// 选择了更多气泡菜单中的某一项
		async triggerMenu(curMenu, curCustomer) {
			let [error, res] = await uni.showModal({
				title: '提示',
				content: '确定当月不在提醒？'
			});

			if (res.confirm) {
				let obj = {
					followState: '2',
					id: curCustomer.customerFollowID,
				};
				let result = await this.$cw.currentMonthNoRemind(obj);
				// 清除当前选中列表项
				this.$cw.removeAaary(this.customerList, curCustomer);
				//更新顶部跟踪显示
				this.getViewcy18Page();
				// 顶部待跟数字减一
				if (this.traceStatusArr[0].num > 0) {
					this.traceStatusArr[0].num--;
					this.traceStatusArr[2].num++;
				}

				uni.showToast({
					title: '取消提醒成功',
					duration: 2000,
				});
			}
		},
		// ---------------------------- methods卡片 END -----------------------

		// ---------------------------- methods侧边栏抽屉 -------------------------------
		// 显示抽屉
		showDrawer() {
			this.isShowSidebar = true;
		},
		// 显示抽屉
		closeDrawer() {
			this.isShowSidebar = false;
		},
		// 选择跟踪分类
		selectClassificationFromSidebar(item) {
			this.filterData.classificationID =
				this.filterData.classificationID !== item.value ? item.value : '';
			console.log('选择的跟踪分类ID', this.filterData.classificationID);
		},
		// 去标签选择页
		gotoTagsPage() {
			uni.navigateTo({
				url: '/pages/_common/editCustomerLabel/editCustomerLabel?sidebar=followList',
			});
		},
		// 重置侧边栏数据
		resetSidebar() {
			this.filterData = initFilterData();

			//清空vuex当前标签状态
			this.setCurrentFollowTagsObj({
				content: '',
				ids: '',
			});

			this.$storage.setCurrentFollowTagList([]);
		},
		// 确认侧边栏数据
		confirmSidebar() {
			console.log('点击完成后的筛选条件', this.filterData);

			this.isShowSidebar = false;

			const {
				classificationID,
				tags
			} = this.filterData;
			this.CustomFollowQuery.ruleCode = classificationID;
			this.CustomFollowQuery.customerLabelIDList =
				tags === '' ? [] : tags.split(','); // 数组

			this.refresh();
		},
		// ---------------------------- methods数据请求 --------------------------
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = this.CustomFollowQuery;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			data.month = moment(this.CustomFollowQuery.followDate).format('YYYY-MM');
			if (!getApp().globalData.customerPageData.isLoadFollow) return; // 不为true 不加载;
			// 获取客户跟踪列表
			let result = await CY61.GetSalesForecast(data);
			// console.log({
			// 	异步获取的客户列表数据: result,
			// });
			// this.isAllSel = false;
			this.cstDataGUID = result.cstDataGUID ? result.cstDataGUID : '';
			if (result.pageReults) {
				this.curListRowCount = result.pageReults.rowCount;
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.pageReults.dataList.map((ct) => {
					return {
						...ct,
						selected: this.preAll ? true : false, // checkbox用
					};
				});
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.pageReults.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) this.customerList = []; //如果是第一页需手动置空列表

				this.traceStatusArr.forEach((item) => {
					if (item.label == '待跟') {
						item.num = result.stayFollowCount;
					} else if (item.label == '已跟') {
						item.num = result.alreadyCount;
					} else if (item.label == '未跟') {
						item.num = result.noFollowCount;
					} else if (item.label == '取消') {
						item.num = result.cancelFollowCount;
					}
				});

				this.customerList = this.customerList.concat(curPageData); //追加新数据
				console.log({
					客户列表customerList: this.customerList,
				});
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// 请求跟踪分类
		async reqFollowClassification() {
			let result = await CY69.GetAllStoreSettingTemplate({
				onlyGetCustomer: 1
			});
			if (result.items) {
				let obj={
					name: '客户回访',
					code: 'returnVisit',
				}
				result.items.push(obj);
				this.trackClassificationArr = result.items.map((v) => {
					return {
						label: v.name,
						value: v.code,
					};
				});
			}
		},
		// 异步获取客户经理数据
		reqCSManagerData(success) {
			// getChooseMarketData结构:
			// {
			// 	"value":"SL9449800000125",
			// 	"text":"01",
			// 	"salseImg":"https://pic.yunyutian.cn//upload/img/20190704/1521362136_003.jpg",
			// }
			let marketData = this.$storage.getChooseMarketData();
			// let allNum = this._.sumBy(marketData, 'trackCount');
			marketData.splice(0, 0, {
				value: '',
				text: `全部跟踪`,
			});
			marketData.push({
				value: 'QT',
				text: '其他',
			});
			this.oriCSManagerArr = marketData;
			success && success();
		},

		// ------------------------- methods数据处理 -------------------------
		/**
		 * @description 转化 oriCSManagerArr 数据为带数字的
		 * @param {Number} type 所有客户:0/客户池:1
		 * @param {Boolean} fromHome 是否从首页过来
		 */
		transfCSManagerArr() {
			// 初始化筛选条件
			if (this.dataType) {
				this.initDefaultFilter(this.dataType);
			} else {
				this.localDefaultFilter();
			}
		},
		// 用来处理跳转到此页面时,顶部的默认筛选状态.目前:展示全部还是当前人. 将dataType传入,可能的值为['个人', '全部']
		initDefaultFilter(dataType) {
			let data = this.CustomFollowQuery;
			// console.log(dataType);
			if (dataType == '个人') {
				// 我的
				// 设置顶部filter客服
				this.currentFollow.label = storage.getAppUserInfo().userName;
				this.currentFollow.value = storage.getAppUserInfo().marketerId;
				// 设置顶部filter客户panel高亮客户
				data.marketerId = this.currentFollow.value;
				// 如果为全部,则将 searchType 改为 2
				this.CustomFollowQuery.searchType = data.marketerId == '' ? 2 : 1;
			} else {
				// 全店
				if (this.$cw.canSeeAllTrack()) {
					// 第一个数据是全部
					let item = this.oriCSManagerArr[0];
					this.currentFollow.label = item.text;
					this.currentFollow.value = item.value;
					data.marketerId = '';
					// 如果为全部,则将 searchType 改为 2
					this.CustomFollowQuery.searchType = data.marketerId == '' ? 2 : 1;
				}
			}
			this.dataType = '';
		},
		// 本地改变筛选后的选中状态UI改变
		localDefaultFilter() {
			let data = this.CustomFollowQuery;
			// 设置顶部filter客户panel高亮客户
			data.marketerId = this.currentFollow.value;
			// 如果为全部,则将 searchType 改为 2
			this.CustomFollowQuery.searchType = data.marketerId == '' ? 2 : 1;
		},
		// 获取本店客户经理
		async getViewcy18Page() {
			let result = (
				await CY18.GetStoreManager({
					month: this.CustomFollowQuery.month,
					StoreID: this.CustomFollowQuery.storeId,
				})
			).result;

			this.allMarketOrginData = result.dataList;
			let allMarketData = result.dataList;
			let marketDatas = [];
			let allMarketDatas = [];
			allMarketData.forEach((item, index) => {
				// 只展示在APP中显示的销售员
				var obj = {
					value: item.marketerID,
					text: `${item.marketerName}`,
					trackCount: item.trackCount,
					salseImg: item.imgUrl ?
						this.$cw.ImgServerUrl + '/' + item.imgUrl : 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png',
				};
				
				// 不禁用的客户经理才能弹出进行选择
				if(!item.userIsDisabeld){
					marketDatas.push(obj);
				}
				

				if (item.customerPoolCount > 0) {
					var obj2 = {
						value: item.marketerID,
						text: item.marketerName + `(${item.customerPoolCount})`,
					};
					allMarketDatas.push(obj2);
				}
			});
			// 存进localStorage
			this.$storage.setChooseMarketData(marketDatas);
			this.$storage.setAllChooseMarketData(allMarketDatas);
			//顶部客服经理的显示
			let n = this._.findIndex(marketDatas, x => x.value == this.CustomFollowQuery.marketerId);
			if (n != -1) {
				this.currentFollow.label = `${marketDatas[n].text}`
			}
			// 重新获取客户经理列表
			this.reqCSManagerData(() => {
				this.transfCSManagerArr();
			});
		},

		// -------------------------- methodsUI 处理 ----------------------
		// 计算mescroll距离顶部距离
		calcMescrollTop() {
			// this.$nextTick(() => {
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query
			// 		.select('.trace-status-wrapper')
			// 		.boundingClientRect((data) => {
			// 			this.navFilterBottom = data.bottom.toString();
			// 			console.log('fllow', this.navFilterBottom);
			// 		})
			// 		.exec();
			// });
		},
	},
	computed: {
		// 侧边栏vuex数据
		...mapState(['currentFollowTagsObj']),
		...mapState({
			currentCustomerItem: 'currentCustomerItem',
			salesAuthority: (state) => state.user.salesAuthority,
		}),
		// 批量操作显示的客户经理(不带全部跟踪+其他)
		CSManagerBatchArr() {
			let allData = this._.cloneDeep(this.allMarketOrginData);
			// 禁用的不展示
			let batchMarket = this._(allData).chain()
				.filter(x => x.userIsDisabeld == 0)
				.map(x => ({
					label: x.marketerName,
					value: x.marketerID,
					selected: false,
				})).value();

			return batchMarket;
		},
		// 顶部客户经理的下拉列表展示的数据
		CSManagerFilterArr() {
			let allData = this._.cloneDeep(this.allMarketOrginData);
			let currentMarkId = this.$storage.getAppUserInfo().marketerId;
			let topMarketData = this._(allData).chain()
				.map(x => ({
					value: x.marketerID,
					label: `${x.marketerName}`,
					selected: x.marketerID == this.currentFollow.value,
					trackCount: x.trackCount,
				}))
				.orderBy(['trackCount'], ['desc']).value();
			topMarketData.unshift({
				value: '',
				label: `全部跟踪`,
				selected: this.currentFollow.value == ""
			})

			topMarketData.push({
				value: 'QT',
				label: '其他',
				selected: false
			});

			return topMarketData;
		},
		customTips() {
			var str = [];
			this.marketConfirmRes.forEach((item) => {
				str.push(
					item.marketerName +
					'(' +
					(item.splitGetCstCount > 9 ?
						item.splitGetCstCount :
						'0' + item.splitGetCstCount) +
					')'
				);
			});
			return str.join(',');
		},

		// -------------------------- computed卡片 ---------------------
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != '' && url != null) {
					return 'url(' + encodeURI(url) + ')';
				} else {
					return 'url("https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png")';
				}
			};
		},
	},
	filters: {
		// 顶部lable的过滤
		currentTopLabel(lable, marketId) {
			let marketDatas = storage.getChooseMarketData();
			let marketItem = marketDatas.find(x => x.value == marketId && x.value != '');
			return marketItem ? `${lable}(${marketItem.trackCount})` : lable;
		}
	},
	watch: {
		// ---------------------- watch顶部跟踪状态筛选改变 --------------------
		'CustomFollowQuery.followState': {
			handler: function(val, oldval) {
				this.refresh();
			},
		},
		'CustomFollowQuery.followDate': {
			handler: function(val, oldval) {
				if (val) {
					console.log('Watch:CustomFollowQuery.followDate');
					this.refresh();
					this.getViewcy18Page();
				}
			},
		},
		'CustomFollowQuery.storeId': {
			handler: function(val, oldval) {
				if (val) {
					console.log('Watch:CustomFollowQuery.storeId');
					this.refresh();
					this.getViewcy18Page();
				}
			},
		},
		'CustomFollowQuery.marketerId': {
			handler: function(val, oldval) {
				this.refresh();
			},
		},
		salesAuthority: {
			handler: function(val, oldval) {
				console.log('Watch:salesAuthority => salesAuthority');
				this.getSalesAuthority = val;
			},
			deep: true,
		},
		payload: {
			handler(val, oldVal) {
				console.log('[customFollow watch]: payload', val);
				if (val.tabIndex == 1) {
					let {
						dataType,
						tabIndex,
						status
					} = val;
					this.dataType = dataType;
					// 只有dataType有值,才重新初始化顶部展示
					if (this.dataType) {
						this.initDefaultFilter(this.dataType);
						this.traceStatusArr.forEach(v => v.selected = false);
						let filter = this.traceStatusArr.filter(v => v.label == status)[0];
						if (filter) {
							filter.selected = true;
							this.CustomFollowQuery.followState = filter.value;
						} else {
							this.CustomFollowQuery.followState = '';
						}
					}
				}
			},
			deep: true,
		},
		// --------------------- watch侧边栏筛选 -------------------
		currentFollowTagsObj: {
			handler(val) {
				// 更新filterData数据,但不更新CustomFollowQuery参数,要改变CustomFollowQuery参数,得在侧边栏点击确认才行
				this.filterData.tags = val.ids;
			},
			deep: true,
		},
	},
};
