import app from '@/common/request.js'

//  协同任务跟踪任务上报
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/XTTaskFollow/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

export default {
	UpdateByDto,
};
