import cw from '@/common/ceiwei/common.js';
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import CY57 from '@/service/CY/CY57AppService.js';
import CY66 from '@/service/CY/CY66AppService.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			index: 0, // 销售人员picker索引
			slideShow: false,
			// 销售人员列表还是详情
			isList: true,
			// 当前账号是否有能看到所有数据的权限
			isAllSee: true,
			// 列表当前页索引和列表项的数量
			pageSize: 100,
			pageIndex: 1,
			// 目标总数/已完成的目标数量
			targetNum: {
				total: 0,
				number: 0
			},
			// 顶部圆盘相关数据
			followData: {
				totalFollow: {},
				banquetFollow: {},
				customFollow: {}
			},
			// 全店和推荐的切换及数据
			allShop: true,
			recommend: true,
			shopRecomData: {},
			// 目标相关数据
			targetData: {
				customerArr: [], // 客户相关
				banquetArr: [], // 宴会相关
				poolArr: [], // 客户池相关
				memberArr: [], // 会员相关
				individualArr: [], // 散客相关
			},
			// 全部销售人员目标完成情况列表
			totalSales: [],
			// 客户池数量
			customNum: 0,
			// 请求接口必要参数的集合
			SaleTargetQuery: {
				month: moment().format('YYYY-MM'),
				pageIndex: 1,
				pageSize: 100,
				searchType: 1, // 1是指定销售人员，2是全部销售人员
				storeId: storage.getAppUserInfo().currentStoreId,
				marketerId: storage.getAppUserInfo().marketerId,
				cWCompanyID: storage.getAppUserInfo().cwCompanyID
			},
			// 当前选择的销售人员
			currentFollow: {
				value: storage.getAppUserInfo().marketerId,
				label: storage.getAppUserInfo().userName
			},
			// 全部销售人员列表
			//changeMarketData: $.cw.getChooseMarketData(),
			isLoadFinish: false,
			currentSales: '全部', //默认全部销售
			getSalesAuthority: storage.getSalesAuthority(),
			isCSManagerFilter: false, // 是否展示客户经理panel
		};
	},
	onLoad(payload) {
		console.log(payload);
		// this.isAllSee =
		// 	this.getSalesAuthority && this.getSalesAuthority.isSeeAll === 0 ?
		// 	false :
		// 	true;
		this.isAllSee = true;
		if (this.isAllSee) { // 如果能看所有,就根据首页传递的参数[我的/全店]动态展示默认数据
			this.SaleTargetQuery.searchType = payload.dataType == '全部' ? 2 : 1;
			if (this.SaleTargetQuery.searchType == 1) {
				this.changeMarketData.forEach((v, index) => {
					if (v.value === this.SaleTargetQuery.marketerId) { // 如果该用户客户经理在经理列表中，就选中
						this.index = index;
						v.selected = true;
					}
				});
			} else {
				this.changeMarketData[0].selected = true;
			}
		} else { // 如果不能看所有,就是1,且是自己
			this.SaleTargetQuery.searchType = 1;

		}
		this.isList = this.SaleTargetQuery.searchType === 2;
		this.getCustomFollowData(this.SaleTargetQuery.searchType);
		this.getCurrentTarget();

	},
	computed: {
		currentMonthSchedule(){
			return (this.$moment().toDate().getDate()*100/this.$moment().daysInMonth()).toFixed(2);
		},
		// 轮盘旋转角度
		wheelRotate() {
			let ratio =
				this.followData.totalFollow.current /
				this.followData.totalFollow.target;
			ratio = ratio ? ratio : 0;
			ratio = ratio < 1 ? ratio : 1;
			let rotate = -90 + 180 * ratio;
			return `transform: rotate(${rotate.toFixed(2)}deg)`;
		},
		// 客户经理
		changeMarketData() {
			let chooseMarketData = [];
			// if (storage.getSalesAuthority().isSeeAll) {
				chooseMarketData = storage.getChooseMarketData().map(v => {
					return {
						label: v.text,
						value: v.value,
						selected: false,
					}
				});
				chooseMarketData.unshift({
					label: '全部',
					value: 'store',
					selected: false
				});
			// } else {
			// 	chooseMarketData = [{
			// 		label: storage.getAppUserInfo().userName,
			// 		value: storage.getAppUserInfo().id,
			// 		selected: true,
			// 	}]
			// }
			return chooseMarketData;
		},
	},
	filters: {
		isNaNTarget(value) {
			if (value === 'Infinity') {
				return '100.00';
			}
			return isNaN(value) ? '0.00' : value;
		}
	},
	methods: {
		// 弹出客户经理panel
		CSManagerFilterToggle() {
			// if (!storage.getSalesAuthority().isSeeAll) return;
			this.isCSManagerFilter = !this.isCSManagerFilter;
		},
		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.isCSManagerFilter = false;
		},
		// // 获取客户经理数据
		// changeMarketData() {
		//   let chooseMarketData = storage.getChooseMarketData();
		//   chooseMarketData.unshift({
		//     text: '全店',
		//     value: ''
		//   });
		//   return chooseMarketData;
		// },
		// 返回
		goBack() {
			// 返回上一页
			uni.navigateBack({
				delta: 1
			});
		},
		//统计月目标完成情况规则0
		countComCondition(current, target, reverse) {
			if (target && target !== 0) {
				return !reverse ? current >= target : current <= target;
			}
		},
		// 统计月目标完成情况规则1
		countComConditionOne(cur, tar) {
			let current = (cur ? cur : 0).toFixed(2);
			let target = (tar ? tar : 0).toFixed(2);
			let differ = current - target;
			let ratio = (differ / target).toFixed(2);
			if (tar && tar !== 0) {
				if (ratio >= 0) {
					if (ratio < 0.2 && ratio > 0) {
						return true;
					} else if (cur !== 0 && ratio === 0) {
						// 目标不为0的情况下rate为0
						return true;
					} else {
						return false;
					}
				} else {
					return ratio > -0.2;
				}
			}
		},
		// 获取指定销售人员的目标完成详情
		getCurrentTarget() {
			let that = this;
			var data = {
				storeId: this.SaleTargetQuery.storeId,
				month: this.SaleTargetQuery.month,
				marketerId: that.currentFollow.label == '全部' ?
					'store' : this.SaleTargetQuery.marketerId
			};
			// 如果是当前月份那么重新计算
			if (data.month == moment().format('YYYY-MM')) {
				data.IsGenerate = false; // 暂时不需要重写计算
			}
			CY66.GetSalesTarget(data, result => {
				that.targetNum.total = 0;
				that.targetNum.number = 0;
				result.forEach(function(item) {
					switch (item.type) {
						case 1:
							switch (item.name) {
								case '客户池人数':
									that.customNum = item.target;
									break;
							}
							if (item.name !== '总跟踪数' && item.name !== '客户池人数') {
								if (item.target && item.target !== 0) {
									that.targetNum.total++;
									if (item.current >= item.target) {
										that.targetNum.number++;
									}
								}
							}
							break;
						case 2:
						case 4:
							switch (item.name) {
								case '客户池到店比例':
									that.customNum = item.total;
									break;
							}
						case 5:
							if (item.target && item.target !== 0) {
								that.targetNum.total++;
								let ratio = item.current / item.total;
								ratio = ratio ? ratio : 0;
								ratio = ratio < 1 ? ratio : 1;
								if (item.type !== 5 && ratio >= item.target) {
									that.targetNum.number++;
								} else if (item.type === 5 && ratio <= item.target) {
									that.targetNum.number++;
								}
							}
							break;
						case 3:
							if (item.target && item.target !== 0) {
								that.targetNum.total++;
								let current = (item.current ? item.current : 0).toFixed(2);
								let target = (item.target ? item.target : 0).toFixed(2);
								let differ = current - target;
								let ratio = (differ / target).toFixed(2);
								if (ratio >= 0) {
									if (ratio < 0.2 && ratio > 0) {
										that.targetNum.number++;
									} else if (item.current !== 0 && ratio === 0) {
										// 目标不为0的情况下rate为0
										that.targetNum.number++;
									}
								} else {
									if (ratio > -0.2) {
										that.targetNum.number++;
									}
								}
							}
							break;
					}
				});
				that.targetData = {
					customerArr: [], // 客户相关
					banquetArr: [], // 宴会相关
					poolArr: [], // 客户池相关
					memberArr: [], // 会员相关
					individualArr:[],//散客相关
				};
				result.forEach(v => {
					if (v.name == '客户月销售额') {
						that.addArr('customerArr', v, 1);
					} else if (v.name == '客户桌数') {
						that.addArr('customerArr', v, 2);
					} else if (v.name == '客户桌均') {
						that.addArr('customerArr', v, 3);
					} else if (v.name == '客户人均') {
						that.addArr('customerArr', v, 4);
					} else if (v.name == '宴会月销售额') {
						that.addArr('banquetArr', v, 1);
					} else if (v.name == '宴会桌数') {
						that.addArr('banquetArr', v, 2);
					} else if (v.name == '宴会桌均') {
						that.addArr('banquetArr', v, 3);
					} else if (v.name == '客户池到店比例') {
						that.addArr('poolArr', v, 1);
					} else if (v.name == '新客户数量') {
						that.addArr('poolArr', v, 2);
					} else if (v.name == '跟踪处理数') {
						that.addArr('poolArr', v, 3);
					} else if (v.name == '客户数量') {
						that.addArr('poolArr', v, 4);
					} else if (v.name == '客户整理数') {
						that.addArr('poolArr', v, 5);
					} else if (v.name == '会员新开卡数') {
						that.addArr('memberArr', v, 1);
					} else if (v.name == '储值量') {
						that.addArr('memberArr', v, 2);
					} else if (v.name == '储值额') {
						that.addArr('memberArr', v, 3);
					} else if (v.name == '消费人数') {
						that.addArr('memberArr', v, 4);
					}else if(v.name=='散客月销售额') {
						that.addArr('individualArr', v, 1);
					}else if(v.name=='散客桌数') {
						that.addArr('individualArr', v, 2);
					}else if(v.name=='散客桌均') {
						that.addArr('individualArr', v, 3);
					}else if(v.name=='散客人均') {
						that.addArr('individualArr', v, 4);
					}
				})

				// console.log(that.targetData)
			});
		},
		addArr(key, target, order) {
			target.order = order;
			this.targetData[key].push(target);
		},
		//轮播图的切换
		showDetail(index, boolean) {
			switch (index) {
				case 1:
					this.allShop = boolean;
					break;
				case 2:
					this.recommend = boolean;
					break;
			}
		},
		// 获取客户跟踪转换数据,2是全店，1是客户经理
		async getCustomFollowData(index = 2) {
			let that = this;
			let yearData = new Date(this.SaleTargetQuery.month).getFullYear();
			let monthData = new Date(this.SaleTargetQuery.month).getMonth() + 1;
			let data = {
				storeId: this.SaleTargetQuery.storeId,
				year: yearData,
				month: monthData,
				saleId: index === 1 ? this.SaleTargetQuery.marketerId : ''
			};
			let result = await CY57.GetCustomFollowChangeData(data);
			that.allShop = true;
			that.recommend = true;
			that.shopRecomData = result;
			that.followData = {
				totalFollow: {
					current: result.followData.allFollowCurrentCount,
					target: result.followData.currentFollowTargetCount
				},
				banquetFollow: {
					current: result.followData.banquetFollowCurrentCount,
					target: result.followData.banquetFollowTargetCount
				},
				customFollow: {
					current: result.followData.customerFollowCurrentCount,
					target: result.followData.customerFollowTargetCount
				}
			};
		},
		// 获取所有销售人员目标情况列表
		getAllSaleTarget(index) {
			let that = this;
			this.pageIndex = index;
			let data = {
				storeId: this.SaleTargetQuery.storeId,
				month: this.SaleTargetQuery.month,
				pageSize: this.pageSize,
				pageIndex: this.pageIndex
			};
			if (index) {
				data.pageIndex = index;
			}
			that.isLoadFinish = true;
			CY66.GetStoreSaleTarget(data, result => {
				if (index === 1) {
					that.totalSales = result.pagedResult.dataList;
				} else {
					// 多页则将已加载的数据拼接在一起返回为新数组
					that.totalSales = _.concat(
						that.totalSales,
						result.pagedResult.dataList
					);
				}

				if (result.pagedResult.rowCount > 0) {
					that.isLoadFinish = false;
				}
			});
		},
		// 点击销售人员头像进入销售人员详情界面
		goSaleDetail(marketId, label) {
			this.isList = false;
			this.SaleTargetQuery.searchType = 1;
			this.SaleTargetQuery.marketerId = marketId;
			const target = this.changeMarketData.map(v => {
				v.selected = false;
				return v;
			}).filter(v => v.value == marketId)[0];
			// this.currentFollow.value = marketId;
			// this.currentFollow.label = label;
			target.selected = true;
			this.currentFollow = target;

			this.changeMarketData.forEach((listItem) => {
				// console.log({
				// 	marketId,
				// 	listItem
				// })
				// if (marketId == listItem.value) {
				// 	listItem.selected = true;
				// } else {
				// 	listItem.selected = false;
				// }
			});
			// item.selected = true;
		},
		// 当前销售人员的切换
		chooseSales(item, idx) {
			this.isCSManagerFilter = false;
			if (item.selected) return;
			this.index = idx;
			// console.log(item, idx)

			if (item.value == 'store') { // 点击了全部
				this.SaleTargetQuery.marketerId = '';
				this.SaleTargetQuery.searchType = 2;
			} else { // 点击了某个客户经理
				this.SaleTargetQuery.marketerId = this.changeMarketData[this.index].value;
				this.currentFollow = this.changeMarketData[this.index];
				this.SaleTargetQuery.searchType = 1;
			}
			// console.log(this.currentFollow);
			this.changeMarketData.forEach((listItem) => {
				listItem.selected = false;
			});
			item.selected = true;
		},
		// chgFollow() {
		// 	if (this.SaleTargetQuery.searchType == 1) {
		// 		this.SaleTargetQuery.searchType = 2;
		// 		if (this.currentSales != '全部') {
		// 			this.currentSales = '全部';
		// 		}
		// 	} else {
		// 		this.SaleTargetQuery.searchType = 1;
		// 	}
		// },
		//切换上一个客户经理
		// getPreSales() {
		// 	let MarketData = this.changeMarketData;

		// 	let customFollowData = this.SaleTargetQuery;
		// 	if (this.SaleTargetQuery.searchType != 1) {
		// 		this.SaleTargetQuery.marketerId = '';
		// 	}
		// 	let CurrentSalesInfo = cw.getPreSales(MarketData, customFollowData);
		// 	this.SaleTargetQuery.marketerId = CurrentSalesInfo.value;
		// 	this.currentFollow = CurrentSalesInfo;

		// 	MarketData.forEach((v, index) => {
		// 		if (v.value === this.SaleTargetQuery.marketerId) { // 如果该用户客户经理在经理列表中，就选中
		// 			this.index = index;
		// 		}
		// 	});
		// },
		//切换下一个客户经理
		// getNextSales() {
		// 	let MarketData = this.changeMarketData;


		// 	let customFollowData = this.SaleTargetQuery;
		// 	console.log({
		// 		'searchType': this.SaleTargetQuery.searchType
		// 	})
		// 	if (this.SaleTargetQuery.searchType != 1) {
		// 		this.SaleTargetQuery.marketerId = '';
		// 	}
		// 	let CurrentSalesInfo = cw.getNextSales(MarketData, customFollowData);
		// 	console.log({
		// 		CurrentSalesInfo
		// 	});
		// 	this.SaleTargetQuery.marketerId = CurrentSalesInfo.value;
		// 	this.currentFollow = CurrentSalesInfo;

		// 	MarketData.forEach((v, index) => {
		// 		if (v.value === this.SaleTargetQuery.marketerId) { // 如果该用户客户经理在经理列表中，就选中
		// 			this.index = index;
		// 		}
		// 	});
		// },
		// 日期选择切换
		getNext() {
			let currentDate = this.SaleTargetQuery.month;
			let next = moment(currentDate)
				.add(1, 'months')
				.format('YYYY-MM');
			this.SaleTargetQuery.month = next;
		},
		getPre() {
			let currentDate = this.SaleTargetQuery.month;
			let next = moment(currentDate)
				.add(-1, 'months')
				.format('YYYY-MM');
			this.SaleTargetQuery.month = next;
		},
		chooseDate(e) {
			let self = this;
			this.SaleTargetQuery.month = e.target.value;
			// let dtPicker = new mui.DtPicker(options);
			// dtPicker.setSelectedValue(self.SaleTargetQuery.month); // 设置时间选择器被选中的值
			// dtPicker.show(function (selectItems) {
			//   let chooseDate = selectItems.y.value + '-' + selectItems.m.value;
			//   self.SaleTargetQuery.month = chooseDate;
			// });
		},
		getSalesImg(item) {
			if (item.saleImgUrl) {
				return item.saleImgUrl_ImgServer;
			} else {
				return 'https://pic.cwyyt.cn/upload/img/20191129/140424424_salesperson.png';
			}
		},
		// 去预订单详情
		getBookingOrderDetail(month, type, text) {
			let query = {
				month: month,
				marketerId: type == 1 ? this.currentFollow.value : '',
				text: text
			};
			let herf = '/phone/Sales/BookingOrderDetail?' + $.param(query);
			history.pushState({
				title: 'BookingOrderDetail',
				herf: herf
			}, '', herf);
			showIframe(herf);
		}
	},
	watch: {
		isList: function(val) {
			val = Number(val);
			let ele = document.getElementById('loading4');
			let array = ['none', 'inline-block'];
			ele && (ele.style.display = array[val]);
		},
		'SaleTargetQuery.month': {
			handler: function(val, oldval) {
				// console.log('月份改变');
				if (val) {
					if (this.SaleTargetQuery.searchType === 2) {
						// 全店则不传
						this.getCustomFollowData();
						this.getAllSaleTarget(1);
					} else if (this.SaleTargetQuery.searchType === 1) {
						// 个人
						this.getCustomFollowData(1);
						this.getCurrentTarget();
					}
				}
			}
		},
		'SaleTargetQuery.storeId': {
			handler: function(val, oldval) {
				//console.log('门店id改变')
				if (val) {
					if (this.SaleTargetQuery.searchType === 2) {
						this.getCustomFollowData();
						this.getAllSaleTarget(1);
					} else if (this.SaleTargetQuery.searchType === 1) {
						this.getCustomFollowData(1);
						this.getCurrentTarget();
					}
				}
			}
		},
		'SaleTargetQuery.searchType': {
			handler: function(val, oldval) {
				// console.log('搜索类型改变');
				console.log(this.isList);
				if (val === 2) {
					this.isList = true;
					this.getCustomFollowData();
					this.getAllSaleTarget(1);
					// console.log('列表显示');
				} else if (val === 1) {
					this.isList = false;
					// 当点击头像进入会同时改变搜素类型，销售人员id，从而引发重复ajax调用
					this.getCustomFollowData(1);
					//this.getCurrentTarget();
					// console.log('详情显示');
				}
			}
		},
		'SaleTargetQuery.marketerId': {
			handler: function(val, oldval) {
				console.log('销售人员id改变');
				if (!this.isList) {
					this.getCustomFollowData(1);
					this.getCurrentTarget();
				}
			}
		}
	}
};
