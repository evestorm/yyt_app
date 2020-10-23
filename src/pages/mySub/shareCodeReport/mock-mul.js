let cardData = {
	"count": 2,
	"carditem": [{
			"id": "GK100107900000193", // 优惠券会员卡营销页的ID
			"name": "测试表单填写限制", // 优惠券会员卡营销页的Name
			"describe": null, // 优惠券会员卡营销页的描述.
			"time": "2020-03-13 16:13:02", // 优惠券会员卡营销页的时间.
			"visitCount": 11, // 访问量下载量.
			"conversionCount": 0, // 转化量.
			"conversionRatio": 0 // 转化率.
		},
		{
			"id": "GK105645500000191",
			"name": "2.25营销",
			"describe": "2月24日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例508例，新增死亡病例71例（湖北68例，山东2例，广东1例），新增疑似病例530例",
			"time": "2020-02-25 13:41:26",
			"visitCount": 21,
			"conversionCount": 0,
			"conversionRatio": 0
		}
	]
}

let generalData = {
	allMoney: 1000.00, // 总金额
	visitCount: 999, // 总访问
	orderCount: 233, // 总下单次数
	ratio: 10, // 转化率
}

let sendPeopleData = [{
	amount: 5846.59, // 总金额
	name: "全部", // 名称
	orderCount: 7777, // 下单量
	ratio: 200, // 转化率
	visitCount: 5980, // 访问量
}, {
	amount: 5303.85, // 总金额
	name: "圣斗士", // 名称
	orderCount: 1777, // 下单量
	ratio: 120, // 转化率
	visitCount: 6080, // 访问量
}]
let detailData = [{
	amount: 0, // 总金额
	dataTime: "2020-05-18 00:00:00", // 日期时间
	date: "05.18", // 日期
	orderCount: 0, // 下单量
	visitCount: 0, // 访问量
}]

export {
	cardData,
	generalData,
	sendPeopleData,
	detailData,
};
