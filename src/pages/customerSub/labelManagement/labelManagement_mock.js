const labelGroups = [{
	tagTypesID: 1,
	tagTypeName: '常用标签',
	labelList: [{
		companyCustomerLabelID: 1,
		label: '会员客户',
		isAutoRefresh: 1,
	},{
		companyCustomerLabelID: 2,
		label: '高消费客户',
		isAutoRefresh: 0,
	}]
},{
	tagTypesID: 2,
	tagTypeName: '消费标签',
	labelList: [{
		companyCustomerLabelID: 1,
		label: '高频消费客户',
		isAutoRefresh: 0,
	},{
		companyCustomerLabelID: 2,
		label: '近半年消费5W',
		isAutoRefresh: 1,
	}]
}]; // 标签组

export default {
    labelGroups,
}

