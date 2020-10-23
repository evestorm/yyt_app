// ---------------- import三方 --------------------
import util from '@/common/util.js';
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import * as echarts from '@/lib/echarts/echarts.min.js';

// 弹窗popup组件
import uniPopup from '@/components/uni-popup/uni-popup.vue';
// ---------------- import数据请求 ------------------

import CY82 from '@/service/CY/CY82AppService.js';
import CY57 from '@/service/CY/CY57AppService.js'; // 跟踪消费记录
import CY19 from '@/service/CY/CY19AppService.js';

import {
	mapState,
	mapMutations
} from 'vuex';

const app = getApp();

const customerInfoArr = [{
		id: 'basicInfo',
		name: '基本信息',
	},
	{
		id: 'trackRecordConsumption',
		name: '跟踪消费记录',
	},
	{
		id: 'consumptionStatistics',
		name: '消费统计',
	},
	{
		id: 'monthlyStatistics',
		name: '月统计',
	}
];

// ------------------- impoart组件 -------------------
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";

const PAGESIZE = 10;

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			customSaveName: '', // 本机当前用户的通讯录名称
			// ------------------ dataPayload ---------------------
			fromPage: null, // 从哪儿来
			// ------------------ data用户权限信息 ---------------------
			getSalesAuthority: storage.getSalesAuthority() ? storage.getSalesAuthority() : '',

			// ------------------ dataTab导航 ----------------------
			customerInfoSelected: 0, // 选中tab
			customerInfoArr: customerInfoArr,
			// ------------------ data其他组件 ---------------------
			index: 0, // 销售负责人picker索引
			sales: storage.getChooseMarketData(), // 销售经理列表

			// ------------------ data百度eCharts -----------------------
			myCharts: null,
			chartData: [],
			yType: 1,
			xType: 1,
			num: -1, // 客户标签索引

			// ------------------ data数据请求 --------------------
			QueryData: { // 客户详情信息请求参数
				customerID: '',
				month: '',
				year: ''
			},
			ctInfo: { // 获取的客户详情信息
				isArrange: '',
				customerTags: [], // 客户标签
			},
			copyCtInfo: {}, // 拷贝的客户详情信息对象
			storage: {}, // this.$storage的AppUserInfo信息
			markIcon: [], //客户标记集合

			// --------------------- data跟踪消费记录 --------------------
			salesRecodeArr: [], // 请求到的数据

			// --------------------- data月统计信息 ----------------------
			rankSummaryArr: [], // 请求到的数据

			// -------------------- dataMescroll配置 ----------------------
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			mescrollSingleForSalesRecord: {}, // 消费统计mescroll实例
			mescrollSingleForRankSummaryInfo: {}, // 月统计mescroll实例
			mescrollTop: 600, // mescroll距离顶部高度
			options: {},
			summaryStat: {
				totalFeeAmount: 0, //总消费金额
				tableAvgFeeAmount: 0, //桌均
			}, //汇总数据
			currentStoreId: this.$storage.getAppUserInfo().currentStoreId, // 当前门店id
		}
	},
	components: {
		uniPopup
	},
	onShow() {
		// 此监听放onShow的原因是，从客户详情再跳编辑，然后返回到详情，再点击编辑标签页后，保存标签返回到客户详情时，不会触发下面事件
		// 所以放onShow，
		// 监听：跳转【编辑客户标签】页选择新标签后返回的数据
		// 这个编辑标签操作是在【editCustomerLabel】中异步保存的，这里仅同步展示
		uni.$on('sw-customer-detail-label', data => {
			if (this.$cw.currentCustomerPoolItem) {
				this.$cw.currentCustomerPoolItem.customerLable = data.newLabelArr.map(v => v.name);
			}
			const tempCustomInfo = Object.assign({}, this.ctInfo);
			tempCustomInfo.customerTags = data.newLabelArr;
			this.ctInfo = Object.assign({}, tempCustomInfo);
		});
		// uni.$on('sw-customer-detail-baseInfo', data => {
		// 	// 客户列表选中的item
		// 	if (this.$cw.currentCustomerPoolItem) {
		// 		console.log({curCustomer: this.$cw.currentCustomerPoolItem, updateCustomer: data});
		// 	}
		// });
	},
	onUnload() {
		uni.$off('sw-customer-detail-label');
	},
	onLoad(payload) {
		this.options = payload;
		this.storage = this.$storage.getAppUserInfo();
		const {
			customerId,
			tabIndex,
			fromPage
		} = payload;
		this.fromPage = fromPage;

		this.QueryData.customerID = customerId;

		this.reqCustomerInfo();

		if (tabIndex == 1) { // 列表直接跳转跟踪消费记录
			this.$nextTick(()=> {
				// 延迟加载数据
				this.customerInfoTabSelect(tabIndex);
			});
		}



		// 监听:跳转[编辑客户详情]页,更新后返回该页面
		uni.$on('sw-customerinfo-update', () => {
			this.reqCustomerInfo();
		});
	},
	mounted() {
		// 初始时先计算一次mescroll高度
		this.initFixedTop();
	},
	computed: {
		...mapState(['currentCustomerItem']),

		// ---------------- computed客户基本信息 -------------------
		// 头像设置
		getImgUrl() {
			return function(url) {
				if (url != '' && url != null) {
					// console.log('url(' + encodeURI(url) + ')');
					return 'url(' + encodeURI(url) + ')';
				} else {
					return 'url("https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png")';
				}
			}
		},
		// 是否可编辑
		canEdit() {
			// 有编辑所有权限，则能编辑所有客户；客户经理可编辑自己的客户
			if (this.$cw.canEditAllCustomer()) {
				return true;
			} else {
				if (this.ctInfo.customerMarketerID == this.$storage.getAppUserInfo().marketerId) {
					return true;
				}
				return false;
			}
		},
	},
	filters: {
		parseCallType(value) {
			let callType = {
				1: "呼入",
				2: "呼出",
				3: "短信",
				4: "电话未接通",
				5: "微信发送",
				6: "收到短信"
			};
			return callType[value];
		},
		parseFollowType(value) {
			if (value == 1) {
				return "重点跟踪"
			} else if (value == 2) {
				return "维持稳定"
			} else {
				return "挖掘机会"
			}
		}
	},
	methods: {
		...mapMutations(['setCurrentCustomerItem']),

		// ---------------------- methods数据请求 --------------------
		// 从通讯录读取当前客户的姓名
		getTheNameFromTheAddressBook() {
			if (this.$cw.isApp(false)) {
				if (this.$cw.isiOS()) {
					this.$cw.canGetAddressBook((auth) => {
						if (auth) {
							this.$cw.getContacts((data) => {
								this.getCustomSaveName(data);
							});
						}
					}, false);
				} else {
					this.$cw.getContacts((data) => {
						this.getCustomSaveName(data);
					});
				}
			}
		},
		// 处理通讯录
		getCustomSaveName(data) {
			this.str = data;
			let bookList = [];
			this._(this.str).forOwn((value, key) => {
				let obj = {};
				obj.customSaveName = value || '';
				obj.phone = key;
				bookList.push(obj);
			});
			let customer = bookList.filter(v => v.phone == this.ctInfo.phone)[0];
			if (customer) {
				this.customSaveName = customer.customSaveName;
			}
		},
		// 获取客户详情
		async reqCustomerInfo() {
			const data = {
				customerID: this.QueryData.customerID,
				storeID: this.storage.currentStoreId,
				cWCompanyId: this.storage.cwCompanyID,
				isInPhone: 1,
			}
			let result = await CY19.GetCustomerDetail(data);
			//只有有查看客户列表权限，查看所有权限,查看客户跟踪权限，客户跟踪查看所有，客户经理为当前登陆人，才能进入客户详情
			if (result) {
				// console.log('查看客户：',this.$cw.canSeeCustomerList())
				// console.log('查看所有客户列表：',this.$cw.canSeeAllCustomer())
				// console.log('查看所有客户跟踪：',this.$cw.canSeeAllTrack())
				// console.log('查看客户跟踪：',this.$cw.canSeeTrack())
				// console.log('id：',this.$storage.getAppUserInfo().marketerId,result.customerMarketerID)
				if (!(this.$cw.canSeeAllCustomer() ||
						this.$cw.canSeeAllTrack() ||
						((this.$cw.canSeeCustomerList() || this.$cw.canSeeTrack()) && this.$storage.getAppUserInfo().marketerId ==
							result.customerMarketerID))) {
					uni.showToast({
						title: '无权限查看该用户信息,2s后返回...',
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000);
					return;
				}
				this.markIcon = [];
				result.customerImgUrl && this.markIcon.push(result.customerImgUrl);
				result.customerLevelImgUrl && this.markIcon.push(result.customerLevelImgUrl);
				result.sProgramImgUrl && this.markIcon.push(result.sProgramImgUrl);
				result.storedImgUrl && this.markIcon.push(result.storedImgUrl);
				result.vipImgUrl && this.markIcon.push(result.vipImgUrl);
				result.weiXinPayImgUrl && this.markIcon.push(result.weiXinPayImgUrl);
				result.shopImgUrl && this.markIcon.push(result.shopImgUrl);

				// 整理状态如果为null,就默认显示[未整理]
				if (result.isArrange == null) {
					result.isArrange = '0'
				}

				this.ctInfo = result;
				// console.log(this.ctInfo);
				// 读取本机当前用户的通讯录名称
				this.getTheNameFromTheAddressBook();
				this.copyCtInfo = JSON.parse(JSON.stringify(result));
				this.copyCtInfo.isArrange = result.isArrange ? '1' : '0';
				this.copyCtInfo.isArrange = result.isArrange ? '1' : '0';
				this.copyCtInfo.marketerName = this.copyCtInfo.marketerName ? this.copyCtInfo.marketerName : this.storage.userName;

				// 初始化客户经理选中状态
				this.getSalesInfo();
				this.$nextTick(function() {
					this.myCharts && this.myCharts.resize();
				});
				this.$nextTick(() => {
					this.initFixedTop();
				});
			} else {
				uni.showToast({
					title: '暂无该用户信息,2s后返回...',
					icon: 'none',
					duration: 2000
				});
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 2000);

			}

		},
		// 返回上一页
		onBack() {
			uni.$emit('customerback', {
				'refresh': true,
			});
			// 如果有fromPage,就通知customer父组件刷新对应的子组件(客户跟踪/客户列表)
			if (this.fromPage) {
				uni.$emit('the-list-should-be-refreshed', {
					'fromPage': this.fromPage
				});
			}
			uni.navigateBack({
				delta: 1
			});
		},

		// -------------------- methods顶部客户信息 -------------------
		// 改变整理状态
		changeStatus(val) {
			if (!this.canEdit) {
				let ori = this.ctInfo.isArrange;
				this.ctInfo.isArrange = val;
				this.$nextTick(() => {
					this.ctInfo.isArrange = ori;
				});
				return;
			};

			this.ctInfo.isArrange = val;
			if (val == '1' && val !== this.copyCtInfo.isArrange) {
				this.changeArrangeStatus();
				if (this.$cw.currentCustomerPoolItem) {
					this.$cw.currentCustomerPoolItem.isArrange = '1';
				}
				this.createArrangeRecode();
			} else if (val == '1' && val == this.copyCtInfo.isArrange) {
				this.changeArrangeStatus();
				if (this.$cw.currentCustomerPoolItem) {
					this.$cw.currentCustomerPoolItem.isArrange = '1';
				}
			} else {
				this.changeArrangeStatus();
				if (this.$cw.currentCustomerPoolItem) {
					this.$cw.currentCustomerPoolItem.isArrange = '0';
				}
			}
		},
		// 去发短信
		gotoSendMsg() {
			this.$util.baiduEvent('发短信', '客户详情页头部发短信');
			let ctInfo = this.ctInfo;
			// 证明数据加载成功
			if (ctInfo.customerName) {
				let url =
					`/pages/customerSub/sendMsg/sendMsg?customerID=${ctInfo.customerID}&customerName=${ctInfo.customerName}&phone=${ctInfo.phone}&msgName=${ctInfo.msgName || ctInfo.customerName }&customSaveName=${ctInfo.customSaveName}`;
				if(this.options.isFllow){
					url=url+`&isFllow=${this.options.isFllow}`
				}
				uni.navigateTo({
					url,
				});
			}
		},
		// 去打电话
		gotoCallPhone(phone) {
			this.$util.baiduEvent('打电话', '客户详情页头部打电话');
			if (cw.isApp(true)) {
				cw.callPhone(phone,0,()=>{
					// //跟新主动跟踪
					// if(getApp().globalData.customerPageData.isFollowGo&&getApp().globalData.customerPageData.fllowData.phone==phone&&getApp().globalData.customerPageData.fllowData.customerFollowID){
					// 	uni.$emit('refreshCustomFollow');//跟新跟踪列表
					// }
				});
			}
		},
		// 打开添加标签页面
		openTagPage() {
			this.$util.baiduEvent('打标签', '客户详情页头部打标签');
			var query = {
				customerId: this.QueryData.customerID,
			}
			uni.navigateTo({
				url: "/pages/_common/editCustomerLabel/editCustomerLabel?" + util.urlEncode(query)
			});
		},

		// -------------------- methods导航栏 -------------------
		// 去编辑客户详情
		gotoEditCustomerInfo() {
			const query = {
				customerId: this.QueryData.customerID,
			};
			uni.navigateTo({
				url: "/pages/_common/addCustomerInfo/addCustomerInfo?" + util.urlEncode(query)
			})
		},

		// ---------------------- methodsTab导航切换 -----------------
		// tab顶部固定tab选择
		customerInfoTabSelect(index) {
			this.customerInfoSelected = index;
			this.customerInfoScrollLeft = (this.customerInfoSelected - 1) * 60;

			// 延迟到点击加载
			if (this.customerInfoSelected == 1&&this.salesRecodeArr.length==0) {
				this.downCallbackForSalesRecord(this.$refs.ScrollSalesRecord.mescroll);
			}else if (this.customerInfoSelected == 2){
				this.getChartData(() => {
					this.renderEcharts({
						yType: this.yType,
						xType: this.xType
					});
				});
			}
			else if (this.customerInfoSelected == 3&&this.rankSummaryArr.length==0){
				this.downCallbackForRankSummaryInfo(this.$refs.ScrollRankSummaryInfo.mescroll);
			}
		},

		// ---------------------- methods基本信息 -----------------
		// 改变整理状态
		async changeArrangeStatus() {
			let ctInfo = this.ctInfo;
			let data = {
				id: ctInfo.customerID,
				isArrange: ctInfo.isArrange,
			};
			let res = await CY19.UpdateByDto(data);
			if(res && this.$storage.getCustomers()){//当时从发送短信页面跳转进来时，更改整理状态会影响发送短信页面整理状态的展示
				let customerList=JSON.parse(this.$storage.getCustomers());
				let findIndex=this._(customerList).findIndex(x=>x.customerID==this.QueryData.customerID);
				if(findIndex!=-1){
					customerList[findIndex].isArrange=res.isArrange;
				}
				this.$storage.setCustomers(JSON.stringify(customerList));
			}
		},
		// 创建整理记录
		async createArrangeRecode() {
			let data = {
				arrangePerson: this.storage.userName,
				arrangeDataTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
				arrangeId: this.storage.marketerId,
				storeId: this.storage.currentStoreId,
				customerName: this.ctInfo.customerName,
				customerID: this.ctInfo.customerID,
			};
			let res = await CY82.CreateByDto(data);
		},
		// 去打电话
		// gotoCallPhone(phone) {
		// 	if (cw.isApp(true)) {
		// 		cw.callPhone(phone)
		// 	}
		// },
		// 添加到通讯录确认弹窗
		addToContacts(ct) {
			this.$refs.cancelAddToContactsPopup.open();
			// if (this.$cw.isApp(true)) {
			// 	if (this.$cw.isiOS()) {
			// 		this.$cw.canGetAddressBook((auth) => {
			// 			if (auth) {
			// 				this.$refs.cancelAddToContactsPopup.open();
			// 			}
			// 		});
			// 	} else {
			// 		this.$refs.cancelAddToContactsPopup.open();
			// 	}
			// }
		},
		// 取消添加到通讯录
		cancelAddToContacts() {
			this.$refs.cancelAddToContactsPopup.close();
		},
		// 确定添加到通讯录
		confirmAddToContacts() {
			if (cw.isApp(true)) {
				this.$cw.insertPhone(this.ctInfo.customerName, this.ctInfo.phone, (res) => {
					if (res == 'success') {
						uni.showToast({
							title: '添加成功!'
						});
						// 读取本机当前用户的通讯录名称
						this.getTheNameFromTheAddressBook();
					} else {
						this.$cw.showError(res);
					}
				});
			}

			this.$refs.cancelAddToContactsPopup.close();
		},

		// ---------------------- methods跟踪消费记录 --------------------------
		/*下拉刷新的回调 */
		downCallbackForSalesRecord(mescroll) {
			this.mescrollSingleForSalesRecord = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallbackForSalesRecord(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = {
				pageIndex: 1,
				pageSize: 10,
				order: "beginTime desc",
				storeID: storage.getAppUserInfo().currentStoreId,
				customerId: this.QueryData.customerID, // 页面接受参数
				consumeType: 0,
				filter: {
					type: "and",
					conditions: [{
							attribute: "callRecordCWCompanyId",
							datatype: "nvarchar",
							operatoer: "eq",
							value: storage.getAppUserInfo().cwCompanyID
						},
						{
							attribute: "customerId",
							datatype: "nvarchar",
							operatoer: "eq",
							value: this.QueryData.customerID,
						}
					]
				}
				//customerId: $.cw.getQueryString("customerId"),
				//storeId: $.cw.getUserInfo().currentStoreId,
				//month: $.cw.getQueryString("month") ? $.cw.getQueryString("month") : ""
			};
			data.pageIndex = pageNum;
			data.pageSize = pageSize;

			// 获取跟踪消费记录
			let result = await CY57.GetCallAndConsumeLog(data);

			if (result) {
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.dataList;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) this.salesRecodeArr = []; //如果是第一页需手动置空列表
				this.salesRecodeArr = this.salesRecodeArr.concat(curPageData); //追加新数据
				console.log({
					'跟踪消费记录列表salesRecodeArr': this.salesRecodeArr
				});
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// ---------------------- methods消费统计(echarts) ---------------
		changeType(type, num) {
			const dataType = type;
			if (dataType) {
				switch (num) {
					case 0:
						this.yType = dataType;
						this.renderEcharts({
							yType: this.yType,
							xType: this.xType
						});
						break;
					case 1:
						this.xType = dataType;
						this.renderEcharts({
							yType: this.yType,
							xType: this.xType
						});
						break;
				}
			}
		},
		// 请求chart显示数据
		async getChartData(success) {
			let data = {
				customerID: this.QueryData.customerID,
				cWCompanyId: this.storage.cwCompanyID,
				isGetChartStat: true,
				isGetSummaryStat: true,//获取汇总数据
				isGetMonthStat: false,
				storeID: this.storage.currentStoreId,
			};
			let result = await CY19.GetCustomerConsumeStat(data);
			this.chartData[0] = result.weekCharts;
			this.chartData[1] = result.bookOrderCharts;
			this.summaryStat = result.summaryStat;
			success && success();

		},
		// 渲染echarts
		renderEcharts(obj) {
			this.myCharts = echarts.init(this.$refs.coustomChart, null, {
				renderer: 'svg'
			});
			let yType = ['星期', '餐别'];
			let xType = ['次数（次）', '金额（元）', '桌均（元/人）'];
			let interval = [1, 50, 50];
			let seriesType = ['countList', 'feeAmountList', 'tableAvgList'];
			let colorList = ['#3492fb', '#ffb400', '#4c77f4', '#2263e8', '#6822e8',
				'#22aee8', '#e122e8', '#22e8ae', '#e85122', '#e1e822', '#e82247', '#21ccd9'
			];
			let unit = '次';
			obj.yType = obj.yType || 1;
			obj.xType = obj.xType || 1;
			obj.dingType = obj.dingType || [];
			(obj.xType != 1) && (unit = '元');
			let option = {
				title: {
					text: '近三月' + yType[obj.yType - 1] + xType[obj.xType - 1] + '统计',
					padding: [12, 0, 65, 0],
					left: 'left',
					textStyle: {
						position: 'top',
						fontSize: '12',
						fontWeight: '400',
						color: '#4D4D4D',
					},
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					x: 'left',
					y: 'bottom',
					data: [],
				},
				grid: {
					top: '15%',
					left: '3%',
					right: '8%',
					bottom: '10%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					minInterval: 1,
					axisLine: {
						show: false
					},
					axisLabel: {
						color: '#9a9a9a'
					},
					splitLine: {
						lineStyle: {
							color: '#eee'
						}
					}
				},
				yAxis: {
					type: 'category',
					nameTextStyle: {
						color: '#383636'
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: '#eee'
						}
					},
					axisLabel: {
						color: '#9a9a9a',
						fontSize: '12',
					}
				},
				series: [{
					type: 'bar',
					name: "",
					itemStyle: {
						normal: {}
					},
					color: '#0185fe',
					data: []
				}]
			};
			let xIndex = obj.xType - 1;
			let yIndex = obj.yType - 1;
			let currentData = this.chartData[yIndex][seriesType[xIndex]];
			//option.yAxis.name = yType[yIndex] + '/' + xType[xIndex] + '(' + unit + ')';
			var legend = {
				x: 'left',
				y: 'bottom',
				data: [xType[xIndex]]
			};
			option.legend = legend;
			option.yAxis.data = this.chartData[yIndex].nameList;
			option.series[0].name = xType[xIndex];
			option.series[0].data = this.chartData[yIndex][seriesType[xIndex]];
			option.series[0].itemStyle.normal.color = function(params) {
				return yIndex ? colorList[params.dataIndex] : colorList[xIndex];
			};
			this.myCharts.setOption(option);
		},
		// ---------------------- methods月统计 --------------------------
		/*下拉刷新的回调 */
		downCallbackForRankSummaryInfo(mescroll) {
			this.mescrollSingleForRankSummaryInfo = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallbackForRankSummaryInfo(mescroll) {
			let data = {
				customerID: this.QueryData.customerID,
				cWCompanyId: this.storage.cwCompanyID,
				isGetChartStat: false,
				isGetSummaryStat: false,//获取汇总数据
				isGetMonthStat: true,
				storeID: this.storage.currentStoreId
			};
			let result = await CY19.GetCustomerConsumeStat(data);
			if (result) {
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.monthStats;

				//更新列表数据
				this.rankSummaryArr = curPageData;

				//方法一(推荐): 后台接口有返回列表的总页数 totalPage(排行定死的1页)
				mescroll.endByPage(curPageData.length, 1);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// --------------------- methods数据处理 ----------------------
		// 初始化销售经理选中状态
		getSalesInfo() {
			// console.log(this.ctInfo.customerPoolMarketID, this.ctInfo.customerMarketerID);
			this.sales.forEach((v, index) => {
				if (v.value === this.ctInfo.customerPoolMarketID) { // 如果该用户客户池销售经理在经理列表中，就选中
					this.index = index;
				} else if (v.value == this.ctInfo.customerMarketerID) { // 如果该用户销售经理在经理列表中,就选中
					this.index = index;
				}
			});
		},
		// 更改固定销售
		updateFixedSales(e, ctInfo) {
			const self = this;
			if (!this.canEdit) {
				uni.showToast({
					title: '您没有权限执行此操作',
					icon: 'none'
				})
				return;
			};
			this.$util.baiduEvent('更换客户经理', '客户详情页头部更换客户经理');
			console.log({
				"customerPoolMarketID": ctInfo.customerPoolMarketID
			});
			self.index = e.target.value;
			const value = self.sales[self.index].value;
			const text = self.sales[self.index].text;
			// console.log(self.sales[self.index]);
			if (ctInfo.customerID) {

				uni.showModal({
					title: '提示',
					content: '确定更改客户经理？',
					success: function(res) {
						if (res.confirm) {
							var obj = {
								// customerPoolMarketID: value,
								marketerID: value,
								id: ctInfo.customerID
							}
							var removeRecordData = {
								operatorID: self.storage.id,
								customerID: ctInfo.customerID,
								oldMarketerID: ctInfo.customerPoolMarketID,
								newMarketerID: value,
								cwCompanyID: self.storage.cwCompanyID
							}
							const success = (result) => {
								setTimeout(() => {
									uni.showToast({
										title: '更新成功！',
										icon: 'success',
										duration: 2000
									});
								});
								// 通知外面客户列表更新列表数据
								uni.$emit('changeCSManagerToCustomerList', self.currentCustomerItem);
								console.log(self.currentCustomerItem);
								// 同步更新外边列表的客服/客户池经理
								// update:5893 - 一旦变更客户经理，返回上一页，直接删除该用户（全部的时候不删除）
								if (self.currentCustomerItem) {
									const tempCurrentCustomerItem = self.currentCustomerItem;
									// 如果之前有客户池经理，就更新客户池经理文字
									if (tempCurrentCustomerItem.customerPoolMarketName) {
										// 这是客户列表/跟踪的客户池经理
										tempCurrentCustomerItem.customerPoolMarketName = text;
										self.ctInfo.customerPoolMarketID = value;
										self.ctInfo.customerPoolMarketName = text;
										// 这是月统计穿透过去的列表中客户池经理
										tempCurrentCustomerItem.marketerPoolName = text;
										tempCurrentCustomerItem.customerPoolMarketID = value;
										tempCurrentCustomerItem.isLockMarket = result.isLockMarket;
									}
									// 不管有没有，都要更新客户经理
									// 这是客户列表/跟踪的客户经理
									tempCurrentCustomerItem.marketerName = tempCurrentCustomerItem.marketer = text;
									// debugger
									self.setCurrentCustomerItem(tempCurrentCustomerItem);
								}
								// 更新当前详情页显示的客户经理
								self.ctInfo.marketerName = text;
								self.ctInfo.isLockMarket = result.isLockMarket;
								if (self.ctInfo.customerPoolMarketName) {
									self.ctInfo.customerPoolMarketName = text;
								}
								// console.log({currrrrrCustoemr: self.currentCustomerItem, ctInfo: self.ctInfo});
								self.ctInfo = Object.assign({}, self.ctInfo)
							};
							self.$cw.updatefixedSales(obj, success, removeRecordData);
						} else if (res.cancel) {}

					}
				});
			} else {
				// TODO:这是啥操作,没看懂...
				self.ctInfo.customerPoolMarketID = selectItems[0].value;
			}
		},

		// ----------------------- 吸顶功能 -------------------
		// 初始化吸顶标题的工作
		initFixedTop() {
			if (this.$refs.tabInfoWrapperRef) {
				// 顶部tab切换栏rect
				let tabInfoRect = this.$refs.tabInfoWrapperRef.$el.getBoundingClientRect();
				// 计算 tab底部+margin 的高度
				this.mescrollTop = (tabInfoRect.bottom + uni.upx2px(10)).toString();
			}
		},
	},
	watch: {
		// ------------------ watch基本信息 ----------------------

		// 状态整理
		"ctInfo.isArrange": {
			handler(val, oldval) {
			}
		},
	}
}
