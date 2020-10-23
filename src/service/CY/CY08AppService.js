import app from '@/common/request.js';

// 获取桌台
const GetTabelInApp = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY08/GetTabelInApp',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

export default {
	GetTabelInApp,
};