import app from '@/common/request.js'

// 获取餐别列表
var GetDiningTypeInApp = async (data, success, fail, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY23/GetDiningTypeInApp',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

export default {
  GetDiningTypeInApp,
};
