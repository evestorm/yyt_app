import app from '@/common/request.js'

// 获取快捷备注tag列表（机会备注，客户来源）
const GetGridDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/FWBizOption/GetGridDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 添加快捷备注tag
const CreateDictOption = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/FWBizOption/CreateDictOption',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 删除快捷备注tag
const DeleteByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/FWBizOption/DeleteByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

export default {
	GetGridDto,
	CreateDictOption,
	DeleteByDto
};
