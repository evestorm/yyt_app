import app from '@/common/request.js'

// 获取客户标签
const GetViewPage = async (data, success, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY59/getViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

// 获取全部标签
const GetTagDetails = async (data, success, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY59/GetTagDetails',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

// 添加标签
const CreateByDto = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY59/CreateByDto',
	  data: data,
	  isObj: true,
	  isShowLoading: isShowLoading,
	  abpSuccess: success
	});
}


// 删除标签
const Delete = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY59/Delete',
	  data: data,
	  isObj: false,
	  isShowLoading: isShowLoading,
	  abpSuccess: success
	});
}

// 编辑标签
const GetViewDto = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY59/GetViewDto',
	  data,
	  isObj: false,
	  isShowLoading,
	  abpSuccess: success
	});
}

// 更新标签
const UpdateByDto = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY59/UpdateByDto',
	  data,
	  isObj: true,
	  isShowLoading,
	  abpSuccess: success
	});
}

// 刷新标签
const RefreshTagOfCsts = async (data, success, isShowLoading = true) => {
	const self = this;
	return await app.Request({
	  url: '/api/services/app/CY59/RefreshTagOfCsts',
	  data,
	  isObj: true,
	  isShowLoading,
	  abpSuccess: success
	});
}

export default {
  GetViewPage,
  GetTagDetails,
  CreateByDto,
  Delete,
  GetViewDto,
  UpdateByDto,
  RefreshTagOfCsts
};
