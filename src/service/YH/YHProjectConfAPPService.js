import app from '@/common/request.js'

// 获取获取项目配置
const GetProjectConfList = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/YHProjectConf/GetProjectConfList',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};

export default {
	GetProjectConfList
};