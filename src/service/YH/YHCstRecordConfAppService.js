import app from '@/common/request.js'

//修改档案列表
var UpdateByDto = async (data, success, fail,isShowLoading = true) => {
   return await UseFunction(data, success, fail, isShowLoading,'/api/services/app/YHCstRecordConf/UpdateByDto');
};

//添加档案列表
var CreateByDto = async (data, success, fail,isShowLoading = true) => {
    return await UseFunction(data, success, fail, isShowLoading,'/api/services/app/YHCstRecordConf/CreateByDto');
};

//获取档案列表
var GetCstRecordConf = async (data, success, fail,isShowLoading = true) => {
   return await  UseFunction(data, success, fail, isShowLoading,'/api/services/app/YHCstRecordConf/GetCstRecordConf');
};

//获取单个档案
var GetViewDto = async (data, success, fail,isShowLoading = true) => {
   return await  UseFunction(data, success, fail, isShowLoading,'/api/services/app/YHCstRecordConf/GetViewDto?id='+data.id);
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

// 获取档案类别
let GetRecordConfList = async (data, success, fail, isShowLoading = true) => {
    let self = this
    return await app.Request({
        url: '/api/services/app/YHCstRecordConf/GetRecordConfList',
        data: data,
        isObj: true,
        isShowLoading: isShowLoading,
        abpSuccess: success,
        abpFail: fail
    })
};



export default {
	GetCstRecordConf,
	UpdateByDto,
	CreateByDto,
    GetRecordConfList,
	GetViewDto
};