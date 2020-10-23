import app from '@/common/request.js';

// 获取卡券信息
const GetUserCardList = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/GK07/GetUserCardList',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 核销
const WriteOffTheCard = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/GK07/WriteOffTheCard',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 获取优惠券类型
const GetCouponType = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/GK07/GetCouponType',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 获取核销记录
const GetWriteOffRecords = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/GK07/GetWriteOffRecords',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

export default {
	GetUserCardList,
	WriteOffTheCard,
	GetCouponType,
	GetWriteOffRecords,
};