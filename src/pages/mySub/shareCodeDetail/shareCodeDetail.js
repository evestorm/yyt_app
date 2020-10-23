// 作者:覃彬
import GK12 from '@/service/GK/GK12AppService.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			queryData: { //请求分享码详情参数
				id: "", //会员卡营销员会员卡ID
				type: 1, //类型(1.营销页,2.会员卡,3.优惠券)
				dateType: 1, //日期类型(1.今日,2.近七日,3.近30日,4.自定义).
				startTime: "", //开始日期.
				endTime: "" //结束日期.
			},
			pageDetail: {
				totalData: {
					conversionAmount:0
				}, //访问头部总数据
			}, //获取的页面详情
			dateRange: { //picker组件选择时间范围
				startDate: this.$moment().subtract(10, 'years').format('YYYY'), //开始时间
				endDate: this.$moment().add(10, 'years').format('YYYY'), //结束时间
				defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
					.split('-')
				]
			},
			titleList: ['客户经理', '分享阅读', '转化率'], //客户经理表头
			tableDataList: [], //客户经理表数据
			detailDataTitle: ['日期', '新增访问', '新增转化'], //底部详细数据详情表头
			detailData: [], //底部详细数据详情内容
		};
	},
	// 页面加载事件
	onLoad(option) {
		//接收会员卡营销员会员卡ID 和类型(1.营销页,2.会员卡,3.优惠券),标题
		this.queryData.id = option.id;
		this.queryData.type = option.type;
		this.pageDetail.title = option.title;
	},
	methods: {
		// 获取分享码任务详情
		async getDetail() {
			let result = await GK12.GetDetailedDataOfSharing(this.queryData);
			if (result) {
				this.pageDetail.totalData = result.totalData;
				//tab组件数据
				this.titleList = result.marketData.typeName;
				this.tableDataList = result.marketData.markerData;
				this.detailDataTitle = result.dateData.dateName;
				this.detailData = result.dateData.dateListData;
			}
		},
		changeDateType(e, item) { //更换请求的时间类型
			// console.log(item)
			this.queryData.dateType = item.value + 1;
		},
		selectDate(e, item) {
			// console.log(item);

		},
		onConfirmDateRange(val) { //确认选择时间范围
			this.queryData.dateType = 4;
			this.queryData.startTime = `${val.from} 00:00:00`;
			this.queryData.endTime = `${val.to} 00:00:00`;
		},
	},
	computed: {
		topIcon() {
			switch (+this.queryData.type) {
				case 1:
					uni.setNavigationBarTitle({
						title: '营销页数据'
					})
					return 'https://pic.cwyyt.cn/upload/yyticons/100510510_文章@2x.png'
					break;
				case 2:
					uni.setNavigationBarTitle({
						title: '会员数据'
					})
					return 'https://pic.cwyyt.cn/upload/yyticons/161208128_会员卡@2x.png'
					break;
				case 3:
					uni.setNavigationBarTitle({
						title: '优惠券数据'
					})
					return 'https://pic.cwyyt.cn/upload/yyticons/1611221122_优惠券@2x.png'
					break;
				default:
					break;
			}
		},
		calcqQueryData(){
			return this._.cloneDeep(this.queryData);
		}
	},
	filters: {},
	watch: {
		"calcqQueryData": {
			handler: function(val, oldval) {
				if (this.$util.isChgForWatch(val, oldval, ['dateType','startTime', 'endTime'])) {
					this.getDetail();
				}
			},
			deep: true,
			immediate: true
		}
	}
	// ## 方法
};
