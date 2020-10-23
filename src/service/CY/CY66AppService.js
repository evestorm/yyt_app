import app from '@/common/request.js'

const GetSalesTarget = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY66/GetSalesTarget',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

const GetStoreSaleTarget = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY66/GetStoreSaleTarget',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};


const CreateByDto  = async (data, success, fail, isShowLoading = true) => {
	var self = this;
	return await app.Request({
		url: '/api/services/app/CY66/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};


export default {
	GetSalesTarget,
	GetStoreSaleTarget,
	CreateByDto
	
};
