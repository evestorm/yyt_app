const iconPrefix = 'https://pic.cwyyt.cn/';
// 首页顶部配置
const swMenuList = [{
		code: "m1",
		icon: iconPrefix + "upload/img/20191212/1733153315_xiansuoguanli.png",
		isOpen: "1",
		name: "宴会线索",
		sort: "1"
	},
	{
		code: "m2",
		icon: iconPrefix + "upload/img/20191212/1728282828_yanhuidingdan.png",
		isOpen: "1",
		name: "宴会订单",
		sort: "2"
	},
	{
		code: "m3",
		icon: iconPrefix + "upload/img/20191212/172503253_kehugenzong.png",
		isOpen: "1",
		name: "客户跟踪",
		sort: "3"
	},
	{
		code: "m4",
		icon: iconPrefix + "upload/img/20191212/1725592559_kehuliebiao.png",
		isOpen: "1",
		name: "客户列表",
		sort: "4"
	},
	{
		code: "m5",
		icon: iconPrefix + "upload/img/20191212/172801281_uploadcall.png",
		isOpen: "1",
		name: "上传通话",
		sort: "5"
	},
	{
		code: "m6",
		icon: iconPrefix + "upload/img/20191212/1727432743_message.png",
		isOpen: "1",
		name: "短信话术模板",
		sort: "6"
	},
	{
		code: "m7",
		icon: iconPrefix + "upload/img/20191212/1729172917_shezhigenzongqingdan.png",
		isOpen: "1",
		name: "设置跟踪清单",
		sort: "7"
	},
	{
		code: "m8",
		icon: iconPrefix + "upload/img/20191212/1728472847_shuaxingenzongjihui.png",
		isOpen: "1",
		name: "刷新跟踪机会",
		sort: "8"
	},
	{
		code: "m9",
		icon: iconPrefix + "upload/img/20191212/1727162716_wanchengmubiao.png",
		isOpen: "1",
		name: "完成目标",
		sort: "9"
	},
	{
		code: "m10",
		icon: iconPrefix + "upload/img/20191212/1748314831_pingjiachaxun.png",
		isOpen: "1",
		name: "评价查询",
		sort: "10"
	},
	{
		code: "m11",
		icon: iconPrefix + "upload/yyticons/1017131713_xietongzhongxin.png",
		isOpen: "1",
		name: "协同中心",
		operationParamJson: '{"notCompleteCount":0}',
		sort: "11"
	}
];

// 首页运营配置
const swOperateSettingsList = [{
		code: "o1",
		icon: iconPrefix + "upload/img/20191213/1413511351_customer.png",
		isOpen: "1",
		name: "客户",
		sort: "1"
	},
	{
		code: "o2",
		icon: iconPrefix + "upload/img/20191213/1414521452_customer-follow.png",
		isOpen: "1",
		name: "客户跟踪",
		sort: "2"
	},
	{
		code: "o3",
		icon: iconPrefix + "upload/img/20191213/1415351535_reserve.png",
		isOpen: "1",
		name: "预订",
		sort: "3"
	},
	{
		code: "o4",
		icon: iconPrefix + "upload/img/20191213/1416201620_the-banquet-clues.png",
		isOpen: "1",
		name: "宴会线索",
		sort: "4"
	},
	{
		code: "o5",
		icon: iconPrefix + "upload/img/20191213/141707177_the-party-to-perform.png",
		isOpen: "1",
		name: "宴会执行",
		sort: "5"
	},
	{
		code: "o6",
		icon: iconPrefix + "upload/img/20191213/1417461746_marketing.png",
		isOpen: "1",
		name: "营销模块",
		sort: "6"
	},
	{
		code: "o7",
		icon: iconPrefix + "upload/img/20191213/1418221822_evaluation.png",
		isOpen: "1",
		name: "评价",
		sort: "7"
	},
	{
		code: "o8",
		icon: iconPrefix + "upload/img/20191213/141909199_the-target-completion.png",
		isOpen: "1",
		name: "目标完成情况",
		sort: "8"
	},
	{
		code: "o9",
		icon: iconPrefix + "upload/img/20191213/1419481948_members.png",
		isOpen: "1",
		name: "会员",
		sort: "9"
	}
];

const swOperate = { // 运营概况数据
	customerData: {
		cstTotalCount: 0, // 总客户
		cstTotalLastMonthAcitvePercent: 0.0, // 总客户上月活动率
		cstMyCount: 0, // 我的客户
		cstMyLastMonthAcitvePercent: 0.0, // 我的客户上月活动率
		cstPoolMyCount: 0, // 客户池我的客户
		cstPoolMyLastMonthAcitvePercent: 0.0, // 客户池我的客户上月活动率
		cstPoolTotalCount: 0, // 客户池总客户
		cstPoolTotalLastMonthAcitvePercent: 0.0, // 客户池总客户上月活动率
		sort: 0,
	}, // 存储客户数据
	customerFollowData: {
		needFollowCount: 0, // 待跟踪数量
		followedCount: 0, // 已跟踪数量
		totalFollowCount: 0, // 总跟踪数量
		allNeedFollowCount: 0, // 全部待跟踪数量
		allFollowedCount: 0, // 全部已跟踪数量
		allTotalFollowCount: 0, // 全部总跟踪数量
		sort: 0,
	}, // 客户跟踪数据
	bookData: {
		todayCstTableCount: 0, // 今日客户桌数
		todayCstAmount: 0.0, // 今日客户金额
		todayBanquetTableCount: 0, // 今日宴会桌数
		todayBanquetAmount: 0.0, // 今日宴会金额

		yesterdayCstTableCount: 0, // 昨日客户桌数
		yesterdayCstAmount: 0.0, // 昨日客户金额
		yesterdayBanquetTableCount: 0, // 昨日宴会桌数
		yesterdayBanquetAmount: 0.0, // 昨日宴会金额

		withinMonthCstTableCount: 0, // 一个月内客户桌数
		withinMonthCstAmount: 0.00, // 一个月内客户金额
		withinMonthBanquetTableCount: 0, // 一个月内宴会桌数
		withinMonthBanquetAmount: 0.00, // 一个月内宴会金额



		allTodayCstTableCount: 0, // 全部今日客户桌数
		allTodayCstAmount: 0.0, // 全部今日客户金额
		allTodayBanquetTableCount: 0, // 全部今日宴会桌数
		allTodayBanquetAmount: 0.0, // 全部今日宴会金额

		allYesterdayCstTableCount: 0, // 全部昨日客户桌数
		allYesterdayCstAmount: 0.00, // 全部昨日客户金额
		allYesterdayBanquetTableCount: 0, // 全部昨日宴会桌数
		allYesterdayBanquetAmount: 0.00, // 全部昨日宴会金额

		allWithinMonthCstTableCount: 0, // 全部一个月内客户桌数
		allWithinMonthCstAmount: 0.00, // 全部一个月内客户金额
		allWithinMonthBanquetTableCount: 0, // 全部一个月内宴会桌数
		allWithinMonthBanquetAmount: 0.00, // 全部一个月内宴会金额

		sort: 0
	}, // 预订数据
	banquetCluesData: {
		levelHighCount: 0, // 线索成交率高数量
		levelMediumCount: 0, // 线索成交率中数量
		leveLowCount: 0, // 线索成交率低数量
		tradedCount: 0, // 线索已成交数量
		needHandleCount: 0, // 待跟进数量
		allLevelHighCount: 0, // 全部线索成交率高数量
		allLevelMediumCount: 0, // 全部线索成交率中数量
		allLeveLowCount: 0, // 全部线索成交率低数量
		allTradedCount: 0, // 全部线索已成交数量
		allNeedHandleCount: 0, // 全部待跟进数量
	}, // 宴会线索
	targetCompletionData: {
		targetTotalCount: 0, // UI显示(个人):总目标 / 接口文档:总目标
		allTargetTotalCount: 0, // 接口文档:全部总目标(没用到)
		targetCompletionCount: 0, // UI显示(个人):已完成目标 / 接口文档:已完成人数
		allTargetCompletionCount: 0, // UI显示(全部):已完成人数 / 接口文档:全部已完成人数
	}, // 目标完成情况
};

export {
	swMenuList,
	swOperateSettingsList,
	swOperate
}
