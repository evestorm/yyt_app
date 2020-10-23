import app from '@/common/request.js';

// 新增预订单
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY71/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

export default  {
	CreateByDto
};