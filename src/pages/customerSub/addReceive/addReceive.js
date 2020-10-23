import CY18 from '@/service/CY/CY18AppService.js';
import CY61 from '@/service/CY/CY61AppService.js';
import CY69 from '@/service/CY/CY69AppService.js';
import util from '@/common/util.js';

const PAGESIZE = 200;

// vuex
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

export default {
	onNavigationBarButtonTap(val) {
		//存储客户id 和信息
		let selNum = this.customers.length;
		let unSelNum = 200 - this.customers.length;
		if (selNum > 200) {
			uni.showToast({
				title: `最多只能选择200个`,
				icon: 'none'
			});
		} else {
			console.log(this.customers);
			this.$storage.setCustomers(JSON.stringify(this.customers));
			uni.navigateBack({
				delta: 1
			});
		}
	},
	computed: {
		// 侧边栏vuex数据
		...mapState(['currentAddReceiveTagsObj']),
	},
	data() {
		return {
			picDomain: getApp().globalData.PicDomain,
			rowCount: 0, //总共多少条数据
			isNotShowFiveDay: false, //是否不显示5天内已发送过的
			receiveList: [], //页面显示数据
			isAllCheck: false, //是否全选
			customers: [], //选中的客户
			isPopupOpen: false, //弹窗状态
			isShowSidebar: false, // 默认不显示侧边栏
			isCheckAllCustomer: 1, //popup 所有客户和跟踪客户切换
			// tagDetails: [], //跟踪分类
			isTags: '', //跟踪分类list切换
			labelList: [], //标签列表
			marketerList: [{

			}], //筛选的客户经理列表
			pageData: {
				//请求数据
				isNotShowFiveDay: 0, //是否不显示5天内已发送过的
				screenType: 1, //类型.
				storeID: this.$storage.getAppUserInfo() ?
					this.$storage.getAppUserInfo().currentStoreId : '', //门店ID.
				cWCompanyId: this.$storage.getAppUserInfo() ?
					this.$storage.getAppUserInfo().cwCompanyID : '', //企业ID.
				marketerID: this.$storage.getAppUserInfo().marketerId, //客户经理id
				// trackiType: null, //跟踪类型.
				lable: [], //标签.
				nameOrPhone: '', //搜索框
				pageIndex: '', //页码.
				pageSize: '' ,//每页大小.
				days:5 // 排除的天数
				// month:""//月份默认为当前月 (可以不传).
			},
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: PAGESIZE // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			mescrollSingle: {}
		};
	},
	async onLoad(option) {
		////////////////////////////////?????
		//标签
		this.$storage.removeCurrentReceiveTagList();
		this.setCurrentAddReceiveTagsObj({
			content: '',
			ids: '',
		});
		// let data = {};
		// data.onlyGetName = 1;
		// data.onlyGetCustomer=1
		// let res = await CY69.GetAllStoreSettingTemplate(data);
		// if (res.length != 0) {
		// 	this.tagDetails = res.items;
		// }
		//获取刷选的客户经理列表
		let rdata = await CY18.GetCurrentStoreManager({
			storeId: this.pageData.storeID
		});
		rdata.managerList.map(v => {
			let n = v.marketerName.lastIndexOf('(');
			v.name = v.marketerName.substr(0, n);
		});
		this.marketerList = rdata.managerList;
	},
	onShow() {
		let that = this;
		//获取标签
		// let List = that.$storage.getAddCustomerTagList();
		// if (List != null) {
		// 	this.pageData.lable = List.map(item => item.customerLabelID);
		// 	this.labelList = List.map(item => item.label).join(',');
		// }
		// 初始化选中数据
		let customCache = JSON.parse(this.$storage.getCustomers());
		if (customCache) {
			this.customers = customCache;
			// // 判断是否是全选
			// var allSelected = this.customers.every((item) => item.checked);
			// console.log(allSelected);
			// this.isAllCheck = allSelected ? true : false;
		}
	},
	methods: {
		// 侧边栏筛选[标签]
		...mapMutations(['setCurrentAddReceiveTagsObj']),
		//打开有弹窗
		// openright() {
		// 	//打开popup
		// 	this.$refs.popup.open();
		// 	this.isPopupOpen = true;
		// },
		// 搜索收件人
		updateSearchkeyword: util.debounce(function(e) {
			const val = e.detail.value;
			this.pageData.nameOrPhone = val;
			this.getCustomerTrackiList(this.pageData);
			// this.refresh();
		}, 1000),
		// 显示抽屉
		showDrawer() {
			this.isShowSidebar = true;
			// this.isPopupOpen = true;
		},
		// 隐藏抽屉
		closeDrawer() {
			this.isShowSidebar = false;
		},
		//选择去除5天
		selFiveDay() {
			this.isNotShowFiveDay = this.isNotShowFiveDay == true ? false : true;
		},
		allCheck(e) {
			// 先更改状态，全选
			this.isAllCheck = !this.isAllCheck;

			if (this.customers.length >= 200 && this.isAllCheck) { // 所选大于200且当前准备全选
				this.$nextTick(() => {
					this.isAllCheck = false;
				})
				this.$cw.showError('最多只能选择200个');
				return;
			}

			// // 还可以选择的最大数量
			const shouldChecked = this.isAllCheck ? 200 - this.customers.length : this.customers.length;

			// 暂存 receiveList 中还能选中的
			const canSelectedArr = [];
			this.receiveList.forEach(v => {
				if (!v.checked) {
					canSelectedArr.push(v);
				}
			})
			// 按顺序选中剩下能选中的
			if (this.isAllCheck) {
				for (let i = 0, lenI = shouldChecked; i < lenI; i++) {
					const item = canSelectedArr[i];
					if (item) {
						item.checked = true;
						let filter = this.customers.find(v => v.phone == item.phone)
						if (!filter) this.customers.push(item);
					}
				}
			} else {
				this.receiveList.forEach(v => {
					v.checked = false;
				})
				this.customers = [];
			}
			// for (let i = 0, lenI = shouldChecked; i < lenI; ++i) {
			// 	const item = canSelectedArr[i];
			// 	if (this.isAllCheck) {
			// 		item.checked = true;
			// 		let filter = this.customers.find(v => v.phone == item.phone)
			// 		if (!filter) this.customers.push(item);
			// 	} else {
			// 		item.checked = false;
			// 		this.customers = [];
			// 	}
			// }

			//去重
			let arr = this.customers;
			// console.log(arr);
			this.customers = this._.uniqBy(arr, 'phone');
			// console.log(this.customers);
		},
		changeCheckbox(item) {
			let index = this._(this.customers).findIndex(
				x => x.customerID == item.customerID
			);
			if (index != -1) {
				item.checked = false;
				this.customers.splice(index, 1);
				let filter = this.receiveList.find(v => v.customerID == item.customerID);
				filter && (filter.checked = false);
			} else {
				item.checked = true;
				this.customers.push(item);
				let filter = this.receiveList.find(v => v.customerID == item.customerID);
				filter && (filter.checked = true);
			}
			// 判断是否是全选
			var allSelected = this.customers.length == this.receiveList.length;
			this.isAllCheck = allSelected ? true : false;
		},
		checkAllCustomer(n) {
			//跟踪客户和所有客户切换
			if (n == 1) {
				this.pageData.screenType = 1;
				this.isCheckAllCustomer = 1;
				this.isTags = '';
			} else {
				this.pageData.screenType = 2;
				this.isCheckAllCustomer = 0;
			}
		},
		// checkTags(n) {
		// 	//选择跟踪分类
		// 	this.isTags = n;
		// 	this.pageData.trackiType = n;
		// },
		//跳转标签页 pages/common/editCustomerLabel/editCustomerLabel
		goCustomerLabel() {
			uni.navigateTo({
				url: '/pages/_common/editCustomerLabel/editCustomerLabel?sidebar=addReceive'
			});
		},
		reSet() {
			//popup重置按钮
			// this.pageData.trackiType = null;
			// this.isCheckAllCustomer=1;
			this.pageData.isNotShowFiveDay = 0;
			this.pageData.marketerID = this.$storage.getAppUserInfo().marketerId;
			this.isNotShowFiveDay = false;
			this.isTags = '';
			this.pageData.lable = null;
			// this.labelList = [];
			this.pageData.lable = [];
			
			//清空vuex当前标签状态
			this.setCurrentAddReceiveTagsObj({
				content: '',
				ids: '',
			});
			this.$storage.setCurrentReceiveTagList([]);
			console.log(this.currentAddReceiveTagsObj);
			console.log(this.$storage.getCurrentReceiveTagList());
			// debugger
		},
		getPagedList() {
			//popup完成按钮
			// if (this.isCheckAllCustomer == 1) {
			// 	//跟踪类型
			// 	this.pageData.trackiType = null;
			// }
			this.pageData.isNotShowFiveDay = this.isNotShowFiveDay == true ? 1 : 0;
			this.getCustomerTrackiList(this.pageData);
			// this.$refs.popup.close();
			// this.isPopupOpen = false;
			this.isShowSidebar = false;
		},
		getCustomerTrackiList(data) {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			this.pageData.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.pageData.pageSize = PAGESIZE; // 页长, 默认每页10条

			let data = await CY61.GetCustomerTrackiList(this.pageData);
			// 接口返回的当前页数据列表 (数组)
			let curPageData = data.customerList;
			// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
			let totalPage = data.pageCount;
			// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
			let totalSize = data.rowCount;
			this.rowCount = data.rowCount;
			let Pindex = data.pageIndex; //当前页数
			// 接口返回的是否有下一页 (true/false)
			let hasNext = Pindex > totalPage ? true : false;

			//设置列表数据
			if (mescroll.num == 1) this.receiveList = []; // 如果是第一页需手动置空列表
			this.receiveList = this.receiveList.concat(curPageData); //追加新数据

			// 轮询选中数据
			this._(curPageData).forEach(item => {
				item.isTemp = false;
				item.isEdit = false;
				let cacheItem = this._(this.customers).find(
					x => x.customerID == item.customerID
				);
				// console.log(this.customers, item)
				if (cacheItem) {
					item.checked = true;
				}
			});

			// 判断是否是全选
			if (!this._.isEmpty(this.customers)) {
				let allSelected = this.receiveList.every((item) => item.checked);
				this.isAllCheck = allSelected ? true : false;
			}

			// 成功隐藏下拉加载状态
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			mescroll.endByPage(curPageData.length, totalPage);
			// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
			this.$nextTick(() => {
				mescroll.endSuccess(curPageData.length);
			});

		}
	},
	watch: {
		// 'pageData.nameOrPhone': {
		// 	handler: function(val, oldval) {
		// 		if (val || val == '') {
		// 			// this.upCallback(mescroll);
		// 			this.pageData.nameOrPhone = val;
		// 			this.getCustomerTrackiList(this.pageData);
		// 		}
		// 	}
		// }
		// --------------------- watch侧边栏筛选 -------------------
		currentAddReceiveTagsObj: {
			handler(val) {
				// 更新filterData数据,但不更新customerListQuery参数,要改变customerListQuery参数,得在侧边栏点击确认才行
				this.pageData.lable = val.ids === '' ? [] : val.ids.split(',');
				// this.customerListQuery.customerLabelIDList =
				// 	tags === '' ? [] : tags.split(','); // 数组
				// debugger
			},
			deep: true,
		},
	}
};
