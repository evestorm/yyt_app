import app from '@/common/request.js'

// 登录
const GetCurrentAppUserAsync = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/Session/GetCurrentAppUserAsync',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 登出
const ClearCurrentAppUserSessionAsync = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/Session/ClearCurrentAppUserSessionAsync',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
}

export default {
	GetCurrentAppUserAsync,
	ClearCurrentAppUserSessionAsync
};
