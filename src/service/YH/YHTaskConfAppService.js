import app from '@/common/request.js'

// 获取任务配置
const GetTaskConfList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHTaskConf/GetTaskConfList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 获取关联任务信息
const GetRelatedTaskInfo = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHTaskConf/GetRelatedTaskInfo',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 创建关联任务
const CreateRelatedTask = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHTaskConf/CreateRelatedTask',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
export default {
	GetTaskConfList,
	GetRelatedTaskInfo,
	CreateRelatedTask
};
