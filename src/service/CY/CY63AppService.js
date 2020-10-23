import app from '@/common/request.js'

// 获取取消原因(value=1) / 获取机会备注(value=4)
const GetViewPage = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY63/GetViewPage',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取取消原因(value=1) / 获取机会备注(value=4)
const GetLabelFilter = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY63/GetLabelFilter',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 添加备注
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY63/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 删除备注
const DeleteByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/CY63/DeleteByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
export default {
	GetViewPage,
	GetLabelFilter,
	CreateByDto,
	DeleteByDto
};
