import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import storage from '@/common/unistorage/index.js';
import cw from '@/common/ceiwei/common.js';
import CY19 from '@/service/CY/CY19AppService.js';

const app = getApp();
// 后端根据电话号码查的数据,返回的应该也是个数组,每个就是客户信息,需要本地添加
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			dataList: [], //页面展示的数据
			allCallData: [], //通讯录获取的所有数据
			pageIndex: 1, //通话记录分页页码
			down: {
				use: false
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			mescrollSingle: {}, //
		}
	},
	components: {
		uniSearchBar,
	},
	mounted() {
		uni.$on('addContactsFromCallRecords', () => {
			// this.getCallRecords();
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		});
		// this.getCallRecords();
	},
	methods: {
		// 搜索
		handleSearch(e) {
			// console.log(e);
		},
		// 获取客户等级
		getCustomLevelImgUrl(customerLevelImgUrl) {
			if (customerLevelImgUrl) {
				return cw.ImgServerUrl + customerLevelImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/level_D.png"
			}
		},
		async getCallRecords() {
			// customerLevelImgUrl: '',
			// id: 123
			// callType: 1呼入 2呼出 4未接
			if (cw.isApp(true)) {

				// const dataList = [{
				// 	phone: '18771105312', // 电话
				// 	beginTime: '2020-02-02 14:20:20', // 开始通话时间
				// 	callType: 2, // 1. 呼入 2. 呼出
				// 	talkTime: 12, // 通话时长，0表示未接通
				// 	customSaveName: '黎明1', // 客户姓名
				// },{
				// 	phone: '15857122573', // 电话
				// 	beginTime: '2020-02-02 14:01:20', // 开始通话时间
				// 	callType: 2, // 1. 呼入 2. 呼出
				// 	talkTime: 23, // 通话时长，0表示未接通
				// 	customSaveName: 'Jerry2', // 客户姓名
				// },{
				// 	phone: '18771105312', // 电话
				// 	beginTime: '2020-02-02 11:05:20', // 开始通话时间
				// 	callType: 1, // 1. 呼入 2. 呼出
				// 	talkTime: 0, // 通话时长，0表示未接通
				// 	customSaveName: '黎明3', // 客户姓名
				// },{
				// 	phone: '15857122573', // 电话
				// 	beginTime: '2020-02-02 09:23:20', // 开始通话时间
				// 	callType: 1, // 1. 呼入 2. 呼出
				// 	talkTime: 0, // 通话时长，0表示未接通
				// 	customSaveName: '', // 客户姓名
				// }, {
				// 	phone: '18771105312', // 电话
				// 	beginTime: '2020-02-01 19:09:10', // 开始通话时间
				// 	callType: 1, // 1. 呼入 2. 呼出
				// 	talkTime: 17, // 通话时长，0表示未接通
				// 	customSaveName: '黎明5', // 客户姓名
				// }, {
				// 	phone: '15857122573', // 电话
				// 	beginTime: '2020-01-30 12:01:10', // 开始通话时间
				// 	callType: 1, // 1. 呼入 2. 呼出
				// 	talkTime: 17, // 通话时长，0表示未接通
				// 	customSaveName: '', // 客户姓名
				// }, {
				// 	phone: '13877223342',
				// 	beginTime: '2020-01-10 12:01:10',
				// 	callType: 2, // 1. 呼入 2. 呼出
				// 	talkTime: 24, // 通话时长，0表示未接通
				// 	customSaveName: '不是用户但有通讯录名称7', // 客户姓名
				// }, {
				// 	phone: '13877223342',
				// 	beginTime: '2020-01-10 12:01:10',
				// 	callType: 1, // 1. 呼入 2. 呼出
				// 	talkTime: 0, // 通话时长，0表示未接通
				// 	customSaveName: '未接来电8', // 客户姓名
				// }, {
				// 	phone: '13877223342',
				// 	beginTime: '2020-01-10 12:01:10',
				// 	callType: 2, // 1. 呼入 2. 呼出
				// 	talkTime: 0, // 通话时长，0表示未接通
				// 	customSaveName: '打出去没人接9', // 客户姓名
				// }];

				// yyyy-MM-dd HH:mm:ss
				let beginDate = this.$moment(new Date()).subtract(2, 'months').format('YYYY-MM-DD HH:mm:ss');
				let dataList = this.$cw.getPhoneCallResult(beginDate);
				// if (dataList.includes('error')) {
				// 	setTimeout(() => {
				// 		dataList = this.$cw.getPhoneCallResult(beginDate);
				// 		this.allCallData = JSON.parse(dataList);
				// 	}, 1000)
				// } else {
					this.allCallData = JSON.parse(dataList);
				// }
			}
		},
		// 去客户详情
		gotoCustomerDetail(user) {
			if (user.customerID) {
				uni.navigateTo({
					url: `/pages/_common/customInfo/customInfo?customerId=${user.customerID}`
				});
			}
		},
		// 发短信
		gotoSendMsg(ct) {
			// msgName:尊称 customerName:客户名称 customSaveName:通讯录联系人名称 isClue: 1 线索 2 通讯录 其他为客户
			if (ct.msgName == null) {
				ct.msgName = '';
			}
			if (ct.customerName == null) {
				ct.customerName = '';
			}
			if (ct.customSaveName == null) {
				ct.customSaveName = '';
			}
			let url =
				`/pages/customerSub/sendMsg/sendMsg?customerID=${ct.customerID}&customerName=${ct.customerName}&phone=${ct.phone}&msgName=${ct.msgName}&customSaveName=${ct.customSaveName}&isClue=2`;
			uni.navigateTo({
				url,
			});
		},
		// 去打电话
		gotoCallPhone(phone) {
			if (cw.isApp(true)) {
				cw.callPhone(phone,0)
			}
		},
		// 添加客户
		addCustomer(user) {
			if (!user.customSaveName) {
				user.customSaveName = '';
			}
			uni.navigateTo({
				url: `/pages/_common/addCustomerInfo/addCustomerInfo?customerName=${user.customSaveName}&customerPhone=${user.phone}`
			});
		},

		/*上拉加载的回调*/
		async upCallback(mescroll) {
			this.mescrollSingle = mescroll;
			// 此时mescroll会携带page的参数:
			this.pageIndex = mescroll.num; // 页码, 默认从1开始
			if (this.pageIndex == 1) {
				this.getCallRecords();
			}
			let start = (this.pageIndex - 1) * mescroll.size;
			let end = this.pageIndex * mescroll.size;
			let arry = this.allCallData.slice(start, end); //截取对应的联系人片段 
			let data = await CY19.GetAddressBookInformation({
				cWCompanyID: storage.getAppUserInfo().cwCompanyID,
				customerData: arry,
				getInfoType: 2
			});
			// 接口返回的当前页数据列表 (数组)
			let curPageData = data.userData;
			curPageData = this.$util.null2str(curPageData);
			// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
			let totalPage = data.pageCount;
			// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
			let totalSize = data.rowCount;
			this.pageNum = data.rowCount;
			let Pindex = data.pageIndex; //当前页数
			// 接口返回的是否有下一页 (true/false)
			let hasNext = Pindex > totalPage ? true : false

			//设置列表数据
			if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
			this.dataList = this.dataList.concat(curPageData); //追加新数据

			// 成功隐藏下拉加载状态
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			mescroll.endByPage(curPageData.length, totalPage);
			// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
			this.$nextTick(() => {
				mescroll.endSuccess(curPageData.length)
			})
		},
	}
}
