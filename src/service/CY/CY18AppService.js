import app from '@/common/request.js'

// 获取客户经理
const GetViewPage = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取餐别列表
const GetDiningTypeInApp = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY23/GetDiningTypeInApp',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取门店列表信息
const GetStoreByLoginPerson = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetStoreByLoginPerson',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取当前登录用户的各种权限
const GetSalesAuthority = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetSalesAuthority',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
//获取执行人列表
const GetViewPageSelect = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetViewPageSelect',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};
const GetStoreManager = async (data, success, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetStoreManager',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};
// 获取当前门店经理
const GetCurrentStoreManager = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetCurrentStoreManager',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};
// 获取当前门店经理===只有客服经理
const GetCustomerServiceManager = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY18/GetCustomerServiceManager',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success
	});
};
 
export default {
	GetViewPage,
	GetDiningTypeInApp,
	GetViewPageSelect,
	GetStoreByLoginPerson,
	GetSalesAuthority,
	GetStoreManager,
	GetCurrentStoreManager,
	GetCustomerServiceManager
};
