import app from '@/common/request.js'

// 获取当前用户信息
const GetViewPage = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 获取客户列表信息
const GetCstPoolList = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCstPoolList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 获取客户详情信息
var GetCustomerDetail = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCustomerDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取 [客户管理] 分页的信息
const GetPage = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 根据 customId 这单个参数查询当前用户
const GetViewDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}
// 创建新用户
const CreateNewCustom = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY19/CreateNewCustom',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}
// 创建 or 更新客户（默认创建）
const CreateOrUpdateByDto = async (data, success, fail, isUpdate = false, isShowLoading = true, ) => {
	let url = '/api/services/app/CY19/CreateByDto'
	if(data.id){
		url = '/api/services/app/CY19/UpdateByDto'
	}

	return await app.Request({
		url: url,
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	})
}

// 根据customerId查询客户详情
const GetCustomDetailById = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCustomDetailById',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

const GetCustomFeeMonthDetailById = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCustomFeeMonthDetailById',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

const GetCustomFeeYearSummaryById = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCustomFeeYearSummaryById',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

// 获取统计信息
const GetCustomerConsumeStat = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetCustomerConsumeStat',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

// 获取筛选条件
const GetFilterGroups = async (data, success, fail, isShowLoading = false) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetFilterGroups',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

// 获取客户信息列表
const GetAppCustomList = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/GetAppCustomList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}
// 更换客户客户经理
const ChangeCstMarketer = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/ChangeCstMarketer',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 将客户移入跟踪列表
const CstMoveToTrackList = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY19/CstMoveToTrackList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取通讯录 or 通讯记录信息 「1 是通讯录 2 是通讯记录」
const GetAddressBookInformation = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY19/GetAddressBookInformation',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

//获取用户信息
const GetFilteredCustomers = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY19/GetFilteredCustomers',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

const SearchHomeCustomers = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY19/SearchHomeCustomers',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}



export default {
	GetViewPage,
	GetCstPoolList,
	GetCustomerDetail,
	GetPage,
	GetViewDto,
	CreateNewCustom,
	CreateOrUpdateByDto,
	GetCustomFeeMonthDetailById,
	GetCustomFeeYearSummaryById,
	GetCustomerConsumeStat,
	UpdateByDto,
	GetCustomDetailById,
	GetFilterGroups,
	GetAppCustomList,
	ChangeCstMarketer,
	CstMoveToTrackList,
	GetAddressBookInformation,
	GetFilteredCustomers,
	SearchHomeCustomers
};
