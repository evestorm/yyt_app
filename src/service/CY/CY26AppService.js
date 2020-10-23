import app from '@/common/request.js';

// 获取线索预订类型
const GetViewPageSelect = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY26/GetViewPageSelect',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
export default {
	GetViewPageSelect
}
