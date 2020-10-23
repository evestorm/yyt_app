import app from '@/common/request.js';

const SendCode = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/GK01/SendCode',
    data: data,
    isObj: false,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
	isNotNeedToken:true
  });
};
export default {
	SendCode
};