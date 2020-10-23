const result = {
	buUnitGUID: "STR00000041",
	companyCustomerLabelID: "CY593311300000230",
	createTime: "2019-12-24 18:18:11",
	cwCompanyId: "UR0700000012",
	dynamicConditionConfigID: "CY782692900000073",
	editJsonString: `[{
"code": "CRC001",
"condition": "近i1个月桌均s2m3",
"conditionName": "近几月新预订",
"order": 1,
"sql": "SELECT t.CstId FROM (SELECT CY20002 as CstId,AVG(CY20014) AS Total FROM dbo.CY20 WHERE CY20018='{0}' AND CY20005 BETWEEN DATEADD(MONTH,-{1},GETDATE()) AND GETDATE() AND CY20020 IN (2,3,4) GROUP BY CY20002) t WHERE t.Total{2}{3}",
"type": 0,
"fields": [{
	"fieldName": "近几月",
	"fieldType": "int",
	"fieldKey": "i1",
	"ajaxOpt": null,
	"fieldDefaultValue": null,
	"fieldValue": "1"
}, {
	"fieldName": "条件",
	"fieldType": "select",
	"fieldKey": "s2",
	"ajaxOpt": null,
	"fieldDefaultValue": ["大于", "小于", "等于"],
	"fieldValue": "小于"
}, {
	"fieldName": "金额",
	"fieldType": "money",
	"fieldKey": "m3",
	"ajaxOpt": null,
	"fieldDefaultValue": null,
	"fieldValue": "1"
}],
"id": "kb7i78c1"
}]`,
	fromInitLabelCode: "CY593311300000230",
	isAutoRefresh: 0,
	isDeleted: 0,
	isShowPhone: 1,
	label: "周二",
	sort: null,
	storeId: "STR00000041",
	tagTypeName: "常用标签",
	tagTypes: "GK250654500000054",
	tagTypesID: "GK250654500000054",
	tenantId: "UR0700000012",
	userCount: 8,
}; // 注释

export default {
	result,
}
