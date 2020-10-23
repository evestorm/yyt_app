// import-library
import cw from '@/common/ceiwei/common.js';
import moment from '@/lib/moment/moment.min.js';
import storage from '@/common/unistorage/index.js';
import util from '@/common/util.js';

// import-api
import CY19 from '@/service/CY/CY19AppService.js';

// import-vuex
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

// const-collection
const PageConstData = {
	app: getApp(),
	pageSize: 10, // 每次请求页码
	currentUser: storage.getAppUserInfo(), // 当前登录人信息
	initFilterData: function() { // 初始化侧边栏筛选项
		return {
			levelID: '', // 客户等级ID
			sellerID: storage.getAppUserInfo().marketerId || '', // 客户经理ID
			sellerName: storage.getAppUserInfo().userName || '', // 客户经理名称
			isCustomerPool: false, // 默认读客户池的客户经理数据
			wajueID: '', // 挖掘条件
			tags: '', // 标签
			startDate: '', // 时间区间
			endDate: '', // 格式:2019-12-27 00:00:00"
			minMoney: '', // 人均消费范围
			maxMoney: '',
			minCount: '', // 消费频次范围
			maxCount: '',
			companyID: '', // 单位id
			companyName: '', // 没有选中单位直接搜索关键词时传递
			settleStatus: '', // 已整理 / 未整理
		};
	}
};

export default {
	props: {
		payload: { // 首页传递过来的载荷，用来判断「我的」还是「全店」
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			PageConstData, // 常量对象
			picDomain: PageConstData.app.globalData.PicDomain, // 图片baseURL

			// -------------- data-批量操作多选客服经理picker-START ---------------
			showMultipleSelPicker: false, // 是否显示picker 双向绑定
			mutipleSelDefaultSelected: [], // picker默认选中项
			// -------------- data-批量操作多选客服经理picker-END ---------------

			// -------------- data-顶部筛选-START ----------------
			consumeSortArr: [{ // 消费排序
					label: '最近消费',
					selected: true,
					value: 1,
				},
				// {
				// 	label: '最近添加',
				// 	selected: false,
				// 	value: 2,
				// },
				// {
				// 	label: '等级升序',
				// 	selected: false,
				// 	value: 3,
				// },
				{
					label: '等级降序',
					selected: false,
					value: 4,
				},
				{
					label: '单次消费额由高到低',
					selected: false,
					value: 5,
				},
				{
					label: '消费次数由高到低',
					selected: false,
					value: 6,
				},
			],
			showConsumeSort: false, // 消费排序panel弹出

			customerTypeArr: [{ // 客户筛选
					label: '所有客户',
					selected: true,
				},
				{
					label: '价值客户池',
					selected: false,
				},
			],
			showCustomerType: false, // 客户panel弹出
			isCSManagerFilter: false, // 客户经理panel弹出

			currentSelCS: {
				// 当前选中客户经理信息
				label: PageConstData.currentUser.userName,
				value: PageConstData.currentUser.marketerId,
			},
			dataType: '个人', // 首页是从[我的 个人]还是[全部]过来

			// -------------- data-顶部筛选-END ----------------

			// ----------------------- data-批量操作相关-START ----------------------------
			isBatch: false, // 批量操作显示与否
			isAllSel: false, // 底部批量操作的全选按钮选中状态
			preAll: false, // 用户是否手动选择了全选按钮，默认为false
			checkboxSelectNum: 0, // checkbox已选中所有客户的个数(底部展示用)

			cstDataGUID: '', // 全选打标签等操作时，要传递的id
			isMarketConfirm: false, // 批量操作选择后弹出popup,true则弹窗,false不弹
			isMarketConfirmTips: false, // 是否展示popup弹窗提示
			marketConfirmTips: '', // popup弹窗提示
			CSManagerBatchArr: [], // 批量操作显示的客户经理(不带全部)
			isShowBatchOfCSManagerPanel: false, // 是否展示批量操作更换客户经理方式的panel
			isShowBatchOfMoveTrackPanel: false, // 是否展示批量操作移入跟踪的panel
			tempChangeMarketerData: {}, // 批量操作的query, 确认CSManagerNoSelf后会用到
			customNum: 0, // 批量操作人数(用作批量操作成功后的提醒文字)
			marketConfirmRes: [], // 客户经理更改成功后的response数据
			moveTrackDate: '', // 移入跟踪选择的时间
			moveTrackRemark: '', // 移入跟踪输入的备注
			// ----------------------- data-批量操作相关-END ----------------------------

			// --------------------- data-侧边栏 ----------------------
			isShowSidebar: false, // 默认不显示侧边栏

			filterData: PageConstData.initFilterData(),
			customerLevelArr: [], // 客户等级
			// wajueArr: [], // 挖掘条件

			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: moment().subtract(10, 'years').format('YYYY'),
			endDateStr: moment().add(10, 'years').format('YYYY'),
			defaultDateRangeArr: [], // ['2010','01','01','-','2030','01','01']

			// 滑块范围[消费金额,消费频次]
			barSumHeight: 30, // 滑块总高度(不含小圆点上方提示)
			barHeight: 3, // 滑块进度条高度
			blockSize: 16, // 滑块大小
			barBackgroundColor: '#EEEEF6', // 滑块进度条背景色
			barActiveColor: '#0094ff', // 已选中区间进度条颜色
			sliderRangeMoney: {
				min: 0,
				max: 300,
				step: 10,
				rangeValue: [0, 300],
			}, // 消费金额滑块
			sliderRangeCount: {
				min: 0,
				max: 5,
				step: 1,
				rangeValue: [0, 5],
			}, // 消费频次滑块
			settleFilterArr: [{
					// 客户/客户池筛选
					label: '已整理',
					value: '1',
					selected: false,
				},
				{
					label: '未整理',
					value: '0',
					selected: false,
				},
			],

			// ---------------------- data数据请求 ---------------------
			customerListQuery: {
				// 客户列表参数
				cstLevel: '',
				dynamicConditionConfigID: '',
				feeStartDateTime: '',
				feeEndDateTime: '',
				avgFeeStart: '',
				avgFeeEnd: '',
				feeFrequencyStart: '',
				feeFrequencyEnd: '',
				companyName: '',
				companyID: '',
				searchType: 1, // 1,最近消费;2,最近添加;3,等级升序;4,等级降序;5,单次消费额由高到低;6,消费频次由高到低;.
				isCstPool: 0, // 是否客户池 0 不是 1 是
				customerLabelIDList: [], // 侧边栏标签ids
				storeId: storage.getAppUserInfo().currentStoreId,
				marketId: storage.getAppUserInfo().marketerId,
				cWCompanyID: storage.getAppUserInfo().cwCompanyID,
				pageIndex: 1,
				pageSize: PageConstData.pageSize,

				cstNameOrPhoneOrCode: '', // 搜索关键词
				isArrange: '', // 已整理/未整理
			},
			customerList: [], // 客户列表数组
			oriCSManagerArr: [], // 请求的客户经理列表未加工数据
			curListRowCount: 0, // 当前筛选条件下,列表总条数
			moreList: [
				// 卡片list更多操作
				{
					label: '移除客户池',
					value: 0,
				},
			],

			// ---------------------- data-Mescroll配置 ---------------------

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
					size: PageConstData.pageSize, // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
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
			navFilterBottom: 438, // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		};
	},
	computed: {
		// ----------------- computed-侧边栏vuex数据-START --------------------
		...mapState(['currentTagsObj', 'currentCompanyObj', 'customerTab']),
		...mapState({
			currentCustomerItem: 'currentCustomerItem', // 当前选中客户
		}),
		// ----------------- computed-侧边栏vuex数据-END --------------------
		
		
		// ----------------- computed-顶部筛选-START --------------
		// 消费排序文字变化
		consumeSortSelectedText() {
			var filters = this.consumeSortArr.filter((item) => item.selected)[0];
			return filters ? filters.label.substring(0, 4) : '';
		},
		// 客户/客户池筛选文字变化
		customerFilterSelectedText() {
			var filters = this.customerTypeArr.filter((item) => item.selected)[0];
			return filters ? filters.label.substring(0, 4) : '';
		},
		// 顶部客户经理的下拉列表展示的数据
		CSManagerFilterArr() {
			let allData = this._.cloneDeep(this.oriCSManagerArr);
			let currentMarkId = this.$storage.getAppUserInfo().marketerId;
			let topMarketData = this._(allData).chain()
				.map(x => ({
					value: x.marketerID,
					label: `${x.marketerName}`,
					selected: x.marketerID == this.currentSelCS.value,
					// 当前筛选条件下客户列表数据的总条数
					count: this.customerListQuery.isCstPool == 0 ? x.customerCount : x.customerPoolCount,
				}))
				.orderBy(['count'], ['desc']).value();
			return topMarketData;
		},
		// ----------------- computed-顶部筛选-END --------------
		
		
		// --------------------- computed-客户列表-START ---------------------
		// 头像设置
		getImgUrl() {
			return function(url) {
				return !!url ? 'url(' + encodeURI(url) + ')' : 'url("https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png")';
			};
		},
		// --------------------- computed-客户列表-END ---------------------
		
		
		// ---------------------- computed-批量操作-START -------------------
		// 分配用户至客服经理的popup中结果提示
		customTips() {
			let str = [];
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
		// ---------------------- computed-批量操作-END -------------------
	},
	filters: {
		// ----------------- filters-顶部lable的过滤-START -----------
		currentTopLabel(label, marketId, CSManagerFilterArr) {
			let marketDatas = CSManagerFilterArr;
			let marketItem = marketDatas.find(x => x.value == marketId);
			return marketItem ? `${label}(${marketItem.count})` : label;
		},
		// ----------------- filters-顶部lable的过滤-END -----------
	},
	watch: {
		// --------------- watch-门店变化-START --------------
		'customerListQuery.storeId': {
			handler: function(val, oldval) {
				this.refresh();
			},
		},
		// --------------- watch-门店变化-END --------------
		
		// ------------------ watch-顶部筛选-START -----------------
		'customerListQuery.cstNameOrPhoneOrCode': {
			handler: function(val) {
				if (val || val == '') this.refresh();
			},
		},
		'customerListQuery.marketId': {
			handler: function(val, oldval) {
				if (val || val == '') this.refresh();
			},
		},
		consumeSortArr: {
			// 消费排序数组select变化
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected) {
						this.customerListQuery.searchType = item.value;
						this.refresh();
					}
				});
			},
		},
		customerTypeArr: {
			// 客户/客户池变化
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected) {
						this.customerListQuery.isCstPool = index;
						this.refresh();
					}
				});
			},
		},
		// ------------------ watch-顶部筛选-END -----------------
		
		// --------------------- watch-侧边栏筛选-START -------------------
		currentTagsObj: {
			handler(val) {
				// 更新filterData数据,但不更新customerListQuery参数,要改变customerListQuery参数,得在侧边栏点击确认才行
				this.filterData.tags = val.ids;
			},
			deep: true,
		},
		currentCompanyObj: {
			handler(val) {
				this.filterData.companyID = val.id;
				this.filterData.companyName = val.keyword;
			},
			deep: true,
		},
		// --------------------- watch-侧边栏筛选-END -------------------
		// --------------------------- watch-首页过来的payload-START -----------------------
		payload: {
			handler(val, oldVal) {
				// console.log('[customList watch]: payload', val);
				if (val.tabIndex == 0) {
					this.dataType = val.dataType;
					// 只有dataType有值,才重新初始化顶部展示
					if (this.dataType) {
						this.initDefaultFilter(this.dataType);
					}
				}
			},
			deep: true,
		},
		// --------------------------- watch-首页过来的payload-END -----------------------
	},
	mounted() {
		// -------------------- mounted-Payload-START ------------------
		// 如果父组件传递了payload.dataType,证明从首页来,需判断[我的]还是[全店]
		let {
			dataType,
			tabIndex
		} = this.payload;
		if (dataType && tabIndex == 0) {
			this.dataType = dataType;
		}
		// -------------------- mounted-Payload-END ------------------

		// ----------------------- mounted-事件监听-START ----------------
		// 监听客户tab右上角「标签管理」页面，点击标签后返回客户列表刷新页面
		uni.$on('selectTagFromLabelManagement', () => {
			setTimeout(() => {
				// 侧边栏确认按钮触发
				this.confirmSidebar();
			}, 500); // 此处方法早于 watch 中监听 tag 变化，所以延迟一下等待 tag 变化完成在执行确认操作
		});
		// 监听机会页面chanceNote保存事件
		uni.$on('chanceNoteToCustomList', (note) => {
			this.moveTrackRemark = note || '';
		});
		// 监听editCustomerLabel批量打标签成功事件
		uni.$on('addLabelForCustomListBatch', () => {
			// 刷新页面,关闭批量操作
			this.refresh();
			this.isBatch = false;
			this.isAllSel = false;
			this.preAll = false;
			this.checkboxSelectNum = 0;
		});
		// 监听客户详情更改客户经理成功事件
		uni.$on('changeCSManagerToCustomerList', (currentCustomerItem) => {
			this.reqCSManagerDataAndSidebarData();
			// 如果更改了客户经理，在本列表中删除它（排除全部的筛选情况）
			if (currentCustomerItem && !this.CSManagerFilterArr[0].selected) {
				// 更新当前已加载客户列表,移除已更换了客户经理的客户数据,并且更新顶部筛选当前客户经理旗下客户列表总个数
				cw.removeAaary(this.customerList, currentCustomerItem);
				// 更新顶部共筛选XXX人
				if (this.curListRowCount > 0) {
					this.curListRowCount = --this.curListRowCount;
				}
			}
		});
		// 通用刷新页面
		uni.$on('refreshDataToCustomerList', () => this.refresh());
		// ----------------------- mounted-事件监听-END ----------------

		// ---------------------- mounted-侧边栏-START ------------------------
		// 设置侧边栏筛选的默认时间范围
		this.defaultDateRangeArr = [...moment().format('YYYY-MM-DD').split('-'), '-', ...moment().format('YYYY-MM-DD').split(
			'-')];
		// ---------------------- mounted-侧边栏-END ------------------------
	},
	// ---------------------- mounted数据请求 -----------------------
	methods: {
		// 侧边栏筛选[标签,公司]
		...mapMutations(['setCurrentTagsObj', 'setCurrentCompanyObj']),
		...mapMutations(['setCurrentCustomerItem', 'setCstListRemark']),
		// ------------------ methods顶部通讯录跳转 ----------------
		gotoContacts() {
			if (cw.isApp(true)) {
				uni.navigateTo({
					url: '/pages/customerSub/customerCommunication/customerCommunication',
				});
			}
		},
		// ------------------ methods顶部搜索 --------------------
		// 监听搜索栏改变
		searchChange: util.debounce(function(e) {
			this.$util.baiduEvent('客户搜索', '客户列表页顶部客户搜索');
			this.customerListQuery.cstNameOrPhoneOrCode = e.detail.value;
		}, 500),
		// ------------------ methods顶部筛选 --------------------

		// 弹出消费排序panel
		consumeSortToggle() {
			this.showConsumeSort = !this.showConsumeSort;

			this.showCustomerType = false;
			this.isCSManagerFilter = false;
		},
		// 选择消费排序
		seleConsumeSort(item) {
			this.showConsumeSort = false;
			if (item.selected) return;
			this.consumeSortArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
		},

		// 弹出all客户/客户池panel
		customerFilterToggle() {
			this.showCustomerType = !this.showCustomerType;

			this.showConsumeSort = false;
			this.isCSManagerFilter = false;
		},
		// 选择all客户/客户池
		seleCustomerFilter(item) {
			this.showCustomerType = false;
			if (item.selected) return;
			this.customerTypeArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
		},

		// 弹出客户经理panel
		CSManagerFilterToggle() {
			// 查看所有 or 编辑所有 能弹出客户经理panel
			if (this.$cw.canSeeAllCustomer()) {
				this.isCSManagerFilter = !this.isCSManagerFilter;
				this.showCustomerType = false;
				this.showConsumeSort = false;
			}
		},
		// 选择客户经理
		seleCSManagerFilter(item) {

			// 重置全选状态，重置批量操作的显示
			this.isAllSel = false;
			this.preAll = false;
			this.checkboxSelectNum = 0;

			// item结构:
			// label: "黄芮(600)"
			// value: "SL1855900000069"
			// selected: true
			this.isCSManagerFilter = false;
			if (item.selected) return;
			this.CSManagerFilterArr.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;

			this.currentSelCS.label = this.calcCSManagerText(item.label);
			this.currentSelCS.value = item.value;
			this.customerListQuery.marketId = item.value;
			this.filterData.sellerID = item.value;
			this.filterData.sellerName = item.label.split('(')[0];
		},
		// 返回顶部筛选[客户经理]时展示的经理名称,去掉页码数
		calcCSManagerText(csManagerName) {
			if (csManagerName) {
				var result = /(\(\d+\))/.exec(csManagerName);
				if (result && result.length > 1) {
					//加这个判断是以防字符串中没有匹配的内容，那么result[1]会抛错
					csManagerName = csManagerName.replace(result[1], '');
				}
				return csManagerName.substring(0, 4);
			} else {
				return '';
			}
		},
		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.showConsumeSort = false;
			this.showCustomerType = false;
			this.isCSManagerFilter = false;
		},

		// 批量操作点击事件
		batchOperate() {
			this.isBatch = !this.isBatch;
		},

		// ---------------------- methods卡片 ----------------------

		// 去客户详情页
		gotoCustomInfo(ct) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(ct);
			// 为了跳转详情后,更改当前用户的[整理]状态后,返回客户列表页,已整理的状态图片即时更新
			cw.currentCustomerPoolItem = ct;
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${ct.customerID}`,
			});
		},
		// 获取客户等级
		getCustomLevelImgUrl(item) {
			if (item.customerLevelImgUrl) {
				return cw.ImgServerUrl + item.customerLevelImgUrl;
			} else {
				return 'https://pic.cwyyt.cn/upload/yytApp/images/level_D.png';
			}
		},
		// 去打电话
		gotoCallPhone(phone) {
			if (cw.isApp(true)) {
				getApp().globalData.customerPageData.isFollowGo = false;
				this.$util.baiduEvent('打电话', '客户列表页列表项打电话');
				cw.callPhone(phone,0);
			}
		},
		// 去发信息
		gotoSendMsg(ct) {
			this.$util.baiduEvent('发短信', '客户列表页列表项发短信');
			let url =
				`/pages/customerSub/sendMsg/sendMsg?customerID=${
				ct.customerID
			  }&customerName=${ct.customerName}&phone=${ct.phone}&msgName=${
				ct.msgName ||ct.customerName
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
			// 为了跳转详情后,更改当前用户的[整理]状态后,返回客户列表页,已整理的状态图片即时更新
			cw.currentCustomerPoolItem = ct;
			const url = `/pages/_common/customInfo/customInfo?customerId=${ct.customerID}&tabIndex=1`;
			uni.navigateTo({
				url,
			});
		},
		// 计算每个客户item的morelist菜单有哪些选项
		calcMoreList(curCustomer) {
			// 客户经理只能移除自己客户池的客户，管理员也只能移除自己的
			if (
				curCustomer.customerPoolMarketID != storage.getAppUserInfo().marketerId
			) {
				return this.moreList.filter((menu) => menu.label != '移除客户池');
			} else if (!curCustomer.customerPoolMarketID) { // 客户有客户池经理的才能够移除，客户只有客户经理的则没有移除的功能
				return this.moreList.filter((menu) => menu.label != '移除客户池');
			} else {
				return this.moreList;
			}
		},
		// 选择了更多气泡菜单中的某一项
		triggerMenu(curMenu, curCustomer) {
			const that = this;

			if (curMenu.label == '移除客户池') {
				let success = function() {
					let obj = {
						customerPoolMarketID: '',
						id: curCustomer.customerID,
					};

					let removeRecordData = {
						operatorID: storage.getAppUserInfo().id,
						customerID: curCustomer.customerID,
						oldMarketerID: that.customerListQuery.marketId,
						cwCompanyID: storage.getAppUserInfo().cwCompanyID,
					};
					var success = function(result) {
						setTimeout(() => {
							uni.showToast({
								title: '移除成功！',
								duration: 2000,
							});
						});
						// cw.removeAaary(that.customerList, curCustomer);
						if (that.customerListQuery.isCstPool == 1) { // 客户池时得删除列表中当前用户
							cw.removeAaary(that.customerList, curCustomer);
						} else {
							// 只删除当前客户的客户池经理名称和id
							curCustomer.customerPoolMarketName = null;
							curCustomer.customerPoolMarketID = null;
						}

						// 顶部待跟数字减一
						if (that.curListRowCount > 0) {
							// 修改筛选总数
							that.curListRowCount--;
							// 替换顶部经理筛选条件 王元元(23) => 王元元(22)
							const reg = /[^(][a-zA-Z0-9]+(?=\))/g;
							const curCS = that.CSManagerFilterArr.filter(v => v.selected == true)[0];
							if (curCS) {
								curCS.label = curCS.label.replace(reg, res => {
									if (res > 0) {
										return --res;
									} else {
										return 0;
									}
								});
							}
						}
					};
					cw.updatefixedSales(obj, success, removeRecordData);
				};
				uni.showModal({
					title: '提示',
					content: '确定将客户移除客户池？',
					success(res) {
						if (res.confirm) {
							success();
						}
					},
				});
			}
		},
		// uni-app复选框事件监听
		checkboxChange(e) {
			console.log({
				preAll: this.preAll,
				isAllSel: this.isAllSel,
				curListSelTotal: e.detail.value.length,
			});
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
				if (values.includes(item.customerID)) {
					this.$set(item, 'selected', true);
				} else {
					this.$set(item, 'selected', false);
				}
			}
			// 判断是否是全选
			var allSelected = this.customerList.every((item) => item.selected);
			this.isAllSel = allSelected ? true : false;
		},

		// --------------------- methods侧边栏 -----------------------------

		// 显示抽屉
		showDrawer() {
			this.isShowSidebar = true;
		},
		// 显示抽屉
		closeDrawer() {
			this.isShowSidebar = false;
		},
		// 选择客户等级
		selectCustomerLevelFromSidebar(item) {
			this.filterData.levelID =
				this.filterData.levelID !== item.label ? item.label : '';
		},
		// 选择客户经理
		selectCSManagerFromSidebar(item) {
			// item带有数字
			this.filterData.sellerID =
				this.filterData.sellerID !== item.value ? item.value : '';
			this.filterData.sellerName =
				this.filterData.sellerName !== item.label.split('(')[0] ?
				item.label.split('(')[0] :
				'';
		},
		// // 选择挖掘条件
		// selectWajueFromSidebar(item) {
		// 	this.filterData.wajueID =
		// 		this.filterData.wajueID !== item.value ? item.value : '';
		// },
		// 去标签选择页
		gotoTagsPage() {
			uni.navigateTo({
				url: '/pages/_common/editCustomerLabel/editCustomerLabel?sidebar=customerList',
			});
		},
		// 显示时间范围picker
		clickDateRange() {
			this.$refs.dateRangePicker.show();
		},
		// 确认时间范围
		onConfirmDateRange(val) {
			this.filterData.startDate = val.from + ' 00:00:00';
			this.filterData.endDate = val.to + ' 00:00:00';
		},

		// 格式化滑块显示内容
		formatMoneyRange(val) {
			if (val === this.sliderRangeMoney.max) {
				val = `${val}+`;
			}
			return val;
		},

		// ※人均消费范围变化时触发※
		// 监听滑块数值改变事件
		handleMoneyRangeChange(e) {
			// ↓ 解决重置导致弹出{请选择时间范围}的问题
			if (
				(this.filterData.startDate == '' || this.filterData.endDate == '') &&
				e.toString() != [0, 300].toString()
			) {
				this.sliderRangeMoney.rangeValue = [0, 300];
				cw.showError('请选择时间范围');
				return;
			}
			// e是个数组 [0, 200]

			const min = e[0],
				max = e[1];
			this.sliderRangeMoney.rangeValue = e;
			if (min == 0 && max == 300) {
				this.filterData.minMoney = '';
				this.filterData.maxMoney = '';
			} else if (min > 0 && max == 300) {
				this.filterData.minMoney = min;
				this.filterData.maxMoney = '';
			} else {
				this.filterData.minMoney = min;
				this.filterData.maxMoney = max;
			}
		},

		// =========== 消费频次范围变化时触发 =============
		// 格式化滑块显示内容
		formatCountRange(val) {
			if (val === this.sliderRangeCount.max) {
				val = `${val}+`;
			}
			return val;
		},
		// 监听滑块数值改变事件
		handleCountRangeChange(e) {
			// ↓ 解决重置导致弹出{请选择时间范围}的问题
			if (
				(this.filterData.startDate == '' || this.filterData.endDate == '') &&
				e.toString() != [0, 5].toString()
			) {
				this.sliderRangeCount.rangeValue = [0, 5];
				cw.showError('请选择时间范围');
				return;
			}
			// e是个数组 [0, 200]

			const min = e[0],
				max = e[1];
			this.sliderRangeCount.rangeValue = e;
			if (min == 0 && max == 5) {
				this.filterData.minCount = 0;
				this.filterData.maxCount = '';
			} else if (min > 0 && max == 5) {
				this.filterData.minCount = min;
				this.filterData.maxCount = '';
			} else {
				this.filterData.minCount = min;
				this.filterData.maxCount = max;
			}
		},
		// 去公司选择页
		gotoCompanyPage() {
			uni.navigateTo({
				url: '/pages/_common/filterCompany/filterCompany',
			});
		},
		// 选择已整理,未整理
		selectSettleFromSidebar(item) {
			this.filterData.settleStatus =
				this.filterData.settleStatus !== item.value ? item.value : '';
		},

		// 重置侧边栏数据
		resetSidebar() {
			this.filterData = this.PageConstData.initFilterData();
			// 滑块重置
			this.sliderRangeMoney.rangeValue = [0, 300];
			this.sliderRangeCount.rangeValue = [0, 5];

			//清空vuex当前标签状态
			this.setCurrentTagsObj({
				content: '',
				ids: '',
			});
			this.setCurrentCompanyObj({
				name: '',
				id: '',
				keyword: '',
			});
			this.$storage.setCurrentTagList([]);
		},
		// 确认侧边栏数据
		confirmSidebar() {
			this.isShowSidebar = false;

			const {
				levelID,
				companyID,
				companyName,
				startDate,
				endDate,
				minCount,
				maxCount,
				minMoney,
				maxMoney,
				sellerID,
				sellerName,
				tags,
				wajueID,
				settleStatus,
			} = this.filterData;
			this.customerListQuery.cstLevel = levelID;
			this.customerListQuery.companyID = companyID;
			this.customerListQuery.companyName = companyName;
			this.customerListQuery.feeStartDateTime = startDate;
			this.customerListQuery.feeEndDateTime = endDate;
			this.customerListQuery.feeFrequencyStart = minCount;
			this.customerListQuery.feeFrequencyEnd = maxCount;
			this.customerListQuery.avgFeeStart = minMoney;
			this.customerListQuery.avgFeeEnd = maxMoney; // 没最大值最小值时传空值

			// 设置顶部filter客户经理文字
			this.currentSelCS = {
				value: sellerID,
				label: sellerName,
			};
			if (sellerName === '') {
				this.currentSelCS = {
					value: '',
					label: '全部',
				};
			}

			// 设置顶部filter客户经理panel选中状态
			this.CSManagerFilterArr.forEach((listItem) => {
				if (listItem.value == sellerID) {
					listItem.selected = true;
				} else {
					listItem.selected = false;
				}
			});
			this.customerListQuery.customerLabelIDList =
				tags === '' ? [] : tags.split(','); // 数组
			// debugger
			this.customerListQuery.dynamicConditionConfigID = wajueID;
			this.customerListQuery.isArrange = settleStatus;

			// 如果 marketId 改变了,会由watch触发refresh;如果 marketId 没改变.此处就需要调用refresh
			if (this.customerListQuery.marketId == sellerID) {
				this.refresh();
			} else {
				this.customerListQuery.marketId = sellerID;
			}
		},

		// ---------------------- methods其他组件事件 --------------------------------

		// ---------------------- methods批量操作 --------------------------------
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


			console.log({
				preAll: this.preAll,
				isAllSel: this.isAllSel,
			});

			this.customerList.forEach((item) => {
				item.selected = this.preAll;
			});
			// 全选要显示所有客户
		},
		// 展示更换客户经理panel
		showBatchCSManagerPanel() {
			if (!this.getCustomIDs().selected) {
				cw.showError('请选择客户!', 2000);
				return;
			}
			this.isShowBatchOfCSManagerPanel = true;
		},
		// 客户经理panel选择后触发
		changeMarketer(ruleType, tips) {
			let isCstPool = 0;
			let customIds = this.getCustomIDs().selected ? this.getCustomIDs().selected.split(',') : [];
			let unCustomIds = this.getCustomIDs().unselected ? this.getCustomIDs().unselected.split(',') : [];
			// 根据当前[所有客户/客户池]选中状态,设置获取客户列表时的查询参数 isCstPool
			this.customerTypeArr.forEach(function(item, index) {
				item.selected && (isCstPool = index);
			});
			const data = {
				changeRule: ruleType,
				cstIDList: customIds, // 已选中
				excludeCstIDList: unCustomIds, // 未选中
				isCstPool: isCstPool,
				marketerId: '',
				storeID: this.customerListQuery.storeId,
				cWCompanyID: this.customerListQuery.cWCompanyID,
				operatorID: storage.getAppUserInfo().id,
			};
			// 临时存一份data,在确认picker后再用 confirmSalesNoSelf 方法
			this.tempChangeMarketerData = data;
			// 更换到指定客户经理,弹出modal中要排除掉当前顶部筛选条件中已选中的客户经理(排己)
			if (ruleType == 4) {
				this.CSManagerBatchArr = this.CSManagerBatchArr.filter((item) => {
					return item.value != this.customerListQuery.marketId;
				});

				this.$nextTick(() => {
					this.$refs.CSManagerNoSelfPicker.show();
				});
			} else if (ruleType == 3) { // 均分到客服经理（多选）
				// this.CSManagerBatchArr
				this.showMultipleSelPicker = true;
			} else {
				this.isMarketConfirm = true;
				this.marketConfirmTips = tips;
				this.ruleType = ruleType;
			}
		},
		// 「modal前三种移动方式」确认某个规则下的批量更改客户经理的操作
		async confirmMarkert() {
			let isCstPool = 0;
			let customIds = this.getCustomIDs().selected ? this.getCustomIDs().selected.split(',') : [];
			let unCustomIds = this.getCustomIDs().unselected ? this.getCustomIDs().unselected.split(',') : [];
			// 根据当前[所有客户/客户池]选中状态,设置获取客户列表时的查询参数 isCstPool
			this.customerTypeArr.forEach((item, index) => {
				item.selected && (isCstPool = index);
			});
			this.customNum = customIds.length;
			let data = {
				changeRule: this.ruleType,
				cstIDList: customIds, // 选中的
				excludeCstIDList: unCustomIds, // 未选中的
				isCstPool: isCstPool,
				marketerId: '',
				storeID: this.customerListQuery.storeId,
				cWCompanyID: this.customerListQuery.cWCompanyID,
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
				// dtos: 客户经理信息, cstIds: 被移动客户列表, 当前顶部选中客服经理下需要删除的客户id集合
				let {
					dtos,
					cstIds,
					delCstIds: needDels
				} = result;
				this.isMarketConfirm = false;
				this.isShowBatchOfCSManagerPanel = false;
				this.isMarketConfirmTips = true;
				this.isBatch = false;
				this.marketConfirmRes = dtos ? dtos : [];

				// 本地判断
				this.customNum = cstIds.length;
				// 更新当前已加载客户列表,移除已更换了客户经理的客户数据,并且更新顶部筛选当前客户经理旗下客户列表总个数
				let array = [],
					newRowCount = this.curListRowCount;
				this.customerList.forEach((item) => {
					item.selected = false;
					if (this.customerListQuery.marketId !== '') { // 不是全部筛选条件时
						// let someone = cstIds.some((id) => item.customerID == id);
						// if (!someone) array.push(item); // 把没操作的客户数据推入array
						// if (someone) --newRowCount; // 减去已操作的客户数(当前位全部时,不减)

						// 当前已加载的列表中选中的所有客户id
						let someone = data.cstIDList.some((id) => item.customerID == id);
						// 看当前这个someone是否已经不属于自己
						var needD = needDels ? needDels.some(v => v == item.customerID) : null;
						if (!needD) { // 1. 如果还属于自己 保留
							array.push(item); // 把没操作的客户数据推入array
						} else { // 2. 如果不属于自己，就减去已操作的客户数
							--newRowCount;
						}
					} else { // 是全部筛选条件时，还需要更新已操作客户的新的客服经理名称
						if (dtos) {
							dtos.forEach(v => {
								// 该客服经理变更信息
								var csInfo = v;
								// cstIds 是此客户id的客户的客服经理变成了此客服经理
								if (csInfo.cstIds) {
									// 看当前客户在不在集合中，在就变更客服经理名称
									var target = csInfo.cstIds.some(cs => cs == item.customerID);
									if (target) item.marketerName = v.marketerName;
								}
							});
						}
						array.push(item);
					}
				});
				this.customerList = array;
				array.forEach(v => {
					v.isLockMarket = 1;
				})
				this.curListRowCount = newRowCount >= 0 ? newRowCount : 0;

				this.checkboxSelectNum = 0;

				// 如果全选，更新 共筛选客户文字
				if (this.preAll) {
					this.refresh();
				} else {
					// 更新顶部筛选项客户经理数据
					this.reqCSManagerDataAndSidebarData(() => {
						this.transfCSManagerArr(data.isCstPool);
					});
				}
				this.preAll = false;
				this.isAllSel = false;
				this.mutipleSelDefaultSelected = [];
			}
		},
		// 取消批量操作的,更换到指定客户经理操作
		cancelChangeCSManagerNoSelfPicker() {
			// 啥也不做
		},
		// 批量操作 多选picker客服经理确认操作
		async confirmMultipleSel(items) {
			// console.log(items);
			this.$util.baiduEvent('分配至客户经理', '客户列表页底部批量更换客户经理');
			let selectText = items.map(v => v.label).join(","); // 选中销售经理们的名字
			let selectItems = items.map(v => {
				return {
					label: v.label,
					value: v.value
				}
			});
			//  e.checkArr选中销售经理结构：(label,value) 和 currentSelCS 需要的结构相同

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
				console.log({
					result
				});
				// 被执行了分配操作的, 接收到分配客户的客服经理集合, 当前顶部选中客服经理下需要删除的客户id集合
				// TODO
				let {
					cstIds,
					dtos,
					delCstIds: needDels
				} = result;
				console.log({
					cstIds,
					dtos,
					delCstIds: needDels
				});
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
					if (this.customerListQuery.marketId !== '') { // 不是全部筛选条件时

						// 当前已加载的列表中选中的所有客户id
						let someone = data.cstIDList.some((id) => item.customerID == id);
						// 看当前这个someone是否已经不属于自己
						var needD = needDels ? needDels.some(v => v == item.customerID) : null;
						// debugger
						if (!needD) { // 1. 如果还属于自己 保留
							array.push(item); // 把没操作的客户数据推入array
						} else { // 2. 如果不属于自己，就减去已操作的客户数
							--newRowCount;
						}
					} else { // 是全部筛选条件时，需要更新选中客户的新的客服经理名称
						// TODO
						if (dtos) {
							dtos.forEach(v => {
								// 该客服经理变更信息
								var csInfo = v;
								// cstIds 是此客户id的客户的客服经理变成了此客服经理
								if (csInfo.cstIds) {
									// 看当前客户在不在集合中，在就变更客服经理名称
									var target = csInfo.cstIds.some(cs => cs == item.customerID);
									if (target) item.marketerName = v.marketerName;
								}
							});
						}
						array.push(item);
					}
				});
				this.customerList = array;
				array.forEach(v => {
					v.isLockMarket = 1;
				})
				this.curListRowCount = newRowCount >= 0 ? newRowCount : 0;

				this.isBatch = false;
				this.checkboxSelectNum = 0;
				// 更新顶部筛选项客户经理数据
				this.reqCSManagerDataAndSidebarData(() => {
					this.transfCSManagerArr(data.isCstPool);
				});
				// 如果权限，更新 共筛选客户文字
				if (this.preAll) {
					this.refresh();
				}
				this.preAll = false;
				this.isAllSel = false;
				this.mutipleSelDefaultSelected = [];
			}
		},
		// （弃用）「更换到指定客户经理」确定批量操作中,更换到指定客户经理操作
		async confirmChangeCSManagerNoSelf(e) {
			this.$util.baiduEvent('更换客户经理', '客户列表页底部批量更换客户经理');
			let selectText = e.result; // 选中销售经理名字
			let {
				label,
				value
			} = e.checkArr;
			let selectItems = {
				label,
				value,
			}; //  e.checkArr选中销售经理结构：(label,value) 和 currentSelCS 需要的结构相同

			// 从changeMarketer临时存的变量过来的data
			let data = this.tempChangeMarketerData;
			data.marketerId = selectItems.value;
			data.cstDataGUID = this.preAll ? this.cstDataGUID : '';

			let result = await CY19.ChangeCstMarketer(data);
			if (result) {
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
					let someone = data.cstIDList.some((id) => item.customerID == id);
					if (!someone) array.push(item); // 把没操作的客户数据推入array
					if (someone && this.customerListQuery.marketId !== '') --newRowCount; // 减去已操作的客户数(当前位全部时,不减)
				});
				this.customerList = array;
				this.curListRowCount = newRowCount;

				this.isBatch = false;
				this.checkboxSelectNum = 0;
				// 更新顶部筛选项客户经理数据
				this.reqCSManagerDataAndSidebarData(() => {
					this.transfCSManagerArr(data.isCstPool);
				});
				// 如果权限，更新 共筛选客户文字
				if (this.preAll) {
					this.refresh();
				}
				this.preAll = false;
				this.isAllSel = false;
			}
		},

		// 展示底部移入跟踪panel
		showBatchMoveTrackPanel() {
			if (!this.getCustomIDs().selected) {
				cw.showError('请选择客户!', 2000);
				return;
			}
			this.isShowBatchOfMoveTrackPanel = true;
		},
		// 移入跟踪时间
		chooseMoveTrackDate(e) {
			this.moveTrackDate = e.target.value + '-01';
		},
		// 移入跟踪备注
		goRemark() {
			uni.navigateTo({
				url: '/pages/_common/chanceNote/chanceNote?fromWhere=CstListRemark',
			});
		},
		// 移入跟踪
		async moveTrackConfirm() {
			this.$util.baiduEvent('移入跟踪', '客户列表页底部批量移入跟踪');
			if (this.moveTrackDate == '') {
				cw.showError('请选择跟踪日期');
				return;
			}
			if (this.moveTrackRemark == '') {
				cw.showError('请添加备注');
				return;
			}
			let data = {
				cstIDList: this.getCustomIDs().selected ? this.getCustomIDs().selected.split(',') : [],
				excludeCstIDList: this.getCustomIDs().unselected ? this.getCustomIDs().unselected.split(',') : [],
				remark: this.moveTrackRemark,
				followDateTime: this.moveTrackDate ?
					this.moveTrackDate + ' 00:00:00' : '',
				storeID: this.customerListQuery.storeId,
				cWCompanyID: this.customerListQuery.cWCompanyID,
				cstDataGUID: this.preAll ? this.cstDataGUID : '',
			};
			let res = await CY19.CstMoveToTrackList(data);
			if (res) {
				this.checkboxSelectNum = 0;
				this.isShowBatchOfMoveTrackPanel = false;
				this.isBatch = false;
				this.moveTrackDate = '';
				this.moveTrackRemark = '';
				// 把 chanceNote 机会备注页面中缓存的[移入跟踪]vuex数据清除
				this.setCstListRemark({
					chanceNote: '',
				});
				setTimeout(() => {
					uni.showToast({
						title: '操作成功!',
					});
				});
				this.refresh();
				this.preAll = false;
				this.isAllSel = false;
				// 移入成功后，刷新客户跟踪列表页
				uni.$emit('refreshCustomFollow');
			}
		},
		// 去批量打标签
		goBatchLables() {
			this.$util.baiduEvent('打标签', '客户列表页底部批量打标签');
			if (!this.getCustomIDs().selected || this.getCustomIDs().selected == '') {
				cw.showError('请选择客户!', 2000);
				return;
			}
			const ids = this.getCustomIDs().selected;
			const unids = this.getCustomIDs().unselected;
			const cstDataGUID = this.preAll ?
				`&cstDataGUID=${this.cstDataGUID}` :
				'';
			const url =
				`/pages/_common/editCustomerLabel/editCustomerLabel?customerList=${encodeURI(ids)}&unCustomerList=${encodeURI(unids)}${cstDataGUID}`;
			uni.navigateTo({
				url,
			});
		},
		// 返回以逗号隔开的当前选中客户id们
		getCustomIDs() {
			let selected = '';
			let unselected = '';
			this.customerList.forEach((item) => {
				if (item.selected) {
					selected += item.customerID + ',';
				} else {
					unselected += item.customerID + ',';
				}
			});
			return {
				selected: selected.substring(0, selected.length - 1),
				unselected: unselected.substring(0, unselected.length - 1),
			};
		},

		// ---------------------- methods数据请求 ------------------------------

		/*下拉刷新的回调 */
		downCallback(mescroll) {
			if (
				this.showCustomerType ||
				this.showConsumeSort ||
				this.isCSManagerFilter
			) {
				return;
			}
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = this.customerListQuery;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			if (!getApp().globalData.customerPageData.isLoadList) return; // 不为true 不加载;
			// 获取客户列表
			let result = await CY19.GetAppCustomList(data);
			// this.isAllSel = false;
			this.cstDataGUID = result.cstDataGUID ? result.cstDataGUID : '';
			if (result.customResults) {
				this.curListRowCount = result.customResults.rowCount;

				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.customResults.dataList.map((ct) => {
					return {
						...ct,
						selected: this.preAll ? true : false, // checkbox用
					};
				});
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.customResults.rowCount / pageSize);
				//设置列表数据
				if (mescroll.num == 1) this.customerList = []; //如果是第一页需手动置空列表
				this.customerList = this.customerList.concat(curPageData); //追加新数据
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
			// 同步刷新顶部筛选的和侧边栏的数据
			this.reqCSManagerDataAndSidebarData(() => {
				this.transfCSManagerArr(data.isCstPool);
			});
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
			this.reqCSManagerDataAndSidebarData(() => {
				this.transfCSManagerArr(this.customerListQuery.isCstPool);
			});
		},
		// 异步获取客户经理数据
		async reqCSManagerDataAndSidebarData(success) {
			const data = {
				storeID: this.customerListQuery.storeId,
				isCustomerPool: this.customerListQuery.isCstPool, // 是否是获取客户池 1 是;0 不是
			};
			let result = await CY19.GetFilterGroups(data);
			// 客户等级 客户经理 挖掘条件
			let {
				customerLever,
				markerList,
				trackingType: conditionConfig
			} = result;

			// 客户经理结构
			// marketerID: ""
			// marketerName: "全部"
			// isShowInApp: null
			// customerCount: 23217
			// customerPoolCount: 893
			// count: null
			this.oriCSManagerArr = markerList;

			// 客户等级结构
			// ["A", "B", "C"]
			this.customerLevelArr = customerLever.map((level, index) => {
				return {
					label: level,
					value: level,
					selected: false,
				};
			});

			// 挖掘条件结构
			// [{
			// 	dynamicConditionConfigID: "CY7800000002"
			// 	name: "喜欢周三来"
			// }]
			// this.wajueArr = conditionConfig.map((wajue, index) => {
			// 	return {
			// 		label: wajue.gameValue,
			// 		value: wajue.gameId,
			// 		selected: false,
			// 	};
			// });
			success && success();
		},

		// ------------------------- methods数据处理 -------------------------
		/**
		 * @description 转化 oriCSManagerArr 数据为带数字的
		 * @param {Number} type 所有客户:0/客户池:1
		 * @param {Boolean} fromHome 是否从首页过来
		 */
		transfCSManagerArr(type = 0) {
			// 批量更改客服list不带全部:CSManagerBatchArr
			this.CSManagerBatchArr = [];

			this.oriCSManagerArr.forEach((item) => {
				// 过滤掉禁用的
				if (item.userIsDisabeld != 1) {
					this.CSManagerBatchArr.push({
						label: item.marketerName +
							'(' +
							(type == 0 ? item.customerCount : item.customerPoolCount) +
							')',
						value: item.marketerID,
						selected: false,
					});
				}
			});

			// 剔除第一项[全部]
			this.CSManagerBatchArr.splice(0, 1);

			// 初始化筛选条件
			if (this.dataType) {
				this.initDefaultFilter(this.dataType);
			} else {
				this.localDefaultFilter();
			}
		},
		// 用来处理跳转到此页面时,顶部的默认筛选状态.目前:展示全部还是当前人. 将dataType传入,可能的值为['个人', '全部']
		initDefaultFilter(dataType) {
			let data = this.customerListQuery;
			if (dataType == '个人') {
				// 我的
				// 设置顶部filter客服
				this.currentSelCS.label = storage.getAppUserInfo().userName;
				this.currentSelCS.value = storage.getAppUserInfo().marketerId;
				// 设置顶部filter客户panel高亮客户
				this.CSManagerFilterArr.forEach((cs) => {
					if (cs.value == this.currentSelCS.value) {
						cs.selected = true;
					} else {
						cs.selected = false;
					}
				});
				// 设置侧边栏客户经理选中
				this.filterData.sellerID = this.currentSelCS.value;
				this.filterData.sellerName = this.currentSelCS.label;
				data.marketId = this.currentSelCS.value;
			} else {
				// 第一个数据是全部（有权限才能看全部，否则只能看自己）
				if (this.$cw.canSeeAllCustomer()) {
					let item = this.oriCSManagerArr[0];
					this.currentSelCS.label = item.marketerName;
					this.currentSelCS.value = item.marketerID;
					// 设置顶部filter客户panel高亮客户
					this.CSManagerFilterArr.forEach((cs) => {
						if (cs.value == this.currentSelCS.value) {
							cs.selected = true;
						} else {
							cs.selected = false;
						}
					});
					// 设置侧边栏客户经理选中
					this.filterData.sellerID = this.currentSelCS.value;
					this.filterData.sellerName = this.currentSelCS.label;
					data.marketId = '';
				} else {
					// 我的
					// 设置顶部filter客服
					this.currentSelCS.label = storage.getAppUserInfo().userName;
					this.currentSelCS.value = storage.getAppUserInfo().marketerId;
					// 设置顶部filter客户panel高亮客户
					this.CSManagerFilterArr.forEach((cs) => {
						if (cs.value == this.currentSelCS.value) {
							cs.selected = true;
						} else {
							cs.selected = false;
						}
					});
					// 设置侧边栏客户经理选中
					this.filterData.sellerID = this.currentSelCS.value;
					this.filterData.sellerName = this.currentSelCS.label;
					data.marketId = this.currentSelCS.value;
				}
			}
			this.dataType = '';
		},
		// 本地改变筛选后的选中状态UI改变
		localDefaultFilter() {
			let data = this.customerListQuery;
			// 设置顶部filter客户panel高亮客户
			this.CSManagerFilterArr.forEach((cs) => {
				if (cs.value == this.currentSelCS.value) {
					cs.selected = true;
				} else {
					cs.selected = false;
				}
			});
			// 设置侧边栏客户经理选中
			this.filterData.sellerID = this.currentSelCS.value;
			this.filterData.sellerName = this.currentSelCS.label;
			data.marketId = this.currentSelCS.value;
		},
		// 获取当前登录人权限
		getSalesAuthorityFromStorage() {
			return storage.getSalesAuthority();
		},

		// -------------------------- methodsUI 处理 -------------------
		// 针对tabbar键盘弹出隐藏设置mescroll距离底部高度方法
		resizeBottom(height) {
			this.swBottom = height;
		},
		// 计算mescroll距离顶部距离
		calcMescrollTop() {
			// this.$nextTick(() => {
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query
			// 		.select('.filter-result-wrapper')
			// 		.boundingClientRect((data) => {
			// 			this.navFilterBottom = data.bottom.toString();
			// 		})
			// 		.exec();
			// });
		},
	},
};
