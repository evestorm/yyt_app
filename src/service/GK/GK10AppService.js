import app from '@/common/request.js';

// 获取桌台
const GetShareInfo = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/GK10/GetShareInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
const DownloadShareQrCode = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/GK10/DownloadShareQrCode',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 获取分享数据报表
const GetSharedDataReport = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK10/GetSharedDataReport',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 获取营销中心数据(tabbar)
const GetMarketingCenterData = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK10/GetMarketingCenterData',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 获取营销活动
const AccessToMarketingActivities = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK10/AccessToMarketingActivities',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 获取订单详情
const GetOrderDetails = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK10/GetOrderDetails',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 获取活动名称(筛选)
const GetActivityName = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/GK10/GetActivityName',
		data,
		isObj: true,
		isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}
export default {
	GetShareInfo,
	DownloadShareQrCode,
	GetSharedDataReport,
	GetMarketingCenterData,
	AccessToMarketingActivities,
	GetOrderDetails,
	GetActivityName
};
