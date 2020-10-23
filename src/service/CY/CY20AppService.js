import app from '@/common/request.js'

// 取消订单
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 新增新订单
const CreateOrder = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/CreateOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
		duration: 5000
	});
};

// 获取餐别订单
const GetOrderInfo = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: `/api/services/app/CY20/GetOrderInfo`,
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 修改订单
const UpdateOrder = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/UpdateOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 今日预订统计信息
const getTodyBookSummary = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/getTodyBookSummary',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 今日预订列表信息
const GetTodyBook = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/GetTodyBook',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 全部关单
const BatchCloseOrder = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/BatchCloseOrder',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 单个关单
const BatchCloseOrderByIds = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/BatchCloseOrderByIds',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取今日订单销售经理集合
const GetOrderMarkets = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/GetOrderMarkets',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取预订台筛选数据
const GetReserveAdvance = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/GetReserveAdvance',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 获取门店预订报表
const GetAppBookStoreReport = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/GetAppBookStoreReport',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
//审核订单
const Operbook = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY20/Operbook',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
//通过电话查询客户信息
const Searchuser = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY20/Searchuser',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
//通过单位查询客户信息
const Searchcompany = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY20/Searchcompany',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
export default {
	UpdateByDto,
	CreateOrder,
	GetOrderInfo,
	UpdateOrder,
	getTodyBookSummary,
	GetTodyBook,
	BatchCloseOrder,
	BatchCloseOrderByIds,
	GetOrderMarkets,
	GetReserveAdvance,
	GetAppBookStoreReport,
	Operbook,
	Searchuser,
	Searchcompany
};
