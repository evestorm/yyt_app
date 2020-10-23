import swIcon from '@/components/uni-icon/uni-icon.vue';
import CY17 from '@/service/CY/CY17AppService.js';
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
import storage from '@/common/unistorage/index.js';
// 导入枚举类
import enums from '@/common/enum/enums.js';
const CE = enums.commonListEnum;

// TODO: 左边列表仍然分页，默认加载当前选中客户的统计数据，加载过的数据缓存起来，不需要二次请求
import {
	mapState
} from 'vuex';

const app = getApp();

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			//年和月
			month: this.$moment().format('YYYY-MM'),
			//图片地址前缀
			imghttp: 'https://pic.cwyyt.cn',

			//手机默认状态栏
			statusBarHeight: 0,
			isSelectID: '', //被选中的经理id
			pageInfo: {
				allStoreFeeAmount: 0, //全店收入
				aCustomerCount: 0,
				activeToShopCount: 0,
				activeTrackAmount: 0,
				activeTrackCount: 0,
				activeTrackTableNum: 0,
				bCustomerCount: 0,
				banquetBookTableNumSUM: 0,
				banquetFeeSum: 0.00,
				cCustomerCount: 0,
				callOutCount: 0,
				casualAmount: 0, // 散客销售额
				casualTables: 0,
				customFeeSum: 0.00,
				customFeeTableNumSum: 0,
				customerTotalCount: 0,
				efficiency: 0,
				issueNumCount: 0,
				issueScore: 0,
				messageCount: 0,
				otherFeeAmount: 0, //其他收入
				recommendToShopCount: 0,
				recommendTrackAmount: 0,
				recommendTrackCount: 0,
				recommendTrackTableNum: 0,
				roomAmount: 0, // 客房销售额
				roomTables: 0,
				trackTotalCount: 0,
				weChatCount: 0,
				recommendEfficiency: 0,
				isFake: true, // 是否是假数据
			}, //页面右边显示数据
			// rightHeight:0,//右边高度,左右两边相等
			allList: [], // 所有数据的总和（左边客户经理，右边数据）
			canLoadMore: true, // 是否还能加载更多
			curSelected: 0, // 当前选中项
			loadnum: 1, // 当前page
		};
	},
	components: {
		uniLoadMore,
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		curPageInfo() {
			let cur = this.allList[this.curSelected];
			if (cur) {
				return cur;
			} else {
				return {
					pageInfo: this.pageInfo
				}
			}
		},
		canSeeAllDetail() {
			return this.$cw.canSeeAllDetail() || this.allList[this.curSelected] && this.allList[this.curSelected].marketerId ==
				this.$storage.getAppUserInfo().marketerId
		}
	},
	created() {
		this.initData();
	},
	mounted() {
		this.getLeftList();
	},
	watch: {
		'month'() {
			this.initData();
			this.getLeftList();
		}
	},
	filters: {
		paseFloor(num) { //部分浮点数*100会出现误差
			if (!num) return (0);
			num = num * 100;
			const sign = num / Math.abs(num);
			const number = num * sign;
			const temp = 3 - Math.floor(Math.log10(number));
			let ans;
			if (temp > 0) {
				ans = parseFloat(number.toFixed(temp));
			} else if (temp < 0) {
				ans = Math.round(number / Math.pow(10, temp)) * temp;
			} else {
				ans = Math.round(number);
			}
			return (ans * sign);
		}
	},
	methods: {
		initData() {
			this.loadnum = 1;
			this.canLoadMore = true;
			this.curSelected = 0;
			// this.allList = [{}];
			// this.allList[0].pageInfo = this.pageInfo;
		},
		// 获取左边数据
		async getLeftList() {
			if (!this.canLoadMore) return;
			let userInfo = storage.getAppUserInfo();
			let data = {
				storeId: userInfo.currentStoreId,
				// marketerId:storage.getAppUserInfo().marketerId,
				month: this.month,
				pageIndex: this.loadnum,
				pageSize: 10
			};
			// alert(JSON.stringify(data));

			// fix http://cd.whcewei.com/zentao/bug-view-6422.html  不做权限控制
			// if (storage.getSalesAuthority().isSeeAll == 0) {
			// 	data.marketerId = storage.getAppUserInfo().marketerId
			// }

			let res = await CY17.GetMonthMarketPagedList(data);
			if (res) {
				// 解决列表数据为null的情况
				// let curLeftList = res.dataList.filter(v => v !== '');
				let curLeftList = res.dataList;
				curLeftList.forEach(v => {
					v.pageInfo = this.pageInfo;
				})

				if (this.loadnum == 1) { // 第一次加载
					this.allList = curLeftList;
					// 如果allList有数据，默认请求第一个客户经理的详情数据
					if (this.allList.length > 0) {
						let first = this.allList[0];
						// this.isSelectID = first.marketerId;
						await this.getDetail(first);
					}
				} else { // 第 n-1 次加载
					this.allList = this.allList.concat(curLeftList);
				}

				++this.loadnum;
				// 什么情况下不能加载更多？ 当前 pageIndex > pageCount
				if (this.loadnum > res.pageCount) {
					this.canLoadMore = false;
				}
			}
		},
		// 获取某个销售员的数据详情
		async getDetail(marketer) {
			let userInfo = storage.getAppUserInfo();
			let data = {
				storeId: userInfo.currentStoreId,
				marketerId: marketer.marketerId,
				month: this.month,
			}
			let res = await CY17.GetMarketMonthSummary(data);
			if (res) {
				// 在所有列表中查找此销售员，并给予详情信息
				let filter = this.allList.filter(v => marketer.marketerId == v.marketerId)[0];

				if (filter) {
					filter.pageInfo = {
						...res,
						isFake: false,
						isInit: false,
					};
				}
			}
		},
		//切换月份
		chooseDate(e) {
			this.month = e.target.value;
		},
		//切换经理
		async changePeople(index) {
			let target = this.allList[index];
			if (target) {
				this.curSelected = index;
				if (target.pageInfo.isFake) { // 如果之前是模拟数据，才请求
					await this.getDetail(target);
				}
			}
		},
		//跳转评价回复
		goESearchComment() {
			if (!this.canSeeAllDetail) {
				return;
			}
			let target = this.allList[this.curSelected];
			let marketerId = target.marketerId;
			let marketerName = target.marketerName
			if (target.marketerId == 'store') {
				marketerName = this.$storage.getAppUserInfo().currentStoreName;
			}
			uni.navigateTo({
				url: `/pages/mySub/SearchComment/SearchComment?MarketerID=${marketerId}&month=${this.month}&marketerName=${marketerName}`
			})
		},
		//跳转订单列表commonList
		goCommonList(type, leve) {
			if (!this.canSeeAllDetail) {
				return;
			}
			if (type == 'individualOrders') {//新增散客不能点击跳转到列表
				return
			};
			let target = this.allList[this.curSelected];
			if (target) {
				let marketerId = target.marketerId;
				let marketerName = target.marketerName;
				if (target.marketerId == 'store') {
					marketerName = this.$storage.getAppUserInfo().currentStoreName;
				}
				let value = this.getUrl(type, leve);
				uni.navigateTo({
					url: '/pages/_common/commonList/commonList?dataType=' + value + '&marketerId=' + marketerId + '&month=' + this.month +
						'&marketerName=' + marketerName
				})
			}
		},
		getUrl(type, leve) {
			switch (type) {
				case 'customerOrder':
					return CE.customerOrder.value
					break;
				case 'banquetOrder':
					return CE.banquetOrder.value
					break;
				case 'individualOrders':
					return CE.individualOrders.value;
					break;
				case 'accommodationOrder':
					return CE.accommodationOrder.value;
					break;
				case 'transformOrder':
					return CE.transformOrder.value;
					break;
				case 'activeTransformation':
					return CE.activeTransformation.value;
					break;
				case 'recommendedTransformation':
					return CE.recommendedTransformation.value;
					break;
				case 'customerPool':
					return CE.customerPool.value + '&customerLevel=' + leve;
					break;
				default:
					return CE.customerTracking.value + '&callType=' + leve;
					break;
			}
		},
		//上一月
		goleft() {
			let currentDate = this.month + '-01';
			let premonth = this.$moment(currentDate).add(-1, 'months').format('YYYY-MM');
			this.month = premonth;
		},
		//下一月
		goright() {
			let currentDate = this.month + '-01';
			let nextmonth = this.$moment(currentDate).add(1, 'months').format('YYYY-MM');
			this.month = nextmonth;
		},
		//返回键
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
	}
};
