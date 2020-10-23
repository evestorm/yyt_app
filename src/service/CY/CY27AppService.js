import app from '@/common/request.js'

// 添加销售机会
var CreateByDto = async (data, success, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY27/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  CreateByDto,
};
