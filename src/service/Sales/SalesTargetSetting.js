import app from '@/common/request.js'

let ruleconfig = async (data, success, fail, isShowLoading = true) => {
  let self = this;
  return await app.Request({
    url: '/data/SalesTargetSetting/ruleconfig.json',
	method: 'GET',
	isObj: true,
	dataType: 'json',
	isShowLoading: isShowLoading,
	abpSuccess: success,
	abpFail: fail,
  });
};
export default {
	ruleconfig
}