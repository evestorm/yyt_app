import app from '@/common/request.js'

//获取档案名称
var GetRecordConfDto = async (data, success, fail,isShowLoading = true) => {
 
  return await app.Request({
      url: '/api/services/app/YHCstRecord/GetViewDto',
      data: data,
      isObj: false,
      isShowLoading: isShowLoading,
      abpSuccess: success,
      abpFail: fail
  })
};

//修改档案列表
var UpdateByDto = async (data, success, fail,isShowLoading = true) => {
  
  return await app.Request({
      url: '/api/services/app/YHCstRecord/UpdateByDto',
      data: data,
      isObj: true,
      isShowLoading: isShowLoading,
      abpSuccess: success,
      abpFail: fail
  })
};

//添加档案列表
var CreateByDto = async (data, success, fail,isShowLoading = true) => {
 return await app.Request({
     url: '/api/services/app/YHCstRecord/CreateByDto',
     data: data,
     isObj: true,
     isShowLoading: isShowLoading,
     abpSuccess: success,
     abpFail: fail
 })
};




var UseFunction = async (data, success, fail,isShowLoading = true,url) => {
    var self = this;
    return await app.Request({
        url: url,
        data: data,
        isObj: true,
        isShowLoading: isShowLoading,
        abpSuccess: success,
        abpFail: fail
    })
};

let Delete = async (data, success, fail, isShowLoading = true) => {
    // let self = this
    return await app.Request({
        url: '/api/services/app/YHCstRecord/DeleteByDto',
        data: data,
        isObj: true,
        isShowLoading: isShowLoading,
        abpSuccess: success,
        abpFail: fail
    })
}


export default {
	UpdateByDto,
	CreateByDto,
	GetRecordConfDto,
    Delete
};