import app from '@/common/request.js'

// 获取APP消息通知列表
const GetAPPNotificationList = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/TZUserMessage/GetAPPNotificationList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

//  更新通知消息为已读
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/TZUserMessage/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};
export default {
	GetAPPNotificationList,
	UpdateByDto
};
