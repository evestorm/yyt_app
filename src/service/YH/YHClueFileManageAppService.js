import app from '@/common/request.js'
// 删除图片文件记录
const DeleteByDto = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/YHClueFileManage/DeleteByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};
//创建文件图片上传记录 
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
  return await app.Request({
    url: '/api/services/app/YHClueFileManage/CreateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
		abpFail: fail
  });
};
export default {
	DeleteByDto,
	CreateByDto
};