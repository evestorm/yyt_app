import app from '@/common/request.js';

// 获取桌台
const GetViewPage = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY77/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

const GetQuickReplyFilter = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY77/GetQuickReplyFilter',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

export default  {
	GetViewPage,
	GetQuickReplyFilter
};