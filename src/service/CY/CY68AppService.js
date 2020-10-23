import app from '@/common/request.js'

let GetViewPage = async (data, success, fail) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/CY68/GetViewPage',
    data: data,
    isObj: true,
    abpSuccess: success,
	abpFail: fail,
  });
};

let GetTemplateParameterFilter = async (data, success, fail,isShowLoading = true) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/CY68/GetTemplateParameterFilter',
    data: data,
    isObj: true,
	isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};
export default {
	GetViewPage,
	GetTemplateParameterFilter
}