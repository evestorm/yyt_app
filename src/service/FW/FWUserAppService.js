import app from '@/common/request.js'

// 用户修改密码
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/FWUser/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 忘记密码
const UpdatePwdByMsg = async (data, success, fail, isShowLoading = true) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/FWUser/UpdatePwdByMsg',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
	isNotNeedToken:true
  });
};


export default {
  UpdateByDto,
  UpdatePwdByMsg
};
