import app from '@/common/request.js'

// 获取门店优惠券
const GetViewPage = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};
const GetViewDto = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};

const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
const GetMonthFollowBillboard = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMonthFollowBillboard',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
}
const GetMarketMonthSummary = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMarketMonthSummary',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	})
}

// 月统计页面穿透页 => 客户池列表
const GetMonthReportRankDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMonthReportRankDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 月统计页面穿透页 => 获取月统计客户跟踪明细
const GetMonthReportTrackDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMonthReportTrackDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 月统计页面穿透页 => 获取月统计订单明细
const GetMonthReportOrderDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMonthReportOrderDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 获取月统计客户经理列表
const GetMonthMarketPagedList = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY17/GetMonthMarketPagedList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

export default {
	GetViewPage,
	// GetViewPageSelect,
	GetViewDto,
	UpdateByDto,
	GetMonthFollowBillboard,
	GetMarketMonthSummary,
	GetMonthReportRankDetail,
	GetMonthReportTrackDetail,
	GetMonthReportOrderDetail,
	GetMonthMarketPagedList
}
