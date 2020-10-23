import app from '@/common/request.js';

// 获取桌台
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY82/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};

export default {
	CreateByDto,
};