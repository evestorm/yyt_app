import app from '@/common/request.js'

// 获取单位列表
const GetViewPage = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY22/GetViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 获取公司列表
const GetCompany = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY22/GetCompany',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

//获取公司筛选
const GetFilterEnterprise = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY22/GetFilterEnterprise',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

export default {
  GetViewPage,
  GetCompany,
  GetFilterEnterprise
};
