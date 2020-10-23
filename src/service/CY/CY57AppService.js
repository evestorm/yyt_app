import app from '@/common/request.js'

// 通讯录快捷搜索
const FastSearchOfAddressBook = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY57/FastSearchOfAddressBook',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取跟踪记录
const GetCallAndConsumeLog = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY57/GetCallAndConsumeLog',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

const GetCustomFollowChangeData = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY57/GetCustomFollowChangeData',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};


// 获取客户获取客户消费和跟踪信息
const GetCustomerPayAndFollowInfo = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY57/GetCustomerPayAndFollowInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 添加通讯记录
const CreateByDto = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY57/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

export default {
	FastSearchOfAddressBook,
	GetCallAndConsumeLog,
	GetCustomFollowChangeData,
	GetCustomerPayAndFollowInfo,
	CreateByDto
}
