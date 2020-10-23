import app from '@/common/request.js'

// 添加客户池变更记录
var CreateByDto = async (data, success, fail, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY65/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail,
  });
};

export default {
  CreateByDto,
};
