import app from '@/common/request.js'

// 获取协同任务列表
const GetXTTaskPagedList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/XTTask/GetXTTaskPagedList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 协同任务详情
const GetXTTaskDetail = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/XTTask/GetXTTaskDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

export default {
	GetXTTaskPagedList,
	GetXTTaskDetail
};
