import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import util from '@/common/util.js';
// 导入枚举类
import enums from '@/common/enum/enums.js';
const CE = enums.commonListEnum;

// 每次请求页码
const PAGESIZE = 10;

const app = getApp();
// 数据请求
import CY17 from '@/service/CY/CY17AppService.js';
import CY08 from '@/service/CY/CY08AppService.js';

// 组件
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue"; // 刷新组件

// vuex
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

// 头像?尊称?备注?(客户池未到店)
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// ---------------------- data枚举 ---------------
			CE,
			// ---------------------- data数据请求 ---------------------
			dataType: CE.customerOrder.value, // customerOrder 客户订单
			listQuery: { // 列表参数
				storeId: storage.getAppUserInfo().currentStoreId,
				marketerId: storage.getAppUserInfo().marketerId,
				cWCompanyID: storage.getAppUserInfo().cwCompanyID,
				pageIndex: 1,
				pageSize: PAGESIZE,
			},
			month: moment().format("YYYY-MM"), // 月份
			customerLevel: '', // 客户等级
			callType: 1, // 跟踪类型 1: 呼入 2: 呼出 3: 短信 4: 电话未接通 5: 微信发送 6: 收到短信
			marketerId: 'store', // store是全店,其他为个人
			marketerName: '全店',
			dataList: [], // 列表数据

			// ---------------------- dataMescroll配置 ---------------------

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
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无内容'
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			// mescroll实例
			mescrollSingle: {},
			navFilterBottom: '50', // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		};
	},
	// onShow() {
	// 	// 刷新页面
	// 	this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
	// },
	onLoad(payload) {
		const {
			month,
			customerLevel,
			dataType,
			callType,
			isRecommendConversion,
			marketerId,
			marketerName
		} = payload;
		this.month = month || moment().format("YYYY-MM"); // 月份
		this.dataType = dataType || ''; // 页面类型
		this.customerLevel = customerLevel; // 客户等级
		this.callType = callType || ''; // 跟踪类型
		this.marketerId = marketerId || 'store'; // 客户经理id
		this.marketerName = marketerName || '全店'; // 客户经理名称
		uni.$on('commonListRefresh', () => {
			if (this.dataType != CE.customerPool.value || this.dataType != CE.customerTracking.value) {
				this.refresh();
			}
		})
	},
	components: {
		// MescrollUni
	},
	computed: {
		// ----------------------- dataVuex -----------------
		// 当前选中客户
		...mapState({
			currentCustomerItem: 'currentCustomerItem',
		}),
		...mapState(['area']),
		// 设置导航栏title
		setTitle() {
			switch (this.dataType) {
				case CE.customerOrder.value:
					return CE.customerOrder.label + '-' + this.marketerName;
					break;
				case CE.banquetOrder.value:
					return CE.banquetOrder.label + '-' + this.marketerName;
					break;
				case CE.individualOrders.value:
					return CE.individualOrders.label + '-' + this.marketerName;
					break;
				case CE.accommodationOrder.value:
					return CE.accommodationOrder.label + '-' + this.marketerName;
					break;
				case CE.transformOrder.value:
					return CE.transformOrder.label + '-' + this.marketerName;
					break;
				case CE.activeTransformation.value:
					return CE.activeTransformation.label + '-' + this.marketerName;
					break;
				case CE.recommendedTransformation.value:
					return CE.recommendedTransformation.label + '-' + this.marketerName;
					break;
				case CE.customerPool.value:
					return CE.customerPool.label + '-' + this.marketerName;
					break;
				case CE.customerTracking.value:
					return CE.customerTracking.label + '-' + this.marketerName;
					break;
				default:
					return '通用列表页';
					break;
			}
		},
		// --------------------- computed客户列表 ---------------------
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != '' && url != null) {
					return 'url(' + encodeURI(url) + ')';
				} else {
					return 'url("https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png")';
				}
			}
		},
		// 计算订单类别 类别 1:散客 2: 客户 3: 宴会 4: 客房(住宿)
		bookOrderType() {
			switch (this.dataType) {
				case CE.customerOrder.value:
					return 2
					break;
				case CE.banquetOrder.value:
					return 3
					break;
				case CE.individualOrders.value:
					return 1
					break;
				case CE.accommodationOrder.value:
					return 4
					break;
				default:
					return 1;
					break;
			}
		},
		// 计算订单是否为推荐转化 推荐传1  其他传0(转化订单和主动转化是一个东西)
		isRecommendConversion() {
			switch (this.dataType) {
				case CE.transformOrder.value:
					return 0
					break;
				case CE.activeTransformation.value:
					return 0
					break;
				case CE.recommendedTransformation.value:
					return 1
					break;
				default:
					return 0;
					break;
			}
		},
	},
	methods: {
		// -------------------- methodsVuex ---------------
		// 获取区域
		...mapActions(['getArea']),
		...mapMutations(['setArea']),
		...mapMutations(['setCurrentCustomerItem']),
		// --------------------- methods导航栏 -----------------------
		// 返回
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		// ---------------------- methods数据请求 ------------------------------

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

			let data = this.listQuery;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			// console.log(this.dataType, CE.customerPool.value);
			switch (this.dataType) {
				// 客户/宴会/散客/住宿订单
				// month 2020-02
				// dataType: 1/2/3/4
				// /pages/_common/commonList/commonList?dataType=1&month=2020-02
				case CE.customerOrder.value:
				case CE.banquetOrder.value:
				case CE.individualOrders.value:
				case CE.accommodationOrder.value:
					data.bookOrderType = this.bookOrderType;
					data.month = this.month;
					data.marketerId = this.marketerId;
					// console.log(data);
					// 获取月统计订单明细
					await this.GetMonthReportDetailasync(data, mescroll);
					break;
					// 转化/主动/推荐订单
					// month 2020-02
					// dataType: 5/6/7
				case CE.transformOrder.value:
				case CE.activeTransformation.value:
				case CE.recommendedTransformation.value:
					// /pages/_common/commonList/commonList?dataType=6&month=2020-02
					data.month = this.month;
					data.isRecommendConversion = this.isRecommendConversion;
					if (CE.activeTransformation.value == this.dataType) { // 如果是主动，需要加个参数
						data.isEffectiveFollow = 1;
					}
					data.marketerId = this.marketerId;
					// console.log(data);
					// 获取月统计订单明细
					await this.GetMonthReportDetailasync(data, mescroll);
					break;
					// 客户池列表
					// month 2020-02
					// dataType 8
					// customerLevel A,B,C 没有D
					// /pages/_common/commonList/commonList?dataType=8&month=2020-02&customerLevel=A
				case CE.customerPool.value:
					data.month = this.month;
					data.customerLevel = this.customerLevel;
					// data.marketerId = 'store'; // store是全店
					data.marketerId = this.marketerId;
					// console.log(data);
					// 获取客户池列表
					await this.GetMonthReportDetailasync(data, mescroll, 'rank');
					break;
					// 客户跟踪
					// month 2020-02
					// dataType 9
					// callType 跟踪类型 1: 呼入 2: 呼出(电话) 3: 短信 4: 电话未接通 5: 微信发送 6: 收到短信
					// /pages/_common/commonList/commonList?dataType=9&month=2020-02&callType=2
				case CE.customerTracking.value:
					data.month = this.month;
					data.callType = this.callType;
					data.marketerId = this.marketerId;
					// console.log(data);
					// 获取客户跟踪明细列表
					await this.GetMonthReportDetailasync(data, mescroll, 'track');
					break;
				default:
					break;
			}
		},
		//GetMonthReportTrackDetail 重写
		async GetMonthReportDetailasync(data, mescroll, type="order") {
			// SW: bug5539
			let interfa = type == 'order' ? 'GetMonthReportOrderDetail' : type == 'track'? 'GetMonthReportTrackDetail' : 'GetMonthReportRankDetail';
			let result = await CY17[interfa](data);
			if (!result) {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			} else {
				this.processData(result, mescroll);
			}
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		// 处理异步数据
		processData(result, mescroll) {
			console.log({
				'异步获取的列表数据': result
			});
			if (result) {
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.dataList || [];
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.rowCount / PAGESIZE);
				// console.log({
				// 	totalPage
				// });
				//设置列表数据
				if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				this.dataList = this.dataList.concat(curPageData); //追加新数据
				console.log({
					'数据列表dataList': this.dataList
				});
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// --------------------- methods卡片 -------------------
		// 获取客户等级
		getCustomLevelImgUrl(item) {
			if (item.customerLevelImgUrl) {
				return cw.ImgServerUrl + item.customerLevelImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/level_D.png"
			}
		},
		// 去打电话
		gotoCallPhone(phone) {
			if (this.$cw.isApp(true)) {
				this.$cw.callPhone(phone,0);
			}
		},
		// 去发信息
		gotoSendMsg(ct) {
			switch (this.dataType) {
				case CE.customerOrder.value:
				case CE.banquetOrder.value:
				case CE.individualOrders.value:
				case CE.accommodationOrder.value:
				case CE.transformOrder.value:
				case CE.activeTransformation.value:
				case CE.recommendedTransformation.value:
					if (ct.msgName == null) {
						ct.msgName = '';
					}
					if (ct.saleForecastLastFollow && ct.saleForecastLastFollow.customSaveName == null) {
						ct.saleForecastLastFollow.customSaveName = '';
					}
					// 尊称:msgName/通讯录名称:customSaveName
					//发短信欻订单id
					let url =
						`/pages/customerSub/sendMsg/sendMsg?customerID=${ct.bookOrderID}&customerName=${ct.bookerName}&phone=${ct.bookerPhone}&msgName=${ct.msgName}&customSaveName=${ct.saleForecastLastFollow ? ct.saleForecastLastFollow.customSaveName : ''}`;
					uni.navigateTo({
						url,
					});
					break;
				case CE.customerPool.value:
				case CE.customerTracking.value:
					this.$util.baiduEvent('发短信', '客户列表页列表项发短信');
					let url2 =
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
						url: url2,
					});
					break;
				default:
					break;
			}
		},
		// 去跟踪记录
		gotoRecord(ct) {
			switch (this.dataType) {
				case CE.customerOrder.value:
				case CE.banquetOrder.value:
				case CE.individualOrders.value:
				case CE.accommodationOrder.value:
				case CE.transformOrder.value:
				case CE.activeTransformation.value:
				case CE.recommendedTransformation.value:
					// 详情页更新客户经理,此处能让列表的客户经理即时更新
					this.setCurrentCustomerItem(ct);
					// 为了跳转详情后,更改当前用户的[整理]状态后,返回客户列表页,已整理的状态图片即时更新
					this.$cw.currentCustomerPoolItem = ct;
					const url = `/pages/_common/customInfo/customInfo?customerId=${ct.bookOrderCustomerID}&tabIndex=1`;
					uni.navigateTo({
						url,
					});
					break;
				case CE.customerPool.value:
				case CE.customerTracking.value:
					// 详情页更新客户经理,此处能让列表的客户经理即时更新
					this.setCurrentCustomerItem(ct);
					// 为了跳转详情后,更改当前用户的[整理]状态后,返回客户列表页,已整理的状态图片即时更新
					cw.currentCustomerPoolItem = ct;
					const url2 = `/pages/_common/customInfo/customInfo?customerId=${ct.customerId}&tabIndex=1`;
					uni.navigateTo({
						url: url2,
					});
					break;
				default:
					break;
			}
		},
		// 去详情页
		gotoDetail(item) {
			switch (this.dataType) {
				case CE.customerOrder.value:
				case CE.banquetOrder.value:
				case CE.individualOrders.value:
				case CE.accommodationOrder.value:
				case CE.transformOrder.value:
					try {
						this.initAreaAndTable(item, () => {
							console.log({
								'跳转到bookNow时的area信息': this.area
							});
						
							let obj = {
								bookID: item.bookOrderID,
								tableID: item.tableList[0].tableID,
								bookOn: item.bookOn.slice(0, 10),
								dinnerType: item.diningTypeID,
								fromPage: 'commonList',
							};
						
							let param = util.urlEncode(obj).substring(1);
						
							const url =
								`/pages/homePageSub/bookNow/bookNow?${param}`;
							console.log(url);
							uni.navigateTo({
								url,
							});
						});
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					break;
				case CE.activeTransformation.value:
				case CE.recommendedTransformation.value:
					this.setCurrentCustomerItem(item);
					uni.navigateTo({
						url: `/pages/_common/customInfo/customInfo?customerId=${item.bookOrderCustomerID}&tabIndex=1`,
					});
					break;
				case CE.customerTracking.value:
					this.setCurrentCustomerItem(item);
					uni.navigateTo({
						url: `/pages/_common/customInfo/customInfo?customerId=${item.customerId}&tabIndex=1`,
					});
					break;
				case CE.customerPool.value:
					// 详情页更新客户经理,此处能让列表的客户经理即时更新
					this.setCurrentCustomerItem(item);
					uni.navigateTo({
						url: `/pages/_common/customInfo/customInfo?customerId=${item.customerId}`,
					});
					break;
				default:
					break;
			}
		},
		// 去客户详情页
		gotoCustomerInfo(item) {
			// 详情页更新客户经理,此处能让列表的客户经理即时更新
			this.setCurrentCustomerItem(item);
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${item.bookOrderCustomerID}`,
			});
		},
		// --------------------- methods预订单
		// 初始化区域和桌台
		async initAreaAndTable(item, cb) {
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				storeID: storeId,
				dinnerType: item.diningTypeID,
				bookOn: item.bookOn,
			};

			const tableAreaList = await this.getArea(data);
			// console.log(tableAreaList);

			this.requestOrders(item, cb);
		},
		// 请求当前区域下订单
		async requestOrders(item, cb) {
			// 当前区域id
			const areaID = item.tableAreaID;
			// 当前门店id
			const storeId = this.$storage.getAppUserInfo().currentStoreId;

			const data = {
				areaID: [
					areaID
				],
				bookOn: item.bookOn,
				type: item.diningTypeID,
				storeID: storeId,
				isNotShowExists: 0, // 不显示已经有订单的桌台(1为不显示)
				isGetOrder: 1,
			};
			// 获取当前区域下所有桌台下的所有订单
			let result = await CY08.GetTabelInApp(data);
			// 当前区域
			const areaTable = result.areaTable[0];
			areaTable.datalist.forEach(v => v.selected = false);
			const curArea = this.area.find(v => v.tableAreaID === areaTable.areaID);
			// console.log(curArea);
			// 下面两个true重要
			curArea.selected = true;
			curArea.advance = true;
			// console.log(curArea);
			curArea.tableList = areaTable.datalist;

			this.setArea(this.area);
			cb && cb();
		},
	}
}
