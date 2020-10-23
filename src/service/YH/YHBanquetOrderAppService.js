import app from '@/common/request.js'

// 获取宴会筛选线索
let GetBanquetScreen = async (data, success, fail, isShowLoading = false) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetScreen',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
//获取宴会信息列表/GetBanquetOrder
let GetBanquetOrder = async (data, success, fail, isShowLoading = true) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
// 获取宴会单详情
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
};

// 获取宴会执行详情
let GetBanquetExectorDetail = async (data, success, fail, isShowLoading = true) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetExectorDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 创建宴会单
let CreateByDto = async (data, success, fail, isShowLoading = true) => {
	
	return await app.Request({
			url: '/api/services/app/YHBanquetOrder/CreateByDto',
			data: data,
			isObj: true,
			isShowLoading: isShowLoading,
			abpSuccess: success,
			abpFail: fail
		})
}

// 更新宴会单
let UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
			url: '/api/services/app/YHBanquetOrder/UpdateByDto',
			data: data,
			isObj: true,
			isShowLoading: isShowLoading,
			abpSuccess: success,
			abpFail: fail
		})
}

// 获取宴会类型
let GetBanquetFOrderType = async (data, success, fail, isShowLoading = true, url) => {
return await app.Request({
		url: '/api/services/app/CY26/GetViewPageSelect',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取套餐信息
let GetbanquetPackage = async (data, success, fail, isShowLoading = true) => {
		return await UseFunction(data, success, fail, isShowLoading, '/api/services/app/YHBanquetPackage/GetViewPageSelect');
};

let UseFunction = async (data, success, fail, isShowLoading = true, url) => {
	return await app.Request({
		url: url,
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}
//创建宴会执行
let CreateBanquetExectue = async (data, success, fail, isShowLoading = true) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/CreateBanquetExectue',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取小程序分享背景图片地址
const GetSmallShareBgUrl = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetSmallShareBgUrl',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

// 获取宴会数据报表
const GetBanquetDataReport = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetDataReport',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 获取宴会月汇总统计
const GetOrderMonthSummaryStat = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetOrderMonthSummaryStat',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 获取宴会单统计
const GetBanquetOrderStat = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/GetBanquetOrderStat',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 更换宴会执行人
const ChangeYHTaskExecutor = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetOrder/ChangeYHTaskExecutor',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

export default {
	GetBanquetScreen,
	GetBanquetOrder,
	GetViewDto,
	GetBanquetExectorDetail,
	CreateByDto,
	UpdateByDto,
	GetBanquetFOrderType,
	GetbanquetPackage,
	CreateBanquetExectue,
	GetSmallShareBgUrl,
	GetBanquetDataReport,
	GetOrderMonthSummaryStat,
	GetBanquetOrderStat,
	ChangeYHTaskExecutor
};
