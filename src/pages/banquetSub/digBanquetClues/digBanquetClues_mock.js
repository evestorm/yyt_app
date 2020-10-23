const pageList = {
	chanceDataGUID: '', // 全选数据集合标识
	pagedResult: {
		pageCount: 1,
		pageIndex: 1,
		pageSize: 10,
		rowCount: 1,
		dataList: [{
			bookOrderID: '1', // 预订id
			customerName: '李明明',
			phone: '15857122899',
			expectOn: '2020-05-28 00:00:00', // 目标日期(机会的时间)
			bookOn: '2020-05-28 00:00:00', // 预订日期(上一次的订单时间)
			name: '婚宴', // 预订类型名称
			remark: '结婚周年', // 备注（机会时间右边的文字）
			bookTableNum: '18', // 桌数
			fee: '15223.20', // 消费金额 | formatMoney
			isAdded: '', // 是否已添加
		}] // 列表
	}
}


export default {
	pageList,
}
