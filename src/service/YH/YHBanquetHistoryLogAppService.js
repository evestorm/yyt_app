import app from '@/common/request.js'

// 获取宴会单操作日志
const GetBanquetHistoryLogs = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetHistoryLog/GetBanquetHistoryLogs',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
//创建宴会单操作日志
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHBanquetHistoryLog/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
export default {
	GetBanquetHistoryLogs,
	CreateByDto
};
