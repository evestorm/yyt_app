import app from '@/common/request.js';

//获取分享详情数据
const GetDetailedDataOfSharing = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/GK12/GetDetailedDataOfSharing',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

export default {
	GetDetailedDataOfSharing
};
