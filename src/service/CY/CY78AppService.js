import app from '@/common/request.js';

// 获取指定跟踪条件信息
const GetFollowCondtion = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY78/GetFollowCondtion',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

// 根据指定跟踪条件获取对应条件客户的人数
const GetCondtionCstCount = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY78/GetCondtionCstCount',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};

// 创建任务跟踪清单
const CreateFollowOrders = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY78/CreateFollowOrders',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};
// 获取跟踪任务配置条件
const GetCustomerConditionConfig = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/CY78/GetCustomerConditionConfig',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};
// 获取标签
const GetViewDto = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY78/GetViewDto',
	  data: data,
	  isObj: false,
	  isShowLoading: isShowLoading,
	  abpSuccess: success
	});
}
export default  {
	GetFollowCondtion,
	GetCondtionCstCount,
	CreateFollowOrders,
	GetCustomerConditionConfig,
	GetViewDto
};