//------------------------------mock数据引入---------------------------
import searchRecordMock from './searchRecord_mock.js';

import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import CY57 from '@/service/CY/CY57AppService.js';
import CY19 from '@/service/CY/CY19AppService.js';
import util from '@/common/util.js';

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

const PAGESIZE = 5;
const PAGESIZESEARCH = 10;
const isLoadMockData = false; // 为方便开发，pc端测试用mock数据，设置为true，上线设置为false

export default {
	data() {
		return {
			picDomain: getApp().globalData.PicDomain,
			curInx: 0, // 当前 通话记录 or 我的客户 索引
			scrollviewHight: '', // scrollview的高度
			searchText: '', // 搜索条件
			customerQuery: {
				// 根据 keyword 搜索客户
				Order: 'CustomerName desc',
				PageIndex: 1,
				PageSize: PAGESIZE,
			},
			callRecords: {
				// 通话记录前端分页 优化改成5条 ydm
				pageIndex: 1,
				pageSize: 5,
			},
			callRecordsList: [], // 异步获取的总通话记录数据
			callPhoneRecodeInfo: [], //通话记录信息，
			customerListQuery: {
				// 获取我的客户
				order: 'AILevel desc',
				pageIndex: 1,
				pageSize: PAGESIZE,
			},
			searchHistoryArr: [], // 搜索历史
			historyMaxLen: 3,
			searchCustomerInfo: [], // 搜索的客户信息
			customerListInfo: [], // 客户列表信息
			fromBook: false, // 来自预订页面
			status: 'more',
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了',
			},
			bnBookID: '',
			bnBookOn: '',
			bnDinnerType: '',
			saveName: {}, // 手机联系人列表
			CallfilterList: [], // 过滤后的通讯录
			isiOS: false,
		};
	},
	components: {
		uniLoadMore,
	},
	onLoad(options) {
		this.isiOS = this.$cw.isiOS();
		this.bnBookID = options.bookID;
		this.bnBookOn = options.bookOn;
		this.bnDinnerType = options.dinnerType;
		const bookID = options.bookID;
		this.fromBook = bookID || bookID == '' ? true : false;
		// 通话记录
		this.getCallPhoneRecodeInfo();
		// 获取联系人--globalData
		this.$cw.getRecordsData();
	},
	onShow() {
		const searchLocal = this.$storage.getSearchLocal();
		this.searchHistoryArr = searchLocal ? searchLocal : [];

		// 获取手机联系人
		if (this._.isEmpty(this.saveName)) {
			this.saveName = getApp().globalData.recordsDat;
		}
		this.getSaveName();
	},
	// 下拉刷新
	onPullDownRefresh() {
		//下拉刷新的时候请求一次数据
		this.curInx == 1 ? this.getCustomerList(1) : '';
	},
	// 上拉加载
	onReachBottom() {
		if (this.curInx === 0 && this.callRecords.pageIndex >= 2) {
			// 通话记录
			this.getCallPhoneRecodeInfo();
		} else if (this.curInx === 1) {
			// 我的客户
			const pageIndex = this.customerListQuery.pageIndex;
			this.getCustomerList(pageIndex);
		}
	},
	methods: {
		// 设置bookerInfo / 设置customer tab 当前选中tab
		...mapMutations(['setBookerInfo', 'setReserveTab']),
		//===========================================获取通讯录名 匹配=========================================================
		getSaveName() {
			for (let m = 0; m < this.callPhoneRecodeInfo.length; m++) {
				for (let key in this.saveName) {
					if (this.callPhoneRecodeInfo[m].phone == key) {
						this.callPhoneRecodeInfo[m].customSaveName = this.saveName[key];
					}
				}
			}
		},
		// 切换通话记录和客户列表
		changeCallTab(index) {
			this.curInx = index;
			if (this.curInx == 1 && this.customerListInfo.length == 0) {
				this.getCustomerList(1);
			} else if (this.curInx == 0 && this.callPhoneRecodeInfo.length == 0) {
				this.getCallPhoneRecodeInfo();
			}
		},
		// 根据条件搜索的客户信息
		async searchCustomer() {
			if (!this.searchText) return;
			let str = this.searchText.replace(/\s*/g, '');
			const data = this.customerQuery;
			let result = await CY19.SearchHomeCustomers({
					CWCompanyID: this.$storage.getAppUserInfo().cwCompanyID,
					CustomerName_like: str,
					Phone_like: str,
					customerQuickCheckCode_like: str,
					companyQuickCheckCode_like: str,
					pagesize: PAGESIZESEARCH,
				},
				null,
				null,
				false
			);
			this.searchCustomerInfo = [];
			if (result.dataList.length != 0) {
				this.searchCustomerInfo = result.dataList;
			} else {
				let obj = {
					phone: str,
					customerName: '',
					isNotCustomer: 1,
				};
				this.searchCustomerInfo[0] = obj;
			}
		},
		// 取消搜索
		cancel() {
			uni.navigateBack({
				delta: 1,
			});
		},
		// 获取通讯记录信息
		async getCallPhoneRecodeInfo() {
			// 如果在移动端，实时获取通话记录
			let curPageList = [];
			//需要更改为：YYT.GetPhoneCallResult得到数据通讯录所有记录，然后每次按分页PAGESIZE大小向后端请求数据，加载
			if (this.callRecords.pageIndex == 1) {
				// 获取数据
				if (this.$cw.isApp(false) && this.$cw.isAndroid()) {
					// 是app，实时获取
					// 获取本机通话记录
					let beginDate = this.$moment(new Date())
						.subtract(2, 'weeks')
						.format('YYYY-MM-DD HH:mm:ss');
					// const dataList = YYT.GetPhoneCallResult(beginDate);
					const dataList = isLoadMockData ?
						searchRecordMock.getDataList() :
						this.$cw.getPhoneCallResult(beginDate);
					// alert(JSON.stringify(JSON.parse(dataList).map(v => ({beginTime: v.beginTime, phone: v.phone}))));
					const tempCustomerData = isLoadMockData ?
						dataList :
						JSON.parse(dataList);
					let seen = new Map();
					// 去重，一个客户多条记录，只显示最近一次记录
					this.callfilterList = tempCustomerData.filter((a) => {
						return !seen.has(a.phone) && seen.set(a.phone, 1);
					});
				} else {
					// pc端，延迟获取通话记录
					const data = {
						// 都不用传，默认前20条
						// marketerId: this.$storage.getAppUserInfo().marketerId,
						// countSize: '100'
					};
					let result = await CY57.FastSearchOfAddressBook(data);
					this.callfilterList = result;
				}
			}
			let start = (this.callRecords.pageIndex - 1) * PAGESIZE;
			let end = this.callRecords.pageIndex * PAGESIZE;
			this.callRecordsList = this.callfilterList.slice(start, end); //截取对应的联系人片段
			// 前端分页
			if (
				(this.callRecords.pageIndex - 1) * PAGESIZE <=
				this.callfilterList.length
			) {
				this.pagination(
					this.callRecords.pageIndex,
					PAGESIZE,
					this.callRecordsList
				);
			}
		},
		//获取客户池客户列表
		async getCustomerList(pageIndex) {
			const self = this;
			if (pageIndex == 1) {
				this.status = 'more';
			} else {
				if (this.status != 'more') {
					return false;
				}
				this.status = 'loading';
			}
			uni.showNavigationBarLoading();
			const data = this.customerListQuery;
			data.pageIndex = pageIndex;

			let result = (
				await CY19.GetFilteredCustomers({
					CustomerPoolMarketID: this.$storage.getAppUserInfo().marketerId,
					pagesize: PAGESIZE,
					pageIndex: pageIndex,
				})
			).result;
			if (pageIndex == 1) {
				self.customerListInfo = result.dataList;
				pageIndex++;
				data.pageIndex = pageIndex;
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
			} else {
				self.customerListInfo = self._.concat(
					self.customerListInfo,
					result.dataList
				);
				pageIndex++; //得到数据之后page+1
				data.pageIndex = pageIndex;
				self.status = 'more'; //将loadingType归0重置
				uni.hideNavigationBarLoading(); //关闭加载动画
			}
			if (result.rowCount == self.customerListInfo.length) {
				//没有数据
				self.status = 'noMore';
				uni.hideNavigationBarLoading(); //关闭加载动画
				return false;
			}
		},
		getMoreCustomerList() {
			const pageIndex = this.customerListQuery.pageIndex;
			this.getCustomerList(pageIndex);
		},
		// 新增客户
		addCustomer(item) {
			this.searchText ? this.gotoCustomer() : '';
			// let name = item.customerName === this.searchText ? '非客户' : item.customerName;
			let name = item.customerName || item.customSaveName;
			let phone = item.phone ? item.phone : this.searchText;
			// let customSaveName = item.customSaveName;
			uni.navigateTo({
				url: `/pages/_common/addCustomerInfo/addCustomerInfo?name=${name}&customerPhone=${phone}`,
			});
		},
		//获取历史搜索
		gotoCustomer() {
			const newArr = this.searchHistoryArr;
			// 看当前搜索关键词是否在历史记录中
			let index = newArr.findIndex((v) => v == this.searchText);
			if (index > -1) {
				// 在历史记录中，将其移到历史记录开头
				let delEle = newArr.splice(index, 1);
				newArr.unshift(...delEle);
			} else {
				// 否则追加当前关键词到开头
				newArr.unshift(this.searchText);
			}
			// 更新历史记录，截取到最大长度
			this.searchHistoryArr = newArr.slice(0, this.historyMaxLen);
			this.$storage.setSearchLocal(newArr);
		},
		// 清除历史搜索
		delHistory() {
			this.searchHistoryArr = [];
			this.$storage.removeSearchLocal();
		},
		//立即预订
		fastBook(item) {
			if (!this.$cw.todayScheduled()) {
				uni.showToast({
					title: '您没有开通预订台权限',
					icon: 'none',
				});
				return;
			}

			let obj = {
				customerID: item.customerID,
				bookerName: item.customerName && item.customerName != '非客户' ?
					item.customerName : '',
				bookerPhone: item.phone,
			};
			let param = util.urlEncode(obj).substring(1);
			// console.log(item, param);
			this.searchText ? this.gotoCustomer() : '';

			// 切换到预订tab下的卡片模式
			this.setReserveTab(0);
			// switchtab无法传参,存vuex中
			this.setBookerInfo(obj);
			uni.navigateTo({
				url: `/pages/homePageSub/reserve/reserve`
			});
		},
		// 跟踪消费记录
		followConsumeRecord(item) {
			console.log('跳转到跟踪消费记录页面');
			const url = `/pages/_common/customInfo/customInfo?customerId=${item.customerID}&tabIndex=1`;
			uni.navigateTo({
				url,
			});
		},
		// 点击搜索列表（如果fromBook为true 就返回到之前的今日预订的预订详情页面，否则跳转到客户详情页面）
		goCustomerHandle(item) {
			this.bnBookID = this.bnBookID ? this.bnBookID : '';
			this.bnDinnerType = this.bnDinnerType ? this.bnDinnerType : '';
			let obj = {
				bookID: this.bnBookID,
				customerID: item.customerID,
				bookerName: item.customerName && item.customerName != '非客户' ?
					item.customerName : '',
				bookerPhone: item.phone,
				company: item.companyName || item.company || '',
				companyID: item.companyID ? item.companyID : '',
				bookOn: this.bnBookOn,
				dinnerType: this.bnDinnerType,
				marketerId: item.customerMarketerID ? item.customerMarketerID : '',
				isSearch: 1,
			};
			// 有客户名称但没有电话和id
			if (!item.customerID && item.customerName && !item.phone) {
				obj.bookerName = '';
				obj.bookerPhone = item.customerName;
			}
			let param = util.urlEncode(obj).substring(1);
			if (this.fromBook) {
				uni.navigateBack({
					delta: 1,
				});
				getApp().globalData.searchObj = obj;
			} else {
				if (item.customerID) {
					uni.navigateTo({
						url: `/pages/_common/customInfo/customInfo?customerId=${item.customerID}`,
					});
				}
			}
		},
		// 获取客户图像
		getCustomerImg(img) {
			return img ?
				img :
				'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png';
		},
		// 获取客户等级图像
		getRankImg(img) {
			return img ? img : 'https://pic.cwyyt.cn/upload/yytApp/images/al.png';
		},
		updateSearchkeyword: util.debounce(function(e) {
			if (this.recordInfo.length >= 15) {
				this.searchCustomerInfo = [];
				return
			} else {
				this.searchCustomer();
			}
		}, 500),
		// 前端分页
		async pagination(pageNo, pageSize, array) {
			//array
			let resData = [];
			// 如果是app 传入截取的额通讯录数据 如果是h5直接cancat展示
			if (this.$cw.isApp(false)) {
				let result = await CY19.GetAddressBookInformation({
						cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID,
						customerData: array,
						getCallData: 1,
						getInfoType: 2,
					},
					null,
					null,
					false
				);
				let {
					userData
				} = result;
				resData = userData;
			} else {
				resData = array;
			}
			if (resData.length > 0) {
				this.callPhoneRecodeInfo = this.callPhoneRecodeInfo.concat(resData);
				this.callRecords.pageIndex++;
			}
		},
	},
	computed: {
		searchCustomerAndRecord() {
			let arr = this.recordInfo;
			let arr2 = this.searchCustomerInfo;
			// let arr2 = this._.uniqBy(arr, 'phone'); //去重留下联系人
			//去重合并属性（后一个可能有客户经理）
			const map2 = this._.keyBy(arr2, "phone");
			const r = this._(arr).map(m => this._.merge({}, m, map2[m.phone]))
				.concat(this._.differenceBy(arr2, arr, "phone"))
				.value();
			console.log(r)
			return r;
		},
		// 筛选后的获取通讯录信息 // 通讯录列表
		recordInfo() {
			if (!this.fromBook) { //只有预订台进来才获取通讯录
				return []
			}

			if (getApp().globalData.recordsData) {
				let recordData = getApp().globalData.recordsData;
				let str = this.searchText.replace(/\s*/g, '');
				return this._(recordData)
					.chain()
					.map((x, key) => ({
						phone: key,
						customerName: x,
						isRecord: 1,
					}))
					.filter(
						(x) =>
						x.phone.includes(str) ||
						x.customerName.includes(str)
					)
					.take(15)
					.value();
			} else {
				return [];
			}
		},
	},
	watch: {
		searchText: {
			handler(val, oldval) {
				this.updateSearchkeyword();
			},
		},
	},
};
