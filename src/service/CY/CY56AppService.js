import app from '@/common/request.js';
// 编辑评论
let UpdateByDto = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY56/UpdateByDto',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};
//获取平均评分 和好评率
let GetGrade = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY56/GetGrade',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};
let GetDataPage = async (data, success, fail, isShowLoading = true) => {
  const self = this;
  return await app.Request({
    url: '/api/services/app/CY56/GetDataPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success,
	abpFail: fail
  });
};
// 删除评论
let Delete = async (data, success, fail) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/CY56/Delete?id='+data,
    isObj: true,
    abpSuccess: success,
	abpFail: fail,
  });
};

// 评论筛选
let GetCommentFilter = async (data, success, fail) => {
  let self = this;
  return await app.Request({
    url: '/api/services/app/CY56/GetCommentFilter',
    isObj: true,
    abpSuccess: success,
	abpFail: fail,
  });
};

export default {
	UpdateByDto,
	Delete,
	GetGrade,
	GetDataPage,
	GetCommentFilter
};