import app from '@/common/request.js'

// 登录
const UserLogin = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/UserLogin',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
		isNotNeedToken:true
	});
};

// 用户修改密码
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

const GetHomeDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/GetHomeDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 保存首页设置信息
const SetAppHomeConfig = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/SetAppHomeConfig',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};


// 判断是否要重新登录
const JudgeLoginAgain = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/JudgeLoginAgain',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 上传手机RegId
const SetJGRegId = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/SetJGRegId',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};

// 获取首页顶部导航数据
const GetHomeOperateDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/UR01/GetHomeOperateDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail,
	});
};


export default {
	UserLogin,
	UpdateByDto,
	GetHomeDetail,
	SetAppHomeConfig,
	JudgeLoginAgain,
	SetJGRegId,
	GetHomeOperateDetail
};
