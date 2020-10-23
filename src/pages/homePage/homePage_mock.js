// 使用 Mock
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;

const reserve = { // 预订
	overview: [{
		title: '总收入',
		num: 210050.10,
	}, {
		title: '总桌数',
		num: 60,
	}, {
		title: '总人数',
		num: 300,
	}],
	data: [{ // 饼图
			name: "客户",
			proportion: 53,
			value: 16,
			color: Random.color()
		},
		{
			name: "宴会",
			proportion: 33,
			value: 10,
			color: Random.color(),
		},
		{
			name: "散客",
			proportion: 6,
			value: 2,
			color: Random.color(),
		},
	]
};

const customer = { // 客户
	overview: [{
		title: '总客户',
		num: 2400,
	}, {
		title: '价值客户',
		num: 300,
	}],
	data: [{ // 饼图
			name: "A",
			proportion: 20,
			value: 20000,
			color: Random.color()
		},
		{
			name: "B",
			proportion: 30,
			value: 30000,
			color: Random.color(),
		},
		{
			name: "C",
			proportion: 50,
			value: 50000,
			color: Random.color(),
		},
	]
};

const banquet = { // 宴会
	overview: [{
		title: '本月待办',
		num: 30,
	}, {
		title: '本月新增',
		num: 10,
	}],
	data: [{
		typeID: 1,
		typeName: '生日宴',
		typeCount: 30
	}, {
		typeID: 2,
		typeName: '升学宴',
		typeCount: 180
	}, {
		typeID: 3,
		typeName: '婚宴',
		typeCount: 200
	}]
};

const marketing = { // 营销
	overview: [{
		title: '营销业绩',
		num: 20050.10,
	}],
	data: [{
		title: '访问次数',
		num: 2400,
	}, {
		title: '访问人数',
		num: 300,
	}]
}

export default {
	reserve,
	customer,
	banquet,
	marketing
}
