import app from '@/common/request.js'

// 获取宴会主题
const GetThemeConfList = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/YHThemeConf/GetThemeConfList',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};

export default {
	GetThemeConfList
};