// 作者:覃彬

//------------------------------mock数据引入---------------------------
import marketingMock from './marketing_mock.js';

//------------------------------组件引入-------------------------------
import topSumdata from './top-sumdata/top-sumdata.vue';
import newCampaign from './new-campaign/new-campaign.vue';
import newOrder from './new-order/new-order.vue';
import myCard from './my-card/my-card.vue';


//-------------------------Service引入----------------------------------
import GK10 from '@/service/GK/GK10AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入

// 常量
let PageConstData = {}

export default {
	// 组件放在data前面
	components: {
		topSumdata, // 顶部汇总数据
		newCampaign, // 近期活动
		newOrder, // 最新订单
		myCard, // 我的名片
	},
	data() {
		return {
			//---------------------接口输入输出 接口名称+in/out 命名 列如接口名称是getStudentList----------------------
			//获取营销中心数据
			getMarketingCenterDataIn: {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id 
				cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID, //企业ID
				marketId: this.$storage.getAppUserInfo().marketerId, //客服经理id
				dateType: 4, //日期类型(1.今日,2.昨日,3.本周,4.本月 5自定义).
			},
			getMarketingCenterDataOut: {},
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.getMarketingCenterData(); //获取页面展示数据
	},
	onShow() {
		this.getMarketingCenterDataIn.storeId = this.$storage.getAppUserInfo().currentStoreId; //监听门店变化
	},

	onPullDownRefresh() { //页面下拉事件
		this.getMarketingCenterData();
	},
	methods: {
		//顶部全店/我的选择按钮
		isGetAll(val) {
			this.getMarketingCenterDataIn.marketId = val ? '' : this.$storage.getAppUserInfo().marketerId;
		},
		//获取营销中心数据
		async getMarketingCenterData() {
			let res = await GK10.GetMarketingCenterData(this.getMarketingCenterDataIn);
			this.getMarketingCenterDataOut = res;
			uni.stopPullDownRefresh();
		},
	},
	computed: {
		topSumData() { //顶部数据
			let obj = this._.cloneDeep(this.getMarketingCenterDataOut);
			let obj1 = {
				performance: obj.performance || 0,
				visitCount: obj.visitCount || 0,
				visitPeople: obj.visitPeople || 0
			}
			return obj1;
		},
		campaignData() { //近期活动
			let obj = this._.cloneDeep(this.getMarketingCenterDataOut);
			return obj.activities && obj.activities.dataList;
		},
		orderDetails() { //近期订单
			let obj = this._.cloneDeep(this.getMarketingCenterDataOut);
			return obj.orderDetails && obj.orderDetails.dataList;
		},
		calcGetMarketingCenterDataIn() { //监听请求参数
			return this._.cloneDeep(this.getMarketingCenterDataIn);
		}
	},
	filters: {},
	watch: {
		// 监控查询条件的变化
		'calcGetMarketingCenterDataIn': {
			handler(val, oldval) {
				if (this.$util.isChgForWatch(val, oldval, ['marketId', 'storeId'])) { //更换门店，我的/全店
					this.getMarketingCenterData();
				}
			},
			deep: true,
		},

	}
};
