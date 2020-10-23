import app from '@/common/request.js';

// 获取门店所有数据
const GetAllTheStoreData = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/GZH09/GetAllTheStoreData',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};


export default {
	GetAllTheStoreData
};
