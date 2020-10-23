import app from '@/common/request.js';

// 获取桌台
const GetCustomLabel = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY60/GetCustomLabel',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail,
  });
};

// 获取用户标签
const GetCustomerLable = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY60/GetCustomerLable',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	  abpFail: fail,
  });
};

// 保存标签
const CustomerMakeTag = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY60/CustomerMakeTag',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	  abpFail: fail,
  });
};

// 更新客户标签（批量操作）
const LabelingForCustomers = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY60/LabelingForCustomers',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	  abpFail: fail,
  });
};

export default {
  GetCustomLabel,
  GetCustomerLable,
  CustomerMakeTag,
  LabelingForCustomers
};
