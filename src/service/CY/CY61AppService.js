import app from '@/common/request.js';

// 客户跟踪查询
const GetSalesForecast = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY61/GetSalesForecast',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

// 提醒：延迟五天提醒/当月不在提醒
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY61/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

// 客户跟踪查询id集合
const GetSalesForecastIDs = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY61/GetSalesForecastIDs',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};
// 刷新跟踪机会
const CalculaSalesForecast = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY61/CalculaSalesForecast',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};
// 获取客户列表GetCustomerTrackiList
const GetCustomerTrackiList = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY61/GetCustomerTrackiList',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};
// 群发短信添加跟踪记录
var MassTextAddFollow = async (data, success, fail, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY61/MassTextAddFollow',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

// 获取当月个人跟踪情况
var GetCurrMonthMyTrackStat = async (data, success, fail, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY61/GetCurrMonthMyTrackStat',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
    abpFail: fail
  });
};

export default {
  GetSalesForecast,
  UpdateByDto,
  GetSalesForecastIDs,
  CalculaSalesForecast,
  GetCustomerTrackiList,
  MassTextAddFollow,
  GetCurrMonthMyTrackStat
};
