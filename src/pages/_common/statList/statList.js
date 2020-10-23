// 作者:杨亮

//------------------------------mock数据引入---------------------------
import statListMock from './statList_mock.js';

//------------------------------组件引入-------------------------------


//-------------------------Service引入----------------------------------
import CY17 from '@/service/CY/CY17AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入

// 常量
let PageConstData = {
    // 缓存数据
    cacheData: {
       // userInfo: storage.getUserInfo()
    },
    // 页面常量
	groupEnum: {
		monthStat: '月统计',
		sourceAnalysis: '客源分析',
		transReport: '转化报表',
		bookReport: '预订报表',
		cluesReport: '线索报表',
		banquetReport: '宴会报表',
		taskReport: '任务报表',
		banquetBoard: '宴会看板',
		marketingAnalyze: '营销页数据分析',
		memberCardAnalyze: '会员卡数据分析',
		couponsAnalyze: '优惠券数据分析',
		mallAnalyze: '商城数据分析',
		targetCompl: '目标完成情况',
	}
}

export default {
    // 组件放在data前面
    components: {
        
    },
    data() {
        return {
            //---------------------常量------------------------
            PageConstData,

            // --------------------------------------页面参数---------------------------
            urlOption: {}, // url参数
			
			groupList: [
				{
					name: '',
					group: [{
						key: [PageConstData.groupEnum.monthStat],
						value: PageConstData.groupEnum.monthStat,
						isShow: true,
					}]
				},
				{
					name: '客户', 
					group: [
					// 	{
					// 	key: [PageConstData.groupEnum.sourceAnalysis],
					// 	value: PageConstData.groupEnum.sourceAnalysis,
					// },
					{
						key: [PageConstData.groupEnum.transReport],
						value: PageConstData.groupEnum.transReport,
						isShow: this.$cw.canSeeCustomerList() || this.$cw.canSeeTrack(), // 客户列表,客户跟踪两者其一,就能看
					}]
				}, {
					name: '订单统计',
					group: [{
						key: [PageConstData.groupEnum.bookReport],
						value: PageConstData.groupEnum.bookReport,
						isShow: this.$cw.todayScheduled(), // 预订单列表查看权限
					}]
				}, {
					name: '宴会统计',
					group: [{
						key: [PageConstData.groupEnum.cluesReport],
						value: PageConstData.groupEnum.cluesReport,
						isShow: this.$cw.canSeeYHClue(), // 宴会线索查看权限
					}, {
						key: [PageConstData.groupEnum.banquetReport],
						value: PageConstData.groupEnum.banquetReport, 
						isShow: this.$cw.canSeeYHBanquetOrder(), // 宴会订单查看权限
					}, {
						key: [PageConstData.groupEnum.taskReport],
						value: PageConstData.groupEnum.taskReport,
						isShow: this.$cw.canSeeYHBanquetOrder(), // 宴会订单查看权限
					}, {
						key: [PageConstData.groupEnum.banquetBoard],
						value: PageConstData.groupEnum.banquetBoard,
						isShow: this.$cw.canSeeYHBanquetOrder(), // 宴会订单查看权限
					}]
				}, {
					name: '营销',
					group: [{
						key: [PageConstData.groupEnum.marketingAnalyze],
						value: PageConstData.groupEnum.marketingAnalyze,
						isShow: this.$cw.canSeeMarketingCenter(), // 营销中心查看权限
					}, {
						key: [PageConstData.groupEnum.memberCardAnalyze],
						value: PageConstData.groupEnum.memberCardAnalyze,
						isShow: this.$cw.canSeeMarketingCenter(), // 营销中心查看权限
					}, {
						key: [PageConstData.groupEnum.couponsAnalyze],
						value: PageConstData.groupEnum.couponsAnalyze,
						isShow: this.$cw.canSeeMarketingCenter(), // 营销中心查看权限
					}, {
						key: [PageConstData.groupEnum.mallAnalyze],
						value: PageConstData.groupEnum.mallAnalyze,
						isShow: this.$cw.canSeeMarketingCenter(), // 营销中心查看权限
					}]
				}, {
					name: '目标',
					group: [{
						key: [PageConstData.groupEnum.targetCompl],
						value: PageConstData.groupEnum.targetCompl,
						isShow: true,
					}]
				}
			]
        };
    },
    // 页面加载事件
    async onLoad(options) {
        this.urlOption = options;
    },
    methods: {
		itemNavigateTo(item) {
			let obj = {
				[PageConstData.groupEnum.monthStat]: () => {
					uni.navigateTo({
						url: '/pages/homePageSub/monthSummary/monthSummary' // 月统计
					})
				},
				[PageConstData.groupEnum.sourceAnalysis]: () => {
					uni.navigateTo({
						url: '' // 客源分析(暂无)
					})
				},
				[PageConstData.groupEnum.transReport]: () => {
					uni.navigateTo({
						url: '/pages/homePageSub/bookReport/bookReport?activeIdx=1' // 转化报表
					});
				},
				[PageConstData.groupEnum.bookReport]: () => {
					uni.navigateTo({
						url: '/pages/homePageSub/bookReport/bookReport?activeIdx=0' // 预订报表
					});
				},
				[PageConstData.groupEnum.cluesReport]: () => {
					uni.navigateTo({
						url: '/pages/banquetSub/orderReport/orderReport' // 线索报表
					})
				},
				[PageConstData.groupEnum.banquetReport]: () => {
					uni.navigateTo({
						url: '/pages/banquetSub/banquetReport/banquetReport' // 宴会报表
					})
				},
				[PageConstData.groupEnum.taskReport]: () => {
					uni.navigateTo({
						url: '/pages/banquetSub/taskReport/taskReport' // 任务报表
					})
				},
				[PageConstData.groupEnum.banquetBoard]: () => {
					uni.navigateTo({
						url: '/pages/banquetSub/banquetPlan/banquetPlan' // 宴会看板
					})
				},
				[PageConstData.groupEnum.marketingAnalyze]: () => {
					uni.navigateTo({
						url: '/pages/mySub/shareCodeReport/shareCodeReport?idx=0' // 营销页数据分析（分享码数据）
					})
				},
				[PageConstData.groupEnum.memberCardAnalyze]: () => {
					uni.navigateTo({
						url: '/pages/mySub/shareCodeReport/shareCodeReport?idx=1' // 会员卡数据分析（分享码数据）
					})
				},
				[PageConstData.groupEnum.couponsAnalyze]: () => {
					uni.navigateTo({
						url: '/pages/mySub/shareCodeReport/shareCodeReport?idx=2' // 宴会券数据分析（分享码数据）
					})
				},
				[PageConstData.groupEnum.mallAnalyze]: () => {
					uni.navigateTo({
						url: '/pages/mySub/shareCodeReport/shareCodeReport?idx=3' // 商城数据分析（分享码数据）
					})
				},
				[PageConstData.groupEnum.targetCompl]: () => {
					uni.navigateTo({
						url: '/pages/homePageSub/saleTarget/saleTarget' // 目标完成情况
					})
				},
			}
			
			return obj[item.value]();
		}
    },
    computed: {
		// 列表权限控制
		calcGroupList() {
			return this.groupList.map((v, idx) => {
				// 显示有权限查看的列表
				v.group = v.group.filter(item => item.isShow);
				// 当前板块中列表为空，不显示板块名
				v.name = v.group.length > 0 ? v.name : '';
				return v;
			});
		}
    },
    filters: {
        // parseScene(value) {
        // return value+'123';
        // }
    },
    watch: {
        // 监控查询条件的变化 自动请求数据
        //'calcGetStudentListIn': {
        //    handler(val, oldval) {
        //        if (this.$util.isChgForWatch(val, oldval, ['pageIndex', 'sarchValue'])) {
        //            this.getPageList();
        //        }
        //    },
        //    deep: true,
        //    immediate: true,
        //}
    }
};
